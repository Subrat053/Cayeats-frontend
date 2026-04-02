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

export const uploadAdminBrandingImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/admin/settings/upload-branding", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data?.url;
};

// Footer settings
export const getFooterSettings = async () => {
  const res = await api.get("/admin/footer");
  return res.data?.data;
};

export const updateFooterSettings = async (footerData) => {
  const res = await api.put("/admin/footer", { footer: footerData });
  return res.data?.data;
};

// Report Management
export const getAllReports = async () => {
  const res = await api.get("/admin/reports");
  return res.data?.data || [];
};

export const getReportById = async (id) => {
  const res = await api.get(`/admin/reports/${id}`);
  return res.data?.data;
};

export const getReportsByStatus = async (status) => {
  const res = await api.get(`/admin/reports/status/${status}`);
  return res.data?.data || [];
};

export const updateReportStatus = async (id, status) => {
  const res = await api.put(`/admin/reports/${id}/status`, { status });
  return res.data?.data;
};

export const replyToReport = async (id, adminReply, adminNotes = "") => {
  const res = await api.put(`/admin/reports/${id}/reply`, {
    adminReply,
    adminNotes,
  });
  return res.data?.data;
};

export const deleteReport = async (id) => {
  const res = await api.delete(`/admin/reports/${id}`);
  return res.data;
};

// ─── Footer Page Management ───────────────────────────────
export const getAllFooterPages = async () => {
  const res = await api.get("/admin/footer-pages");
  return res.data?.data || [];
};

export const getFooterPageBySlug = async (slug) => {
  const res = await api.get(`/admin/footer-pages/${slug}`);
  return res.data?.data;
};

export const createOrUpdateFooterPage = async (slug, data) => {
  const res = await api.put(`/admin/footer-pages/${slug}`, data);
  return res.data?.data;
};

export const addFAQ = async (slug, faqData) => {
  const res = await api.post(`/admin/footer-pages/${slug}/faq`, faqData);
  return res.data?.data;
};

export const updateFAQ = async (slug, faqId, faqData) => {
  const res = await api.put(
    `/admin/footer-pages/${slug}/faq/${faqId}`,
    faqData,
  );
  return res.data?.data;
};

export const deleteFAQ = async (slug, faqId) => {
  const res = await api.delete(`/admin/footer-pages/${slug}/faq/${faqId}`);
  return res.data?.data;
};

export const updateContactInfo = async (slug, contactData) => {
  const res = await api.put(`/admin/footer-pages/${slug}/contact`, contactData);
  return res.data?.data;
};

export const togglePageStatus = async (slug) => {
  const res = await api.put(`/admin/footer-pages/${slug}/toggle`);
  return res.data?.data;
};

export const initializeDefaultPages = async () => {
  const res = await api.post("/admin/footer-pages/initialize");
  return res.data;
};
