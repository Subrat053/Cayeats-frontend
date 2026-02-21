import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load favorites from localStorage on mount or when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      const storedFavorites = localStorage.getItem(`favorites_${user.id}`);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      } else {
        setFavorites([]);
      }
    } else {
      // For non-authenticated users, use a generic key
      const storedFavorites = localStorage.getItem('favorites_guest');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      } else {
        setFavorites([]);
      }
    }
    setLoading(false);
  }, [user, isAuthenticated]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      const key = isAuthenticated && user ? `favorites_${user.id}` : 'favorites_guest';
      localStorage.setItem(key, JSON.stringify(favorites));
    }
  }, [favorites, user, isAuthenticated, loading]);

  const addFavorite = (restaurantId) => {
    setFavorites(prev => {
      if (prev.includes(restaurantId)) return prev;
      return [...prev, restaurantId];
    });
  };

  const removeFavorite = (restaurantId) => {
    setFavorites(prev => prev.filter(id => id !== restaurantId));
  };

  const toggleFavorite = (restaurantId) => {
    if (favorites.includes(restaurantId)) {
      removeFavorite(restaurantId);
    } else {
      addFavorite(restaurantId);
    }
  };

  const isFavorite = (restaurantId) => {
    return favorites.includes(restaurantId);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: favorites.length,
    loading,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export default FavoritesContext;
