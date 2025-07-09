import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WatchlistContext = createContext();

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const savedWatchlist = localStorage.getItem(`watchlist_${user.uid}`);
      if (savedWatchlist) {
        setWatchlist(JSON.parse(savedWatchlist));
      }
    } else {
      setWatchlist([]);
    }
  }, [user]);

  const addToWatchlist = (item) => {
    if (!user) return;
    
    const newWatchlist = [...watchlist, { ...item, addedAt: new Date().toISOString() }];
    setWatchlist(newWatchlist);
    localStorage.setItem(`watchlist_${user.uid}`, JSON.stringify(newWatchlist));
  };

  const removeFromWatchlist = (itemId) => {
    if (!user) return;
    
    const newWatchlist = watchlist.filter(item => item.id !== itemId);
    setWatchlist(newWatchlist);
    localStorage.setItem(`watchlist_${user.uid}`, JSON.stringify(newWatchlist));
  };

  const isInWatchlist = (itemId) => {
    return watchlist.some(item => item.id === itemId);
  };

  const value = {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};