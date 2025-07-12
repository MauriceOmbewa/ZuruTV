import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../context/AuthContext';
import GoWatchService from '../services/gowatch';
import toast from 'react-hot-toast';

const Watchlist = () => {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const { user } = useAuth();

  const handleRemove = (itemId) => {
    removeFromWatchlist(itemId);
    toast.success('Removed from watchlist');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Please Login</h2>
          <p className="text-gray-400 mb-6">You need to be logged in to view your watchlist</p>
          <Link
            to="/login"
            className="bg-primary text-background px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  if (watchlist.length === 0) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-8">My Watchlist</h1>
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Your watchlist is empty</h2>
            <p className="text-gray-400 mb-6">Add movies and TV shows to your watchlist to keep track of what you want to watch</p>
            <Link
              to="/"
              className="bg-primary text-background px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Explore Content
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Heart className="h-8 w-8 text-primary mr-3 fill-current" />
            My Watchlist
          </h1>
          <p className="text-gray-400">{watchlist.length} items</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {watchlist.map((item) => (
            <div key={item.id} className="bg-dark-1 rounded-lg overflow-hidden hover:bg-dark-2 transition-colors">
              <div className="flex">
                <Link to={`/${item.type}/${item.id}`} className="flex-shrink-0">
                  <img
                    src={GoWatchService.getImageUrl(item.poster_path, 'w200')}
                    alt={item.title || item.name}
                    className="w-24 h-36 object-cover"
                  />
                </Link>
                <div className="flex-grow p-4 flex flex-col justify-between">
                  <div>
                    <Link to={`/${item.type}/${item.id}`}>
                      <h3 className="text-white font-semibold mb-2 hover:text-primary transition-colors">
                        {item.title || item.name}
                      </h3>
                    </Link>
                    <p className="text-gray-400 text-sm mb-2">
                      {item.type === 'movie' ? 'Movie' : 'TV Show'}
                    </p>
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {item.overview}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-gray-500">
                      Added {new Date(item.addedAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Watchlist;