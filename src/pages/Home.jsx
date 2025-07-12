import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import MovieGrid from '../components/MovieGrid';
import GoWatchService from '../services/gowatch';

const Home = () => {
  const [heroMovie, setHeroMovie] = useState(null);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularTVShows, setPopularTVShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [trending, popularTV] = await Promise.all([
          GoWatchService.getTrending('movie', 'week'),
          GoWatchService.getPopular('tv'),
        ]);

        setTrendingMovies(trending.results || []);
        setPopularTVShows(popularTV.results || []);
        setHeroMovie(trending.results?.[0] || null);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroBanner movie={heroMovie} />

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Trending Movies */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <span className="bg-primary text-background px-3 py-1 rounded-lg mr-4 text-lg">
              Trending
            </span>
            Movies This Week
          </h2>
          <MovieGrid
            items={trendingMovies}
            type="movie"
            loading={loading}
          />
        </section>

        {/* Popular TV Shows */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
            <span className="bg-primary text-background px-3 py-1 rounded-lg mr-4 text-lg">
              Popular
            </span>
            TV Shows
          </h2>
          <MovieGrid
            items={popularTVShows}
            type="tv"
            loading={loading}
          />
        </section>
      </div>
    </div>
  );
};

export default Home;