import React, { useState } from 'react';
import { Play, Info, Plus, Check } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../context/AuthContext';
import GoWatchService from '../services/gowatch';
import toast from 'react-hot-toast';

const HeroBanner = ({ movie }) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const { user } = useAuth();
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!movie) return null;

  const inWatchlist = isInWatchlist(movie.id);

  const handleWatchlistToggle = () => {
    if (!user) {
      toast.error('Please login to add to watchlist');
      return;
    }

    if (inWatchlist) {
      removeFromWatchlist(movie.id);
      toast.success('Removed from watchlist');
    } else {
      addToWatchlist({ ...movie, type: 'movie' });
      toast.success('Added to watchlist');
    }
  };

  return (
    <div className="relative h-[70vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={GoWatchService.getBackdropUrl(movie.backdrop_path, 'original')}
          alt={movie.title}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
              {movie.title}
            </h1>
            
            <p className="text-lg text-gray-300 mb-6 line-clamp-3 animate-slide-up">
              {movie.overview}
            </p>

            <div className="flex flex-wrap gap-4 animate-slide-up">
              <button className="bg-primary text-background px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl">
                <Play className="h-5 w-5" />
                <span>Watch Now</span>
              </button>
              
              <button className="bg-dark-1 text-white px-8 py-3 rounded-lg font-semibold hover:bg-dark-2 transition-all duration-300 flex items-center space-x-2 border border-dark-2">
                <Info className="h-5 w-5" />
                <span>More Info</span>
              </button>
              
              <button
                onClick={handleWatchlistToggle}
                className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 border ${
                  inWatchlist
                    ? 'bg-primary text-background border-primary'
                    : 'bg-transparent text-white border-gray-600 hover:border-primary hover:text-primary'
                }`}
              >
                {inWatchlist ? (
                  <>
                    <Check className="h-5 w-5" />
                    <span>In Watchlist</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    <span>Add to Watchlist</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;