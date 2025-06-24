import { useState, useEffect, useRef } from 'react';
import { FiSearch } from 'react-icons/fi';
import LoadingSpinner from './common/LoadingSpinner';

const SearchBar = ({ 
  placeholder = 'Search products, brands and categories', 
  onSearch, 
  delay = 300,
  results = [],
  onResultSelect,
  loading = false
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const previousQueryRef = useRef('');

  useEffect(() => {
    const trimmedQuery = query.trim();
    
    // Only proceed if query has actually changed
    if (trimmedQuery === previousQueryRef.current) {
      return;
    }

    previousQueryRef.current = trimmedQuery;

    const timer = setTimeout(() => {
      if (trimmedQuery) {
        onSearch(trimmedQuery);
      } else {
        onSearch(''); // Clear results when query is empty
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay, onSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery && trimmedQuery !== previousQueryRef.current) {
      onSearch(trimmedQuery);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xl">
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-24 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 placeholder:text-xs lg:placeholder:text-base focus:outline-none  focus:ring-primary-light focus:border-primary-light sm:text-sm"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />
        
        {/* Loading indicator */}
        {loading && (
          <div className="absolute inset-y-0 right-20 flex items-center pr-3">
            <LoadingSpinner size="sm" />
          </div>
        )}

        <button
          type="submit"
          className="absolute cursor-pointer right-0 h-full px-2 lg:px-4 py-2 text-white rounded-r-lg bg-primary-light hover:bg-primary-dark transition-colors"
          disabled={loading}
         
        >
          Search
        </button>
      </div>
      
      {/* Results dropdown */}
      {isFocused && (query || results.length > 0) && (
        <div className="absolute z-50 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm max-h-60">
          {loading ? (
            <div className="px-4 py-2 text-gray-500 text-center">Searching...</div>
          ) : results.length === 0 && query ? (
            <div className="px-4 py-2 text-gray-500">No results found</div>
          ) : (
            results.map((result, index) => (
              <div
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => {
                  onResultSelect(result);
                  setQuery('');
                  setIsFocused(false);
                }}
              >
                {result.icon && (
                  <img 
                    src={result.icon} 
                    alt="" 
                    className="w-5 h-5 mr-2 object-contain"
                  />
                )}
                <div>
                  <div className="font-medium">{result.name || result.title}</div>
                  {result.type && (
                    <div className="text-xs text-gray-500 capitalize">
                      {result.type}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </form>
  );
};

export default SearchBar;