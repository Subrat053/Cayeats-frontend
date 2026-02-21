import api from "./axios";

export const fetchRestaurants = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.cuisine) params.append("cuisine", filters.cuisine);
  if (filters.search) params.append("search", filters.search);
  if (filters.open) params.append("open", "true");
  if (filters.provider) params.append("provider", filters.provider);

  const res = await api.get(`/browse/restaurants?${params.toString()}`);
  return res.data?.data || [];
};

export const fetchRestaurantById = async (id) => {
  const res = await api.get(`/browse/restaurants/${id}`);
  return res.data?.data;
};

export const fetchCuisineCategories = async () => {
  const res = await api.get("/browse/categories");
  return res.data?.data || [];
};

export const trackDeliveryClick = async (restaurantId, providerName) => {
  try {
    await api.post("/browse/track-click", { restaurantId, providerName });
  } catch {
    // fail silently - don't break UX for analytics
  }
};
