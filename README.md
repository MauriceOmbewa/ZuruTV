# ZuruTV - Movie Streaming Web App

A complete, fully functional, and responsive Movie Streaming Web App built with ReactJS and TailwindCSS. The app allows users to search for movies, view details, watch trailers, and manage their watchlist.

## Features

### 🎬 Core Features
- **Home Page**: Displays trending movies, popular TV shows, and a featured hero banner
- **Search**: Search movies and TV shows with autocomplete functionality
- **Movie Details**: Comprehensive movie information with trailer and watch options
- **Watchlist**: Save and manage your favorite movies and TV shows
- **Authentication**: User registration and login with Firebase Auth
- **Responsive Design**: Mobile-first design optimized for all devices

### 🎨 Design Features
- **Dark Theme**: Professional dark theme with yellow accent color (#eeba2c)
- **Smooth Animations**: Framer Motion powered transitions and hover effects
- **Modern UI**: Clean, production-ready interface with attention to detail
- **Custom Video Player**: Full-featured video player with controls
- **Toast Notifications**: User feedback for all interactions

### 📱 Responsive Design
- **Mobile**: Optimized for phones (< 768px)
- **Tablet**: Tablet-friendly layout (768px - 1024px)
- **Desktop**: Full desktop experience (> 1024px)

## Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Authentication**: Firebase Auth
- **Video Player**: React Player
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **API**: The Movie Database (TMDB)

## Installation & Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone https://github.com/MauriceOmbewa/ZuruTV.git
cd ZuruTV
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add your API keys:

```env
# TMDB API Configuration
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_firebase_app_id_here
```

### 4. Getting API Keys

#### TMDB API Key
1. Go to [The Movie Database (TMDB)](https://www.themoviedb.org/)
2. Create an account and verify your email
3. Go to Settings > API
4. Create a new API key
5. Copy the API key to your `.env.local` file

#### Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication with Email/Password
4. Go to Project Settings > General
5. Add a web app and copy the configuration
6. Add the configuration values to your `.env.local` file

### 5. Run the Application
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── Header.jsx              # Navigation header
│   ├── MovieCard.jsx           # Individual movie/TV show cards
│   ├── VideoPlayer.jsx         # Custom video player
│   ├── TrailerModal.jsx        # Modal for trailers
│   ├── LoadingSpinner.jsx      # Loading component
│   ├── MovieGrid.jsx           # Grid layout for movies
│   └── HeroBanner.jsx          # Featured content banner
├── pages/
│   ├── Home.jsx                # Home page
│   ├── Search.jsx              # Search page
│   ├── MovieDetail.jsx         # Movie/TV show details
│   ├── Watchlist.jsx           # User watchlist
│   ├── Login.jsx               # Login page
│   └── Register.jsx            # Registration page
├── context/
│   ├── AuthContext.jsx         # Authentication context
│   └── WatchlistContext.jsx    # Watchlist management
├── services/
│   ├── firebase.js             # Firebase configuration
│   └── tmdb.js                 # TMDB API service
├── App.tsx                     # Main app component
├── main.tsx                    # Entry point
└── index.css                   # Global styles
```

## Color Palette

The app uses a consistent dark theme with the following colors:

- **Primary Accent**: #eeba2c (Yellow)
- **Background**: #000000 (Black)
- **Dark Gray 1**: #161616
- **Dark Gray 2**: #212121
- **Dark Gray 3**: #262626

## Features in Detail

### Authentication
- Email/password registration and login
- Firebase Auth integration
- Protected routes for watchlist
- User session management

### Movie & TV Show Data
- Real-time data from TMDB API
- Trending movies and TV shows
- Search functionality with results
- Detailed movie information
- Trailer integration via YouTube

### Video Player
- Custom HTML5 video player
- Play/pause, volume, and fullscreen controls
- Responsive design
- Trailer modal overlay
- Progress tracking

### Watchlist Management
- Add/remove movies and TV shows
- LocalStorage persistence per user
- Visual feedback for actions
- Empty state handling

### Responsive Design
- Mobile-first approach
- Breakpoints for mobile, tablet, and desktop
- Touch-friendly interactions
- Optimized images and loading

## Demo Data

The app includes fallback mock data for demonstration purposes when API calls fail, ensuring the app remains functional even without API keys.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for movie data
- [Firebase](https://firebase.google.com/) for authentication
- [Lucide React](https://lucide.dev/) for icons
- [TailwindCSS](https://tailwindcss.com/) for styling