import api from "./axios";

export const getAdminDashboard = async () => {
  const res = await api.get("/admin/dashboard");
  return res.data?.data;
};

export const getAllRestaurants = async (params = {}) => {
  const res = await api.get("/admin/restaurants", { params });
  return res.data;
};

export const approveRestaurant = async (id) => {
  const res = await api.put(`/admin/restaurants/${id}/approve`);
  return res.data;
};

export const rejectRestaurant = async (id) => {
  const res = await api.put(`/admin/restaurants/${id}/reject`);
  return res.data;
};

export const updateRestaurantSubscription = async (id, data) => {
  const res = await api.put(`/admin/restaurants/${id}/subscription`, data);
  return res.data;
};

export const deleteRestaurant = async (id) => {
  const res = await api.delete(`/admin/restaurants/${id}`);
  return res.data;
};

export const getPendingCravings = async () => {
  const res = await api.get("/admin/cravings/pending");
  return res.data?.data;
};

export const approveCraving = async (id) => {
  const res = await api.put(`/admin/cravings/${id}/approve`);
  return res.data;
};

export const rejectCraving = async (id) => {
  const res = await api.put(`/admin/cravings/${id}/reject`);
  return res.data;
};

export const getPendingBanners = async () => {
  const res = await api.get("/admin/banners/pending");
  return res.data?.data;
};

export const approveBanner = async (id) => {
  const res = await api.put(`/admin/banners/${id}/approve`);
  return res.data;
};

export const rejectBanner = async (id, reason) => {
  const res = await api.put(`/admin/banners/${id}/reject`, { reason });
  return res.data;
};

export const getAllUsers = async () => {
  const res = await api.get("/admin/users");
  return res.data?.data;
};

export const getAdminAnalytics = async () => {
  const res = await api.get("/admin/analytics");
  return res.data?.data;
};

export const getDeliveryProviders = async () => {
  const res = await api.get("/admin/delivery-providers");
  return res.data?.data;
};

//updation of admin on pricings
export const getAdminSettings = async () => {
  const res = await api.get("/admin/settings");
  return res.data?.data;
};

export const updateAdminSettings = async (data) => {
  const res = await api.put("/admin/settings", data);
  return res.data?.data;
};
