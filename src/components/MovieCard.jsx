import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Calendar, Heart, Play } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../context/AuthContext';
import GoWatchService from '../services/gowatch';
import toast from 'react-hot-toast';

const MovieCard = ({ item, type = 'movie' }) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const { user } = useAuth();

  // Auto-detect type if not provided
  const itemType = type || (item.title ? 'movie' : 'tv');
  const title = item.title || item.name;
  const releaseDate = item.release_date || item.first_air_date;
  const inWatchlist = isInWatchlist(item.id);

  const handleWatchlistToggle = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add to watchlist');
      return;
    }

    if (inWatchlist) {
      removeFromWatchlist(item.id);
      toast.success('Removed from watchlist');
    } else {
      addToWatchlist({ ...item, type: itemType });
      toast.success('Added to watchlist');
    }
  };

  return (
    <div className="group relative bg-dark-1 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <Link to={`/${itemType}/${item.id}`} className="block relative">
        <div className="aspect-[2/3] relative overflow-hidden">
          <img
            src={GoWatchService.getImageUrl(item.poster_path)}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-primary text-background rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300">
              <Play className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4">
          <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 text-primary fill-current" />
              <span>{item.vote_average?.toFixed(1) || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{releaseDate ? new Date(releaseDate).getFullYear() : 'TBA'}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Watchlist Button */}
      <button
        onClick={handleWatchlistToggle}
        className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-300 ${
          inWatchlist
            ? 'bg-primary text-background'
            : 'bg-black/50 text-white hover:bg-primary hover:text-background'
        }`}
      >
        <Heart className={`h-4 w-4 ${inWatchlist ? 'fill-current' : ''}`} />
      </button>
    </div>
  );
};

export default MovieCard;