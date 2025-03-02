// File: app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Tavily API search function
async function tavilySearch(query: string, searchDepth: string = 'basic', maxResults: number = 5) {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error('TAVILY_API_KEY is not defined');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        query,
        search_depth: searchDepth,
        include_answer: false,
        include_images: false,
        max_results: maxResults,
        get_raw_content: true,
        include_domains: [],
        exclude_domains: []
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Tavily API failed: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

// Mistral LLM function to generate response
async function generateResponse(query: string, searchResults: any) {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    throw new Error('MISTRAL_API_KEY is not defined');
  }
  
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    // Extract and format content from search results with better structure
    const formattedResults = searchResults.results.map((result: any) => {
      return `Source: ${result.title || result.url}\n\nContent:\n${result.content}\n\nURL: ${result.url}\n---\n`;
    });
    
    // Join all formatted content with clear separators
    const context = formattedResults.join('\n');
    
    // Prepare sources for the response
    const sources = searchResults.results.map((result: any) => ({
      url: result.url,
      title: result.title || result.url
    }));

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that provides accurate, comprehensive answers based on the search results provided. Follow these guidelines:\n\n1. Format your response in clean Markdown:\n   - Use headers (##) for main sections\n   - Use bullet points for lists\n   - Use bold for emphasis\n   - Include code blocks when relevant\n\n2. Structure your response:\n   - Start with a brief overview\n   - Provide detailed explanations\n   - Include relevant examples\n   - End with a conclusion if appropriate\n\n3. Source handling:\n   - Cite sources naturally within the text\n   - Mention source titles/URLs when introducing key information\n   - Synthesize information from multiple sources\n   - Highlight any conflicting information between sources\n\n4. Quality guidelines:\n   - Ensure accuracy and completeness\n   - Be clear and concise\n   - Maintain objectivity\n   - Address all aspects of the query\n\nAnalyze the provided content thoroughly and create a well-structured response that effectively answers the query.'
          },
          {
            role: 'user',
            content: `Query: ${query}\n\nSearch Results:\n${context}`
          }
        ],
        temperature: 0.2,
        max_tokens: 1000
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Mistral API failed: ${errorText}`);
    }

    const data = await response.json();
    return {
      answer: data.choices[0].message.content,
      sources
    };
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

// Check if user has exceeded usage limits
async function checkUsageLimit(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { usageLimit: true, currentUsage: true }
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user.currentUsage < user.usageLimit;
}

// Increment usage count for a user
async function incrementUsage(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { currentUsage: { increment: 1 } }
  });
}

// Record search in database
async function recordSearch(userId: string, query: string, searchDepth: string, maxResults: number): Promise<void> {
  await prisma.search.create({
    data: {
      query,
      searchDepth,
      maxResults,
      userId
    }
  });
}

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    const { query, searchDepth = 'basic', maxResults = 5 } = await request.json();
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Valid query is required' }, { status: 400 });
    }
    
    if (searchDepth !== 'basic' && searchDepth !== 'advanced') {
      return NextResponse.json({ error: 'Invalid search depth' }, { status: 400 });
    }

    if (maxResults < 5 || maxResults > 10) {
      return NextResponse.json({ error: 'Max results must be between 5 and 10' }, { status: 400 });
    }
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 403 });
    }

    // Check if user has exceeded usage limits
    const hasRemainingUsage = await checkUsageLimit(user.id);
    if (!hasRemainingUsage) {
      return NextResponse.json({ 
        error: 'Usage limit exceeded. Please upgrade your plan to continue.',
        upgradeRequired: true
      }, { status: 403 });
    }
    
    // Step 1: Search with Tavily
    const searchResults = await tavilySearch(query, searchDepth, maxResults);
    
    // Step 2: Generate response with Mistral LLM
    const aiResponse = await generateResponse(query, searchResults);
    
    // Step 3: Record search and increment usage
    await Promise.all([
      recordSearch(user.id, query, searchDepth, maxResults),
      incrementUsage(user.id)
    ]);
    
    return NextResponse.json({
      answer: aiResponse.answer,
      sources: aiResponse.sources
    });
  } catch (error) {
    console.error('Search API error:', error);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json({ error: 'Request timed out. Please try again.' }, { status: 504 });
      }
      if (error.message.includes('TAVILY_API_KEY') || error.message.includes('MISTRAL_API_KEY')) {
        return NextResponse.json({ error: 'API configuration error. Please try again later.' }, { status: 500 });
      }
    }
    return NextResponse.json({ error: 'An error occurred processing your request. Please try again.' }, { status: 500 });
  }
}