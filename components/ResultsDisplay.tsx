// File: components/ResultsDisplay.tsx
interface Source {
    url: string;
    title: string;
  }
  
  interface ResultsDisplayProps {
    answer: string;
    sources: Source[];
    query: string;
  }
  
  const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ answer, sources, query }) => {
    return (
      <div className="mt-12 space-y-8 w-full">
        <div className="bg-white p-8 rounded-2xl shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
          <h2 className="text-2xl font-semibold tracking-tight mb-6">
            {query}
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            {answer.split('\n').map((paragraph, idx) => (
              <p key={idx} className="mb-4 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        
        {sources.length > 0 && (
          <div className="bg-white p-8 rounded-2xl shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
            <h3 className="text-xl font-semibold tracking-tight mb-6">Sources</h3>
            <ul className="space-y-4">
              {sources.map((source, idx) => (
                <li key={idx} className="text-base">
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-black hover:text-gray-800 underline underline-offset-4"
                  >
                    {source.title || source.url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };
  
  export default ResultsDisplay;