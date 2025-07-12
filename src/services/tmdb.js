// const API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'demo_key';
// const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
// const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';

// const defaultOptions = {
//   method: 'GET',
//   headers: {
//     accept: 'application/json',
//     Authorization: `Bearer ${API_KEY}`,
//   },
// };

// // Mock data with real TMDB IDs for demo purposes
// const mockMovies = [
//   {
//     id: 603,
//     title: 'The Matrix',
//     overview: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
//     poster_path: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
//     backdrop_path: '/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg',
//     release_date: '1999-03-30',
//     vote_average: 8.7,
//     genre_ids: [28, 878],
//     popularity: 85.5,
//   },
//   {
//     id: 27205,
//     title: 'Inception',
//     overview: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
//     poster_path: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
//     backdrop_path: '/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
//     release_date: '2010-07-16',
//     vote_average: 8.8,
//     genre_ids: [28, 878, 53],
//     popularity: 92.1,
//   },
//   {
//     id: 157336,
//     title: 'Interstellar',
//     overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
//     poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
//     backdrop_path: '/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
//     release_date: '2014-11-07',
//     vote_average: 8.6,
//     genre_ids: [878, 18],
//     popularity: 78.9,
//   },
// ];

// const mockTVShows = [
//   {
//     id: 66732,
//     name: 'Stranger Things',
//     overview: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.',
//     poster_path: '/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
//     backdrop_path: '/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
//     first_air_date: '2016-07-15',
//     vote_average: 8.7,
//     genre_ids: [18, 9648, 10765],
//     popularity: 95.3,
//   },
//   {
//     id: 71912,
//     name: 'The Witcher',
//     overview: 'Geralt of Rivia, a mutated monster-hunter for hire, journeys toward his destiny in a turbulent world where people often prove more wicked than beasts.',
//     poster_path: '/7vjaCdMw15FEbXyLQTVa04URsPm.jpg',
//     backdrop_path: '/1qpUk27LVI9UoTS7S0EixUBj5aR.jpg',
//     first_air_date: '2019-12-20',
//     vote_average: 8.2,
//     genre_ids: [18, 10759, 10765],
//     popularity: 88.7,
//   },
// ];

// class TMDBService {
//   constructor() {
//     this.apiKey = API_KEY;
//     this.baseUrl = BASE_URL;
//     this.imageBaseUrl = IMAGE_BASE_URL;
//   }

//   async makeRequest(endpoint, params = {}) {
//     try {
//       const url = new URL(`${this.baseUrl}${endpoint}`);
//       url.searchParams.append('api_key', this.apiKey);
      
//       Object.entries(params).forEach(([key, value]) => {
//         url.searchParams.append(key, value);
//       });

//       const response = await fetch(url, defaultOptions);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('TMDB API Error:', error);
//       // Return mock data for demo
//       return this.getMockData(endpoint);
//     }
//   }

//   getMockData(endpoint) {
//     if (endpoint.includes('trending')) {
//       return { results: mockMovies };
//     }
//     if (endpoint.includes('tv')) {
//       return { results: mockTVShows };
//     }
//     if (endpoint.includes('search')) {
//       return { results: [...mockMovies, ...mockTVShows] };
//     }
//     return { results: mockMovies };
//   }

//   async getTrending(mediaType = 'movie', timeWindow = 'week') {
//     return this.makeRequest(`/trending/${mediaType}/${timeWindow}`);
//   }

//   async getPopular(mediaType = 'movie') {
//     return this.makeRequest(`/${mediaType}/popular`);
//   }

//   async getMovieDetails(movieId) {
//     try {
//       const response = await this.makeRequest(`/movie/${movieId}`);
//       return response;
//     } catch (error) {
//       // Return mock movie details for demo
//       return {
//         id: movieId,
//         title: 'Sample Movie',
//         overview: 'This is a sample movie for demonstration purposes.',
//         poster_path: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
//         backdrop_path: '/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg',
//         release_date: '2023-01-01',
//         vote_average: 7.5,
//         genres: [{ id: 28, name: 'Action' }],
//         runtime: 120
//       };
//     }
//   }

//   async getTVShowDetails(showId) {
//     try {
//       const response = await this.makeRequest(`/tv/${showId}`);
//       return response;
//     } catch (error) {
//       // Return mock TV show details for demo
//       return {
//         id: showId,
//         name: 'Sample TV Show',
//         overview: 'This is a sample TV show for demonstration purposes.',
//         poster_path: '/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
//         backdrop_path: '/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
//         first_air_date: '2023-01-01',
//         vote_average: 8.0,
//         genres: [{ id: 18, name: 'Drama' }],
//         episode_run_time: [45]
//       };
//     }
//   }

//   async searchMovies(query, page = 1) {
//     return this.makeRequest('/search/movie', { query, page });
//   }

//   async searchTVShows(query, page = 1) {
//     return this.makeRequest('/search/tv', { query, page });
//   }

//   async getMovieVideos(movieId) {
//     try {
//       const response = await this.makeRequest(`/movie/${movieId}/videos`);
//       return response;
//     } catch (error) {
//       return { results: [] };
//     }
//   }

//   async getTVShowVideos(showId) {
//     try {
//       const response = await this.makeRequest(`/tv/${showId}/videos`);
//       return response;
//     } catch (error) {
//       return { results: [] };
//     }
//   }

//   getImageUrl(path, size = 'w500') {
//     if (!path) return '/placeholder-movie.jpg';
//     return `${this.imageBaseUrl}/${size}${path}`;
//   }

//   getBackdropUrl(path, size = 'w1280') {
//     if (!path) return '/placeholder-backdrop.jpg';
//     return `${this.imageBaseUrl}/${size}${path}`;
//   }
// }

// export default new TMDBService();