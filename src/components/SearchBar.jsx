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
        const inputRef = useRef(null);
        const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

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
            // Trigger search on Enter key regardless of previous query state
            if (trimmedQuery) {
                onSearch(trimmedQuery);
                setIsFocused(false); // Close dropdown on submit
                inputRef.current?.blur();
            }
        };

        return (
            <form onSubmit={handleSubmit} className="relative w-full max-w-full">
                <div className="relative flex items-center group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <FiSearch className={`text-xl transition-colors duration-200 
                            ${isFocused ? 'text-primary-light' : 'text-gray-400'}`} />
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        className={`block w-full pl-12 pr-24 py-3 bg-gray-100 border-2 border-transparent rounded-full leading-5 
                        placeholder-gray-500 placeholder:text-sm transition-all duration-300 ease-in-out
                        focus:outline-none focus:bg-white focus:border-primary-light 
                        focus:shadow-lg focus:shadow-primary-light/10 sm:text-sm`}
                        placeholder={placeholder}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    />
                    
                    {/* Loading indicator */}
                    {loading && (
                        <div className="absolute inset-y-0 right-24 flex items-center pr-3">
                            <LoadingSpinner size="sm" />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="absolute right-1.5 top-1.5 bottom-1.5 px-6 bg-primary-light 
                        hover:bg-primary-dark text-white text-sm font-medium rounded-full 
                        transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={loading}
                    >
                        {
                            isMobile ? (
                                <FiSearch className="text-lg" />
                            ) : (
                                'Search'
                            )
                        }
                    </button>
                </div>
                
                {/* Results dropdown */}
                {isFocused && (query || results.length > 0) && (
                    <div className="absolute z-50 mt-2 w-full bg-white shadow-xl rounded-2xl py-2 text-base 
                    ring-1 ring-black ring-opacity-5 overflow-hidden focus:outline-none sm:text-sm 
                    max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                    {loading ? (
                        <div className="px-4 py-3 text-gray-500 text-center text-sm">Searching...</div>
                    ) : results.length === 0 && query ? (
                        <div className="px-4 py-3 text-gray-500 text-center text-sm">No results found for "{query}"</div>
                    ) : (
                        results.map((result, index) => (
                        <div
                            key={index}
                            className="px-5 py-3 hover:bg-gray-50 cursor-pointer flex items-center border-b 
                            border-gray-50 last:border-0 transition-colors duration-150"
                            onClick={() => {
                            onResultSelect(result);
                            setQuery('');
                            setIsFocused(false);
                            }}
                        >
                            {result.icon ? (
                                <img 
                                    src={result.icon} 
                                    alt="" 
                                    className="w-10 h-10 mr-4 object-contain rounded-md bg-white p-1 border border-gray-100"
                                />
                            ) : (
                                <div className="w-10 h-10 mr-4 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                                    <FiSearch />
                                </div>
                            )}
                            <div>
                                <div className="font-medium text-gray-800">{result.name || result.title}</div>
                                {result.type && (
                                    <div className="text-xs text-primary-light font-medium uppercase tracking-wider mt-0.5">
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