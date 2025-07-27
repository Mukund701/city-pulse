// apps/web/src/components/ui/search-bar.tsx
'use client';

import { Search, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

// Define the type for a city suggestion
type CitySuggestion = {
  id: number;
  name: string;
  country: string;
};

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    const timer = setTimeout(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/search?q=${query}`)
        .then((res) => res.json())
        .then((data) => setSuggestions(data))
        .catch((err) => console.error("Search fetch error:", err))
        .finally(() => setIsLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);

  return (
    <div className="w-full max-w-2xl mx-auto relative" ref={searchContainerRef}>
      <div className="relative w-full p-px rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 [background-size:400%_400%]"
           style={{ animation: "gradient-flow 8s ease infinite" }}>
        <div className="relative flex items-center bg-secondary rounded-full px-4 py-2">

          <div className="pl-2 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>

          <input
            type="search"
            placeholder="Search for cities..."
            className="flex-1 w-full p-2 pl-3 bg-transparent text-foreground placeholder-muted-foreground outline-none border-none text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          {isLoading && (
            <div className="flex items-center mr-4">
              <LoaderCircle className="h-5 w-5 text-muted-foreground animate-spin" />
            </div>
          )}
          {/* ================================================================= */}
          {/* ========= UPDATED: Button classes to match v0 design ============ */}
          <button
            type="submit"
            className="text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 font-medium rounded-full text-sm px-6 py-2 transition-all duration-200 flex-shrink-0"
            onClick={(e) => e.preventDefault()}
          >
            Search
          </button>
          {/* ================================================================= */}
        </div>
      </div>

      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-2 bg-secondary border border-border rounded-lg shadow-lg overflow-hidden">
          {suggestions.map((city) => (
            <li key={city.id}>
              <Link
                href={`/cities/${encodeURIComponent(city.name.toLowerCase())}`}
                className="block w-full text-left px-4 py-3 text-sm hover:bg-primary/10 transition-colors"
                onClick={() => {
                  setQuery(city.name);
                  setSuggestions([]);
                }}
              >
                {city.name}, {city.country}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}