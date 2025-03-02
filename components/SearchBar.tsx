// File: components/SearchBar.tsx
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string, searchDepth: string, maxResults: number) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [searchDepth, setSearchDepth] = useState('basic');
  const [maxResults, setMaxResults] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, searchDepth, maxResults);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your search query..."
          className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Search query"
        />
        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="searchDepth" className="text-sm text-gray-600 font-medium">Search Depth</label>
            <select
              id="searchDepth"
              value={searchDepth}
              onChange={(e) => setSearchDepth(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Basic search is faster, Advanced search provides more comprehensive results"
            >
              <option value="basic">Basic Search</option>
              <option value="advanced">Advanced Search</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="maxResults" className="text-sm text-gray-600 font-medium">Number of Results</label>
            <select
              id="maxResults"
              value={maxResults}
              onChange={(e) => setMaxResults(Number(e.target.value))}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Select how many search results you want to receive"
            >
              {[5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num} Results</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              title="Click to perform the search"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;



