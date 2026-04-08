import api from "./axios";

// ─── Get Settings ─────────────────────────────────────────
export const getSettings = async () => {
  try {
    const response = await api.get("/admin/settings");
    return response.data?.data || {};
  } catch (error) {
    console.error("Error fetching settings:", error);
    throw error;
  }
};

// ─── Get Currency ─────────────────────────────────────────
export const getCurrency = async () => {
  try {
    const settings = await getSettings();
    return settings?.payments?.currency || "USD";
  } catch (error) {
    console.error("Error fetching currency:", error);
    return null; // Keep current/localStorage value on failure
  }
};

// ─── Update Settings ──────────────────────────────────────
export const updateSettings = async (data) => {
  try {
    const response = await api.put("/admin/settings", data);
    return response.data?.data || {};
  } catch (error) {
    console.error("Error updating settings:", error);
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
    console.error("Error updating currency:", error);
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
