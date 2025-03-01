// File: app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Tavily API search function
async function tavilySearch(query: string, searchDepth: string = 'basic', maxResults: number = 5) {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error('TAVILY_API_KEY is not defined');
  }

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
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Tavily API failed: ${errorText}`);
  }

  return await response.json();
}

// Mistral LLM function to generate response
async function generateResponse(query: string, searchResults: any) {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) {
    throw new Error('MISTRAL_API_KEY is not defined');
  }
  
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
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Mistral API failed: ${errorText}`);
  }

  const data = await response.json();
  return {
    answer: data.choices[0].message.content,
    sources
  };
}

export async function POST(request: NextRequest) {
  try {
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
    
    // Step 1: Search with Tavily
    const searchResults = await tavilySearch(query, searchDepth, maxResults);
    
    // Step 2: Generate response with Mistral LLM
    const aiResponse = await generateResponse(query, searchResults);
    
    return NextResponse.json({
      answer: aiResponse.answer,
      sources: aiResponse.sources
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'An error occurred processing your request' }, { status: 500 });
  }
}