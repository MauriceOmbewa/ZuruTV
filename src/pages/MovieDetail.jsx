import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Calendar, Clock, Play, Heart, Share2 } from 'lucide-react';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../context/AuthContext';
import GoWatchService from '../services/gowatch';
import VideoPlayer from '../components/VideoPlayer';
import TrailerModal from '../components/TrailerModal';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const MovieDetail = () => {
  const { type, id } = useParams();
  const [movie, setMovie] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [watchMode, setWatchMode] = useState(false);
  const [streamingSources, setStreamingSources] = useState([]);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const { user } = useAuth();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const [movieData, videosData] = await Promise.all([
          type === 'movie' ? GoWatchService.getMovieDetails(id) : GoWatchService.getTVShowDetails(id),
          type === 'movie' ? GoWatchService.getMovieVideos(id) : GoWatchService.getTVShowVideos(id),
        ]);

        setMovie(movieData);
        setVideos(videosData.results || []);
        
        // Initialize streaming sources
        const sources = GoWatchService.getStreamingUrls(id, type, 1, 1);
        setStreamingSources(sources);
        console.log('Available streaming sources:', sources);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [type, id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Content not found</h2>
          <p className="text-gray-400">The requested movie or TV show could not be found.</p>
        </div>
      </div>
    );
  }

  const title = movie.title || movie.name;
  const releaseDate = movie.release_date || movie.first_air_date;
  const runtime = movie.runtime || movie.episode_run_time?.[0];
  const trailer = videos.find(video => video.type === 'Trailer' && video.site === 'YouTube');
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
      addToWatchlist({ ...movie, type });
      toast.success('Added to watchlist');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: movie.overview,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={GoWatchService.getBackdropUrl(movie.backdrop_path, 'original')}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
      </div>

      {/* Content */}
      <div className="relative -mt-32 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0">
              <img
                src={GoWatchService.getImageUrl(movie.poster_path, 'w500')}
                alt={title}
                className="w-64 h-96 object-cover rounded-lg shadow-2xl mx-auto md:mx-0"
              />
            </div>

            {/* Details */}
            <div className="flex-grow">
              <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-300">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-primary fill-current" />
                  <span className="font-semibold">{movie.vote_average?.toFixed(1)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-5 w-5" />
                  <span>{releaseDate ? new Date(releaseDate).getFullYear() : 'TBA'}</span>
                </div>
                {runtime && (
                  <div className="flex items-center space-x-1">
                    <Clock className="h-5 w-5" />
                    <span>{runtime} min</span>
                  </div>
                )}
              </div>

              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                {movie.overview}
              </p>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="bg-dark-1 text-white px-3 py-1 rounded-full text-sm border border-dark-2"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                <button
                  onClick={() => setWatchMode(true)}
                  className="bg-primary text-background px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-300 flex items-center space-x-2 shadow-lg"
                >
                  <Play className="h-5 w-5" />
                  <span>Watch Now</span>
                </button>
                
                {trailer && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="bg-dark-1 text-white px-8 py-3 rounded-lg font-semibold hover:bg-dark-2 transition-all duration-300 flex items-center space-x-2 border border-dark-2"
                  >
                    <Play className="h-5 w-5" />
                    <span>Watch Trailer</span>
                  </button>
                )}
                
                <button
                  onClick={handleWatchlistToggle}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 border ${
                    inWatchlist
                      ? 'bg-primary text-background border-primary'
                      : 'bg-transparent text-white border-gray-600 hover:border-primary hover:text-primary'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${inWatchlist ? 'fill-current' : ''}`} />
                  <span>{inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
                </button>
                
                <button
                  onClick={handleShare}
                  className="bg-transparent text-white px-8 py-3 rounded-lg font-semibold border border-gray-600 hover:border-primary hover:text-primary transition-all duration-300 flex items-center space-x-2"
                >
                  <Share2 className="h-5 w-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          {/* Watch Mode */}
          {watchMode && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Now Streaming: {title}</h2>
                <button
                  onClick={() => setWatchMode(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Close Player
                </button>
              </div>
              <VideoPlayer
                url={streamingSources[currentSourceIndex]?.url || 
                  (type === 'movie' 
                    ? GoWatchService.getMovieStreamUrl(id)
                    : GoWatchService.getTVStreamUrl(id, 1, 1)
                  )
                }
                thumbnail={GoWatchService.getBackdropUrl(movie.backdrop_path)}
                title={title}
                type={type}
              />
              
              {/* Source Selector */}
              {streamingSources.length > 1 && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-white text-sm">Source:</span>
                  {streamingSources.map((source, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSourceIndex(index)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        index === currentSourceIndex
                          ? 'bg-primary text-background'
                          : 'bg-dark-1 text-white hover:bg-dark-2'
                      }`}
                    >
                      {source.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Trailer Modal */}
      {trailer && (
        <TrailerModal
          isOpen={showTrailer}
          onClose={() => setShowTrailer(false)}
          trailer={`https://www.youtube.com/watch?v=${trailer.key}`}
          title={title}
        />
      )}
    </div>
  );
};

export default MovieDetail;