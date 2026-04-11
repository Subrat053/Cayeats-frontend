import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { logger } from "../utils/logger";

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load favorites from localStorage on mount or when user changes
  useEffect(() => {
    try {
      if (isAuthenticated && user) {
        const storedFavorites = localStorage.getItem(`favorites_${user.id}`);
        if (storedFavorites) {
          const parsed = JSON.parse(storedFavorites);
          // Validate that it's an array
          setFavorites(Array.isArray(parsed) ? parsed : []);
        } else {
          setFavorites([]);
        }
      } else {
        // For non-authenticated users, use a generic key
        const storedFavorites = localStorage.getItem("favorites_guest");
        if (storedFavorites) {
          const parsed = JSON.parse(storedFavorites);
          // Validate that it's an array
          setFavorites(Array.isArray(parsed) ? parsed : []);
        } else {
          setFavorites([]);
        }
      }
    } catch (err) {
      logger.error("Failed to load favorites from localStorage:", err);
      // Clear corrupted data and start fresh
      const key =
        isAuthenticated && user ? `favorites_${user.id}` : "favorites_guest";
      localStorage.removeItem(key);
      setFavorites([]);
    }
    setLoading(false);
  }, [user, isAuthenticated]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      try {
        const key =
          isAuthenticated && user ? `favorites_${user.id}` : "favorites_guest";
        localStorage.setItem(key, JSON.stringify(favorites));
      } catch (err) {
        if (err.name === "QuotaExceededError") {
          logger.error("localStorage quota exceeded. Clearing old data...");
          // Try to clear old data and retry
          localStorage.clear();
          try {
            const key =
              isAuthenticated && user
                ? `favorites_${user.id}`
                : "favorites_guest";
            localStorage.setItem(key, JSON.stringify(favorites));
          } catch (retryErr) {
            logger.error(
              "Failed to save favorites even after clearing storage:",
              retryErr,
            );
          }
        } else {
          logger.error("Failed to save favorites to localStorage:", err);
        }
      }
    }
  }, [favorites, user, isAuthenticated, loading]);

  const addFavorite = (restaurantId) => {
    setFavorites((prev) => {
      if (prev.includes(restaurantId)) return prev;
      return [...prev, restaurantId];
    });
  };

  const removeFavorite = (restaurantId) => {
    setFavorites((prev) => prev.filter((id) => id !== restaurantId));
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
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

export default FavoritesContext;
