// File: app/page.tsx
"use client";

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700">
                AI Web Search
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sign in
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Discover the Power of</span>
            <span className="block text-blue-600">AI-Powered Web Search</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Experience lightning-fast, intelligent web search powered by Tavily API and OpenAI. Get accurate, contextual results with source citations in seconds.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                href="/auth/login"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                Try it Now
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="relative p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">Intelligent Search</h3>
              <p className="mt-2 text-sm text-gray-500">
                Advanced AI algorithms understand your queries and provide relevant, accurate results.
              </p>
            </div>
          </div>
          <div className="relative p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">Source Citations</h3>
              <p className="mt-2 text-sm text-gray-500">
                Every result comes with verified sources, ensuring transparency and reliability.
              </p>
            </div>
          </div>
          <div className="relative p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">Lightning Fast</h3>
              <p className="mt-2 text-sm text-gray-500">
                Get comprehensive search results in seconds, not minutes.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-24">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-400">
            © 2024 AI Web Search. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}