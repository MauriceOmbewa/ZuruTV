const STREMIO_BASE_URL = import.meta.env.VITE_STREMIO_BASE_URL || 'https://v3-cinemeta.strem.io';
const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY || '7c0c550be7msh9b53caddfcc711fp1d1f27jsn0be1433b2089';
const GOWATCH_BASE_URL = import.meta.env.VITE_GOWATCH_BASE_URL || 'https://gowatch.p.rapidapi.com';
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'd242ab289791acb2603b10469634dff6';
const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';
const VIDSRC_BASE_URL = import.meta.env.VITE_VIDSRC_BASE_URL || 'https://vidsrc.to/embed';

const gowatchOptions = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'gowatch.p.rapidapi.com'
  },
};

const tmdbOptions = {
  method: 'GET',
  headers: {
    'accept': 'application/json',
    'Authorization': `Bearer ${TMDB_API_KEY}`
  },
};

// Mock data with real TMDB IDs for demo purposes
const mockMovies = [
  {
    id: 603,
    title: 'The Matrix',
    overview: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    poster_path: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    backdrop_path: '/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg',
    release_date: '1999-03-30',
    vote_average: 8.7,
    genre_ids: [28, 878],
    popularity: 85.5,
  },
  {
    id: 27205,
    title: 'Inception',
    overview: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    poster_path: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    backdrop_path: '/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
    release_date: '2010-07-16',
    vote_average: 8.8,
    genre_ids: [28, 878, 53],
    popularity: 92.1,
  },
  {
    id: 157336,
    title: 'Interstellar',
    overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop_path: '/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
    release_date: '2014-11-07',
    vote_average: 8.6,
    genre_ids: [878, 18],
    popularity: 78.9,
  },
];

const mockTVShows = [
  {
    id: 66732,
    name: 'Stranger Things',
    overview: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.',
    poster_path: '/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
    backdrop_path: '/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
    first_air_date: '2016-07-15',
    vote_average: 8.7,
    genre_ids: [18, 9648, 10765],
    popularity: 95.3,
  },
  {
    id: 71912,
    name: 'The Witcher',
    overview: 'Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.',
    poster_path: '/7vjaCdMw15FEbXyLQTVa04URsPm.jpg',
    backdrop_path: '/1qpUk27LVI9UoTS7S0EixUBj5aR.jpg',
    first_air_date: '2019-12-20',
    vote_average: 8.2,
    genre_ids: [18, 10759, 10765],
    popularity: 88.7,
  },
];

class GoWatchService {
  constructor() {
    this.stremioBaseUrl = STREMIO_BASE_URL;
    this.rapidApiKey = RAPIDAPI_KEY;
    this.gowatchBaseUrl = GOWATCH_BASE_URL;
    this.tmdbApiKey = TMDB_API_KEY;
    this.tmdbBaseUrl = TMDB_BASE_URL;
    this.imageBaseUrl = IMAGE_BASE_URL;
    this.vidsrcBaseUrl = VIDSRC_BASE_URL;
    this.catalogCache = new Map(); // Cache catalog data for fallback
  }

  // Generate VidSrc streaming URL with multiple source options
  getVidSrcUrl(id, type = 'movie', season = null, episode = null) {
    // Clean the ID - remove 'tt' prefix if present for some sources
    const cleanId = id.toString().startsWith('tt') ? id : id;
    
    let url;
    if (type === 'tv') {
      // For TV shows, use series format
      url = `${this.vidsrcBaseUrl}/tv/${cleanId}`;
      if (season && episode) {
        url += `/${season}/${episode}`;
      }
    } else {
      // For movies
      url = `${this.vidsrcBaseUrl}/movie/${cleanId}`;
    }
    
    console.log(`Generated VidSrc URL: ${url}`);
    return url;
  }

  // Get multiple streaming URL options
  getStreamingUrls(id, type = 'movie', season = 1, episode = 1) {
    const urls = [];
    
    // VidSrc primary
    urls.push({
      name: 'VidSrc',
      url: this.getVidSrcUrl(id, type, season, episode)
    });
    
    // Alternative VidSrc formats
    if (id.toString().startsWith('tt')) {
      // Try without 'tt' prefix
      const numericId = id.toString().substring(2);
      urls.push({
        name: 'VidSrc Alt',
        url: this.getVidSrcUrl(numericId, type, season, episode)
      });
    }
    
    // VidSrc.me alternative
    const vidsrcMe = type === 'movie' 
      ? `https://vidsrc.me/embed/movie?imdb=${id}`
      : `https://vidsrc.me/embed/tv?imdb=${id}&season=${season}&episode=${episode}`;
    
    urls.push({
      name: 'VidSrc.me',
      url: vidsrcMe
    });
    
    return urls;
  }

  // Get streaming URL for movie
  getMovieStreamUrl(movieId) {
    const urls = this.getStreamingUrls(movieId, 'movie');
    return urls[0].url; // Return primary URL
  }

  // Get streaming URL for TV show
  getTVStreamUrl(showId, season = 1, episode = 1) {
    const urls = this.getStreamingUrls(showId, 'tv', season, episode);
    return urls[0].url; // Return primary URL
  }

  async makeStremioRequest(endpoint) {
    try {
      const url = `${this.stremioBaseUrl}${endpoint}`;
      console.log(`Making Stremio request to: ${url}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Stremio API Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`Stremio API Response:`, data);
      return data;
    } catch (error) {
      console.error('Stremio API Error:', error);
      return null;
    }
  }

  convertStremioToTMDB(stremioItem) {
    // Convert Stremio format to TMDB-like format
    const isMovie = stremioItem.type === 'movie';
    
    return {
      id: stremioItem.imdb_id || stremioItem.id,
      title: isMovie ? stremioItem.name : undefined,
      name: !isMovie ? stremioItem.name : undefined,
      overview: stremioItem.description || stremioItem.plot || '',
      poster_path: stremioItem.poster || null,
      backdrop_path: stremioItem.background || null,
      release_date: isMovie ? stremioItem.releaseInfo : undefined,
      first_air_date: !isMovie ? stremioItem.releaseInfo : undefined,
      vote_average: parseFloat(stremioItem.imdbRating) || 0,
      genre_ids: stremioItem.genres || [],
      popularity: 50,
      runtime: stremioItem.runtime ? parseInt(stremioItem.runtime) : undefined,
      genres: stremioItem.genres ? stremioItem.genres.map(g => ({ id: 0, name: g })) : [],
      _isStremioData: true // Flag to identify Stremio data
    };
  }

  async makeTMDBRequest(endpoint, params = {}) {
    try {
      const url = new URL(`${this.tmdbBaseUrl}${endpoint}`);
      url.searchParams.append('api_key', this.tmdbApiKey);
      
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });

      const response = await fetch(url, tmdbOptions);
      
      if (!response.ok) {
        throw new Error(`TMDB API Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('TMDB API Error:', error);
      return null;
    }
  }

  async makeRequest(endpoint, params = {}) {
    try {
      const url = new URL(`${this.gowatchBaseUrl}${endpoint}`);
      
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });

      console.log(`Making GoWatch request to: ${url.toString()}`);
      const response = await fetch(url, gowatchOptions);
      
      if (!response.ok) {
        console.error(`GoWatch API Error: ${response.status} - ${response.statusText} for ${endpoint}`);
        return null;
      }
      
      const data = await response.json();
      console.log(`GoWatch API Response for ${endpoint}:`, data);
      return data;
    } catch (error) {
      console.error('GoWatch API Error:', error);
      return null;
    }
  }

  getMockData(endpoint) {
    console.log(`Using mock data for endpoint: ${endpoint}`);
    if (endpoint.includes('trending') || endpoint.includes('popular')) {
      return { results: mockMovies };
    }
    if (endpoint.includes('tv')) {
      return { results: mockTVShows };
    }
    if (endpoint.includes('search')) {
      return { results: [...mockMovies, ...mockTVShows] };
    }
    return { results: mockMovies };
  }

  async getTrending(mediaType = 'movie', timeWindow = 'week') {
    console.log(`Fetching trending ${mediaType}...`);
    
    // Try Stremio API first
    try {
      const catalogType = mediaType === 'movie' ? 'movie' : 'series';
      const result = await this.makeStremioRequest(`/catalog/${catalogType}/top/skip=0.json`);
      if (result && result.metas && result.metas.length > 0) {
        console.log('Using Stremio trending data');
        // Cache catalog data for fallback use
        result.metas.forEach(item => {
          if (item.imdb_id || item.id) {
            this.catalogCache.set(item.imdb_id || item.id, item);
          }
        });
        const convertedResults = result.metas.map(item => this.convertStremioToTMDB(item));
        return { results: convertedResults };
      }
    } catch (error) {
      console.log('Stremio trending failed, trying TMDB...');
    }
    
    // Try TMDB API as backup
    try {
      const result = await this.makeTMDBRequest(`/trending/${mediaType}/${timeWindow}`);
      if (result && result.results) {
        console.log('Using TMDB trending data');
        return result;
      }
    } catch (error) {
      console.log('TMDB trending failed, using mock data');
    }
    
    // Fallback to mock data
    console.log('Using mock trending data');
    return { results: mockMovies };
  }

  async getPopular(mediaType = 'movie') {
    console.log(`Fetching popular ${mediaType} content...`);
    
    // Try Stremio API first
    try {
      const catalogType = mediaType === 'movie' ? 'movie' : 'series';
      const result = await this.makeStremioRequest(`/catalog/${catalogType}/top/skip=0.json`);
      if (result && result.metas && result.metas.length > 0) {
        console.log(`Using Stremio popular ${mediaType} data`);
        // Cache catalog data for fallback use
        result.metas.forEach(item => {
          if (item.imdb_id || item.id) {
            this.catalogCache.set(item.imdb_id || item.id, item);
          }
        });
        const convertedResults = result.metas.map(item => this.convertStremioToTMDB(item));
        return { results: convertedResults };
      }
    } catch (error) {
      console.log(`Stremio popular ${mediaType} failed, trying TMDB...`);
    }
    
    // Try TMDB API as backup
    try {
      const result = await this.makeTMDBRequest(`/${mediaType}/popular`);
      if (result && result.results) {
        console.log(`Using TMDB popular ${mediaType} data`);
        return result;
      }
    } catch (error) {
      console.log(`TMDB popular ${mediaType} failed, using mock data`);
    }
    
    // Fallback to mock data
    console.log(`Using mock popular ${mediaType} data`);
    if (mediaType === 'tv') {
      return { results: mockTVShows };
    }
    return { results: mockMovies };
  }

  async getMovieDetails(movieId) {
    // Try Stremio API first (works with IMDB IDs)
    try {
      const response = await this.makeStremioRequest(`/meta/movie/${movieId}.json`);
      if (response && response.meta) {
        console.log('Using Stremio movie details');
        return this.convertStremioToTMDB(response.meta);
      }
    } catch (error) {
      console.log('Stremio movie details failed, trying TMDB...');
    }
    
    // Try TMDB API as backup (only if movieId is numeric)
    if (!movieId.toString().startsWith('tt')) {
      try {
        const response = await this.makeTMDBRequest(`/movie/${movieId}`);
        if (response) {
          console.log('Using TMDB movie details');
          return response;
        }
      } catch (error) {
        console.log('TMDB movie details failed, using fallback');
      }
    }
    
    // Try to use cached catalog data as fallback
    const cachedItem = this.catalogCache.get(movieId);
    if (cachedItem) {
      console.log('Using cached catalog data for movie details');
      return this.convertStremioToTMDB(cachedItem);
    }
    
    // Try to find basic info from mock data as last resort
    const mockMovie = mockMovies.find(m => m.id == movieId);
    if (mockMovie) {
      return {
        ...mockMovie,
        genres: [{ id: 28, name: 'Action' }],
        runtime: 120
      };
    }
    
    return {
      id: movieId,
      title: 'Movie Details Unavailable',
      overview: 'Sorry, the details for this movie are currently unavailable. This might be due to content restrictions or the movie being removed from the database.',
      poster_path: null,
      backdrop_path: null,
      release_date: new Date().toISOString().split('T')[0],
      vote_average: 0,
      genres: [{ id: 0, name: 'Unknown' }],
      runtime: 0
    };
  }

  async getTVShowDetails(showId) {
    // Try Stremio API first (works with IMDB IDs)
    try {
      const response = await this.makeStremioRequest(`/meta/series/${showId}.json`);
      if (response && response.meta) {
        console.log('Using Stremio TV show details');
        return this.convertStremioToTMDB(response.meta);
      }
    } catch (error) {
      console.log('Stremio TV show details failed, trying TMDB...');
    }
    
    // Try TMDB API as backup (only if showId is numeric)
    if (!showId.toString().startsWith('tt')) {
      try {
        const response = await this.makeTMDBRequest(`/tv/${showId}`);
        if (response) {
          console.log('Using TMDB TV show details');
          return response;
        }
      } catch (error) {
        console.log('TMDB TV show details failed, using fallback');
      }
    }
    
    // Try to use cached catalog data as fallback
    const cachedItem = this.catalogCache.get(showId);
    if (cachedItem) {
      console.log('Using cached catalog data for TV show details');
      return this.convertStremioToTMDB(cachedItem);
    }
    
    // Try to find basic info from mock data as last resort
    const mockShow = mockTVShows.find(s => s.id == showId);
    if (mockShow) {
      return {
        ...mockShow,
        genres: [{ id: 18, name: 'Drama' }],
        episode_run_time: [45]
      };
    }
    
    return {
      id: showId,
      name: 'TV Show Details Unavailable',
      overview: 'Sorry, the details for this TV show are currently unavailable. This might be due to content restrictions or the show being removed from the database.',
      poster_path: null,
      backdrop_path: null,
      first_air_date: new Date().toISOString().split('T')[0],
      vote_average: 0,
      genres: [{ id: 0, name: 'Unknown' }],
      episode_run_time: [45]
    };
  }

  async searchMovies(query, page = 1) {
    // Try TMDB API first
    try {
      const result = await this.makeTMDBRequest('/search/movie', { query, page });
      if (result && result.results) {
        console.log('Using TMDB movie search results');
        return result;
      }
    } catch (error) {
      console.log('TMDB movie search failed, trying GoWatch...');
    }
    
    // Try GoWatch API as backup
    try {
      const result = await this.makeRequest('/search', { q: query, type: 'movie', page });
      if (result && result.results) {
        console.log('Using GoWatch movie search results');
        return result;
      }
    } catch (error) {
      console.log('GoWatch movie search failed, using mock data');
    }
    
    // Return filtered mock data based on query
    const filtered = mockMovies.filter(movie => 
      movie.title.toLowerCase().includes(query.toLowerCase())
    );
    return { results: filtered.length > 0 ? filtered : mockMovies };
  }

  async searchTVShows(query, page = 1) {
    // Try TMDB API first
    try {
      const result = await this.makeTMDBRequest('/search/tv', { query, page });
      if (result && result.results) {
        console.log('Using TMDB TV search results');
        return result;
      }
    } catch (error) {
      console.log('TMDB TV search failed, trying GoWatch...');
    }
    
    // Try GoWatch API as backup
    try {
      const result = await this.makeRequest('/search', { q: query, type: 'tv', page });
      if (result && result.results) {
        console.log('Using GoWatch TV search results');
        return result;
      }
    } catch (error) {
      console.log('GoWatch TV search failed, using mock data');
    }
    
    // Return filtered mock data based on query
    const filtered = mockTVShows.filter(show => 
      show.name.toLowerCase().includes(query.toLowerCase())
    );
    return { results: filtered.length > 0 ? filtered : mockTVShows };
  }

  async getMovieVideos(movieId) {
    // Try TMDB API first
    try {
      const response = await this.makeTMDBRequest(`/movie/${movieId}/videos`);
      if (response) {
        return response;
      }
    } catch (error) {
      console.log('TMDB movie videos failed, trying GoWatch...');
    }
    
    // Try GoWatch API as backup
    const response = await this.makeRequest(`/videos`, { id: movieId, type: 'movie' });
    return response || { results: [] };
  }

  async getTVShowVideos(showId) {
    // Try TMDB API first
    try {
      const response = await this.makeTMDBRequest(`/tv/${showId}/videos`);
      if (response) {
        return response;
      }
    } catch (error) {
      console.log('TMDB TV videos failed, trying GoWatch...');
    }
    
    // Try GoWatch API as backup
    const response = await this.makeRequest(`/videos`, { id: showId, type: 'tv' });
    return response || { results: [] };
  }

  getImageUrl(path, size = 'w500') {
    if (!path) return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9Ijc1MCIgdmlld0JveD0iMCAwIDUwMCA3NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MDAiIGhlaWdodD0iNzUwIiBmaWxsPSIjMWExYTFhIi8+Cjx0ZXh0IHg9IjI1MCIgeT0iMzc1IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
    
    // If it's already a full URL (from Stremio), return as-is
    if (path.startsWith('http')) {
      return path;
    }
    
    // Otherwise, use TMDB image base URL
    return `${this.imageBaseUrl}/${size}${path}`;
  }

  getBackdropUrl(path, size = 'w1280') {
    if (!path) return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4MCIgaGVpZ2h0PSI3MjAiIHZpZXdCb3g9IjAgMCAxMjgwIDcyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEyODAiIGhlaWdodD0iNzIwIiBmaWxsPSIjMWExYTFhIi8+Cjx0ZXh0IHg9IjY0MCIgeT0iMzYwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMzYiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
    
    // If it's already a full URL (from Stremio), return as-is
    if (path.startsWith('http')) {
      return path;
    }
    
    // Otherwise, use TMDB image base URL
    return `${this.imageBaseUrl}/${size}${path}`;
  }
}

export default new GoWatchService();