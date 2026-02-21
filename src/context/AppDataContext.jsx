import { createContext, useContext, useState, useEffect } from "react";
import {
  fetchRestaurants,
  fetchCuisineCategories,
} from "../api/browseServices";

const AppDataContext = createContext();

export const AppDataProvider = ({ children }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [cuisineCategories, setCuisineCategories] = useState([]);
  const [deliveryProviders, setDeliveryProviders] = useState([]);
  const [banners, setBanners] = useState({
    top: null,
    middle: null,
    bottom: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [restaurantData, categoryData] = await Promise.all([
          fetchRestaurants(),
          fetchCuisineCategories(),
        ]);
        setRestaurants(restaurantData);
        setCuisineCategories(categoryData);

        // ✅ extract unique delivery providers from restaurant data
        const providers = [];
        const seen = new Set();
        restaurantData.forEach((r) => {
          r.deliveryProviders?.forEach((p) => {
            if (!seen.has(p.providerName)) {
              seen.add(p.providerName);
              providers.push(p);
            }
          });
        });
        setDeliveryProviders(providers);
      } catch (err) {
        setError(err.message);
        console.error("Failed to load app data:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const refetchRestaurants = async (filters = {}) => {
    const data = await fetchRestaurants(filters);
    setRestaurants(data);
  };

  return (
    <AppDataContext.Provider
      value={{
        restaurants,
        cuisineCategories,
        deliveryProviders,
        banners,
        loading,
        error,
        refetchRestaurants, // ✅ used by search/filter
        setRestaurants,
        setBanners,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => useContext(AppDataContext);
