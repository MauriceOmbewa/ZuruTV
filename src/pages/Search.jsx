import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import GoWatchService from '../services/gowatch';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [searchParams]);

  const performSearch = async (query) => {
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);

    try {
      const [movieResults, tvResults] = await Promise.all([
        GoWatchService.searchMovies(query),
        GoWatchService.searchTVShows(query),
      ]);

      const combinedResults = [
        ...(movieResults.results || []).map(item => ({ ...item, type: 'movie' })),
        ...(tvResults.results || []).map(item => ({ ...item, type: 'tv' })),
      ];

      // Sort by popularity
      combinedResults.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

      setSearchResults(combinedResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-6">Search Movies & TV Shows</h1>
          
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for movies, TV shows..."
                className="w-full px-6 py-4 pl-12 text-lg bg-dark-1 text-white rounded-lg border border-dark-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <SearchIcon className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-2 bg-primary text-background px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Search Results */}
        {hasSearched && (
          <div>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {searchResults.length > 0 ? (
                  <>
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-white">
                        Found {searchResults.length} results for "{searchParams.get('q')}"
                      </h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                      {searchResults.map((item) => (
                        <MovieCard key={`${item.type}-${item.id}`} item={item} type={item.type} />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <SearchIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-white mb-2">No results found</h2>
                    <p className="text-gray-400">Try searching with different keywords</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Initial State */}
        {!hasSearched && (
          <div className="text-center py-12">
            <SearchIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Search for your favorite content</h2>
            <p className="text-gray-400">Enter a movie or TV show title to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;