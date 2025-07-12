const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY || '7c0c550be7msh9b53caddfcc711fp1d1f27jsn0be1433b2089';
const GOWATCH_BASE_URL = import.meta.env.VITE_GOWATCH_BASE_URL || 'https://gowatch.p.rapidapi.com';
const TMDB_API_KEY = 'd242ab289791acb2603b10469634dff6';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

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
    this.rapidApiKey = RAPIDAPI_KEY;
    this.gowatchBaseUrl = GOWATCH_BASE_URL;
    this.tmdbApiKey = TMDB_API_KEY;
    this.tmdbBaseUrl = TMDB_BASE_URL;
    this.imageBaseUrl = IMAGE_BASE_URL;
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
    console.log('Fetching trending movies...');
    
    // Try TMDB API first (more reliable)
    try {
      const result = await this.makeTMDBRequest(`/trending/${mediaType}/${timeWindow}`);
      if (result && result.results) {
        console.log('Using TMDB trending data');
        return result;
      }
    } catch (error) {
      console.log('TMDB trending failed, trying GoWatch...');
    }
    
    // Try GoWatch API as backup
    try {
      const result = await this.makeRequest('/trending');
      if (result && result.results) {
        console.log('Using GoWatch trending data');
        return result;
      }
    } catch (error) {
      console.log('GoWatch trending failed, using mock data');
    }
    
    // Fallback to mock data
    console.log('Using mock trending data');
    return { results: mockMovies };
  }

  async getPopular(mediaType = 'movie') {
    console.log(`Fetching popular ${mediaType} content...`);
    
    // Try TMDB API first (more reliable)
    try {
      const result = await this.makeTMDBRequest(`/${mediaType}/popular`);
      if (result && result.results) {
        console.log(`Using TMDB popular ${mediaType} data`);
        return result;
      }
    } catch (error) {
      console.log(`TMDB popular ${mediaType} failed, trying GoWatch...`);
    }
    
    // Try GoWatch API as backup
    try {
      const result = await this.makeRequest('/popular');
      if (result && result.results) {
        console.log(`Using GoWatch popular ${mediaType} data`);
        return result;
      }
    } catch (error) {
      console.log(`GoWatch popular ${mediaType} failed, using mock data`);
    }
    
    // Fallback to mock data
    console.log(`Using mock popular ${mediaType} data`);
    if (mediaType === 'tv') {
      return { results: mockTVShows };
    }
    return { results: mockMovies };
  }

  async getMovieDetails(movieId) {
    // Try TMDB API first
    try {
      const response = await this.makeTMDBRequest(`/movie/${movieId}`);
      if (response) {
        console.log('Using TMDB movie details');
        return response;
      }
    } catch (error) {
      console.log('TMDB movie details failed, trying GoWatch...');
    }
    
    // Try GoWatch API as backup
    try {
      const response = await this.makeRequest(`/details`, { id: movieId, type: 'movie' });
      if (response) {
        console.log('Using GoWatch movie details');
        return response;
      }
    } catch (error) {
      console.log('GoWatch movie details failed, using fallback');
    }
    
    // Find movie in mock data or return fallback
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
      title: 'Content Not Available',
      overview: 'This content is no longer available.',
      poster_path: null,
      backdrop_path: null,
      release_date: null,
      vote_average: 0,
      genres: [],
      runtime: 0
    };
  }

  async getTVShowDetails(showId) {
    // Try TMDB API first
    try {
      const response = await this.makeTMDBRequest(`/tv/${showId}`);
      if (response) {
        console.log('Using TMDB TV show details');
        return response;
      }
    } catch (error) {
      console.log('TMDB TV show details failed, trying GoWatch...');
    }
    
    // Try GoWatch API as backup
    try {
      const response = await this.makeRequest(`/details`, { id: showId, type: 'tv' });
      if (response) {
        console.log('Using GoWatch TV show details');
        return response;
      }
    } catch (error) {
      console.log('GoWatch TV show details failed, using fallback');
    }
    
    // Find TV show in mock data or return fallback
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
      name: 'Content Not Available',
      overview: 'This content is no longer available.',
      poster_path: null,
      backdrop_path: null,
      first_air_date: null,
      vote_average: 0,
      genres: [],
      episode_run_time: []
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
    if (!path) return 'https://via.placeholder.com/500x750/1a1a1a/666666?text=No+Image';
    return `${this.imageBaseUrl}/${size}${path}`;
  }

  getBackdropUrl(path, size = 'w1280') {
    if (!path) return 'https://via.placeholder.com/1280x720/1a1a1a/666666?text=No+Image';
    return `${this.imageBaseUrl}/${size}${path}`;
  }
}

export default new GoWatchService();