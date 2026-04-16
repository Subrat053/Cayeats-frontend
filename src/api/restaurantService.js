import api from "./axios";
import { validateApiResponse } from "../utils/validation";

// ─── Dashboard ────────────────────────────────────────────
export const getDashboardData = async () => {
  try {
    const [profileRes, statsRes] = await Promise.all([
      api.get("/restaurant/profile"),
      api.get("/restaurant/stats"),
    ]);
    const profile = profileRes.data?.data || {};
    const stats = statsRes.data?.data || {};
    return { ...profile, ...stats };
  } catch (error) {
    const message =
      error?.response?.data?.message || error?.message || "API Error";
    throw new Error(message);
  }
};

// ─── Profile ──────────────────────────────────────────────
export const getRestaurantProfile = async () => {
  const res = await api.get("/restaurant/profile");
  if (!validateApiResponse(res.data, ["data"])) {
    throw new Error("Invalid restaurant profile data received");
  }
  return res.data?.data;
};

export const updateRestaurantProfile = async (data) => {
  const res = await api.put("/restaurant/profile", data);
  if (!validateApiResponse(res.data, ["data"])) {
    throw new Error("Invalid response from profile update");
  }
  return res.data?.data;
};

// ─── Stats ────────────────────────────────────────────────
export const getRestaurantStats = async () => {
  const res = await api.get("/restaurant/stats");
  if (!validateApiResponse(res.data, ["data"])) {
    return {};
  }
  return res.data?.data || res.data;
};

// ─── Hours ────────────────────────────────────────────────
export const updateRestaurantHours = async (hours) => {
  const res = await api.put("/restaurant/hours", { hours });
  if (!validateApiResponse(res.data, ["data"])) {
    throw new Error("Invalid response from hours update");
  }
  return res.data?.data;
};

// ─── Analytics ────────────────────────────────────────────
export const getAnalytics = async () => {
  const res = await api.get("/restaurant/analytics");
  if (!validateApiResponse(res.data, ["data"])) {
    return {};
  }
  return res.data?.data;
};

// ─── Subscription ─────────────────────────────────────────
export const getSubscriptionDetails = async () => {
  const res = await api.get("/restaurant/subscription");
  return res.data?.data;
};

export const toggleAutoRenew = async (autoRenew) => {
  const res = await api.put("/restaurant/subscription/auto-renew", {
    autoRenew,
  });
  return res.data?.data;
};

// ─── Billing ──────────────────────────────────────────────
export const getBillingHistory = async () => {
  const res = await api.get("/restaurant/billing");
  return res.data;
};

// ─── Ads Pricing ──────────────────────────────────────────
export const getAdsPricing = async () => {
  const res = await api.get("/restaurant/ads/pricing");
  return res.data?.data;
};

// ─── Featured Listing ─────────────────────────────────────
export const getFeaturedListingStatus = async () => {
  const res = await api.get("/restaurant/ads/featured");
  return res.data?.data;
};

export const purchaseFeaturedListing = async (duration) => {
  const res = await api.post("/restaurant/ads/featured", { duration });
  return res.data;
};

export const cancelFeaturedListing = async (listingId) => {
  const res = await api.put(`/restaurant/ads/featured/${listingId}/cancel`);
  return res.data;
};

// ─── Tonight's Cravings ───────────────────────────────────
export const getCravingsStatus = async () => {
  const res = await api.get("/restaurant/ads/cravings");
  return res.data?.data;
};

export const purchaseTonightsCravings = async (data) => {
  const res = await api.post("/restaurant/ads/cravings", data);
  return res.data;
};

// ─── Banner Ads ───────────────────────────────────────────
export const getBannerAdStatus = async () => {
  const res = await api.get("/restaurant/ads/banner");
  return res.data?.data;
};

export const purchaseBannerAd = async (data) => {
  const res = await api.post("/restaurant/ads/banner", data);
  return res.data;
};

// ─── Preferred Delivery ───────────────────────────────────
export const getPreferredDeliveryStatus = async () => {
  const res = await api.get("/restaurant/ads/preferred-delivery");
  return res.data?.data;
};

export const purchasePreferredDelivery = async (data) => {
  const res = await api.post("/restaurant/ads/preferred-delivery", data);
  return res.data;
};

// ─── Image Upload ─────────────────────────────────────────
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await api.post("/restaurant/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return (
    res.data?.url ||
    res.data?.data?.profileImage ||
    res.data?.data?.image ||
    null
  );
};

export const uploadImageWithMeta = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await api.post("/restaurant/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  const url =
    res.data?.url ||
    res.data?.data?.profileImage ||
    res.data?.data?.image ||
    null;
  const publicId = res.data?.publicId || null;

  return { url, publicId };
};

// ─── Products ─────────────────────────────────────────────
export const getProducts = async () => {
  const res = await api.get("/restaurant/products");
  if (!validateApiResponse(res.data, ["data"])) {
    return [];
  }
  return res.data?.data;
};

export const addProduct = async (data) => {
  const res = await api.post("/restaurant/products", data);
  if (!validateApiResponse(res.data, ["data"])) {
    throw new Error("Invalid product data received from server");
  }
  return res.data?.data;
};

export const updateProduct = async (id, data) => {
  const res = await api.put(`/restaurant/products/${id}`, data);
  if (!validateApiResponse(res.data, ["data"])) {
    throw new Error("Invalid response from product update");
  }
  return res.data?.data;
};

export const deleteProduct = async (id) => {
  const res = await api.delete(`/restaurant/products/${id}`);
  return res.data;
};

export const getDeliveryClicks = async () => {
  const res = await api.get("/restaurant/delivery-clicks");
  return res.data?.data || res.data;
};

export const updateDeliveryProvider = async (providerName, orderUrl) => {
  const res = await api.put("/restaurant/delivery-providers", {
    providerName,
    orderUrl,
  });
  return res.data?.data;
};

export const getSubscriptionPricing = async () => {
  const res = await api.get("/restaurant/subscription/pricing");
  return res.data?.data;
};

export const createCheckoutSession = async (plan) => {
  const res = await api.post("/restaurant/subscription/checkout", { plan });
  return res.data;
};

export const getOrders = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const res = await api.get(`/restaurant/orders?${query}`);
  if (!validateApiResponse(res.data, ["data"])) {
    return [];
  }
  return res.data?.data;
};

export const updateOrderStatus = async (id, status) => {
  const res = await api.put(`/restaurant/orders/${id}/status`, { status });
  return res.data?.data;
};

// ─── Menu Images ───────────────────────────────────────────
export const getMenuImages = async () => {
  const res = await api.get("/restaurant/menu-images");
  return res.data?.data || [];
};

export const addMenuImage = async (imageUrl, publicId) => {
  const res = await api.post("/restaurant/menu-images", { imageUrl, publicId });
  return res.data?.data;
};

export const deleteMenuImage = async (imageUrl, publicId) => {
  const res = await api.delete("/restaurant/menu-images", {
    data: { imageUrl, publicId },
  });
  return res.data?.data;
};
