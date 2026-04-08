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

export const fetchRestaurantMenu = async (restaurantId, searchTerm = "") => {
  const params = new URLSearchParams();
  if (searchTerm) params.append("searchTerm", searchTerm);
  const res = await api.get(
    `/browse/restaurants/${restaurantId}/menu?${params.toString()}`,
  );
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

export const submitContact = async (contactData) => {
  const res = await api.post("/browse/contact", contactData);
  return res.data;
};

export const submitReportIssue = async (reportData) => {
  const res = await api.post("/browse/report-issue", reportData);
  return res.data;
};

// ─── Footer Pages ─────────────────────────────────────────
export const getFooterPage = async (slug) => {
  const res = await api.get(`/admin/public/footer-pages/${slug}`);
  return res.data?.data;
};
