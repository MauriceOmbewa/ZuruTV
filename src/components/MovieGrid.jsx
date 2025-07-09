import React from 'react';
import MovieCard from './MovieCard';
import LoadingSpinner from './LoadingSpinner';

const MovieGrid = ({ items, type = 'movie', loading = false, title }) => {
  if (loading) {
    return (
      <div className="py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-400 text-lg">No {type}s found</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      {title && (
        <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {items.map((item) => (
          <MovieCard key={item.id} item={item} type={type} />
        ))}
      </div>
    </div>
  );
};

export default MovieGrid;