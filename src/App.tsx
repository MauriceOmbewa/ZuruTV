import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { WatchlistProvider } from './context/WatchlistContext';
import Header from './components/Header';
import Home from './pages/Home';
import Search from './pages/Search';
import MovieDetail from './pages/MovieDetail';
import Watchlist from './pages/Watchlist';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <WatchlistProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/movie/:id" element={<MovieDetail />} />
                <Route path="/tv/:id" element={<MovieDetail />} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </main>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#212121',
                  color: '#ffffff',
                  border: '1px solid #262626',
                },
                success: {
                  iconTheme: {
                    primary: '#eeba2c',
                    secondary: '#000000',
                  },
                },
              }}
            />
          </div>
        </Router>
      </WatchlistProvider>
    </AuthProvider>
  );
}

export default App;