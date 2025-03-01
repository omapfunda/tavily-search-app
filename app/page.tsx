// File: app/page.tsx
"use client";

import { useState } from 'react';
import SearchBar from '../components/SearchBar';
import ResultsDisplay from '../components/ResultsDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import "../styles/globals.css";


export default function Home() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [sources, setSources] = useState<Array<{url: string, title: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (searchQuery: string, searchDepth: string, maxResults: number) => {
    setQuery(searchQuery);
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery, searchDepth, maxResults }),
      });
      
      if (!response.ok) {
        throw new Error('Search request failed');
      }
      
      const data = await response.json();
      setResult(data.answer);
      setSources(data.sources || []);
    } catch (err) {
      setError('An error occurred while fetching results. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white">
      <div className="z-10 max-w-5xl w-full items-center justify-between text-sm lg:flex-col">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold tracking-tight mb-4">AI Web Search</h1>
          <p className="text-xl text-gray-600 mb-8">Powered by Tavily API and OpenAI.</p>
        </div>
        
        <SearchBar onSearch={handleSearch} />
        
        {isLoading && <LoadingSpinner />}
        
        {error && (
          <div className="p-4 mt-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        
        {result && !isLoading && (
          <ResultsDisplay answer={result} sources={sources} query={query} />
        )}
      </div>
    </main>
  );
}