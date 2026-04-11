import api from "./axios";
import { logger } from "../utils/logger";

// ─── Get Public Settings (no auth required) ───────────────
export const getPublicSettings = async () => {
  try {
    const response = await api.get("/browse/settings");
    return response.data?.data || {};
  } catch (error) {
    // Silently fail and return defaults
    return {};
  }
};

// ─── Get Settings (admin only) ────────────────────────────
export const getSettings = async () => {
  try {
    const response = await api.get("/admin/settings");
    return response.data?.data || {};
  } catch (error) {
    // Handle 401 (unauthorized) gracefully - not all users are admins
    if (error.response?.status === 401) {
      return {}; // Return empty settings instead of throwing/logging
    }
    // Only log unexpected errors (non-401)
    logger.debug("Settings unavailable:", error.message);
    return {}; // Return empty settings as fallback
  }
};

// ─── Get Currency ─────────────────────────────────────────
export const getCurrency = async () => {
  try {
    // Use public endpoint - no auth needed
    const settings = await getPublicSettings();
    return settings?.currency || "USD";
  } catch {
    return "USD"; // Return default currency on error (shouldn't happen due to getPublicSettings catch)
  }
};

// ─── Update Settings ──────────────────────────────────────
export const updateSettings = async (data) => {
  try {
    const response = await api.put("/admin/settings", data);
    return response.data?.data || {};
  } catch (error) {
    logger.error("Error updating settings:", error);
    throw error;
  }
};

// ─── Update Currency ──────────────────────────────────────
export const updateCurrency = async (currency) => {
  try {
    const response = await api.put("/admin/settings", {
      payments: {
        currency: currency,
      },
    });
    return response.data?.data?.payments?.currency || currency;
  } catch (error) {
    logger.error("Error updating currency:", error);
    throw error;
  }
};

// ─── Format Price with Currency ───────────────────────────
export const formatPrice = (price, currencyCode = "USD") => {
  const currencySymbols = {
    USD: "$",
    KYD: "CI$",
  };

  const symbol = currencySymbols[currencyCode] || currencyCode;
  return `${symbol}${Number(price).toFixed(2)}`;
};

// ─── Get Currency Symbol ──────────────────────────────────
export const getCurrencySymbol = (currencyCode = "USD") => {
  const currencySymbols = {
    USD: "$",
    KYD: "CI$",
  };

  return currencySymbols[currencyCode] || currencyCode;
};
