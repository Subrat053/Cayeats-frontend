/**
 * Production-Ready Validation and Error Handling Utilities
 */
import { logger } from "./logger";

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL format
 */
export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate positive number
 */
export const validatePositiveNumber = (num) => {
  return !isNaN(num) && num > 0;
};

/**
 * Validate string length
 */
export const validateStringLength = (str, minLength = 1, maxLength = 255) => {
  return str && str.length >= minLength && str.length <= maxLength;
};

/**
 * Safely parse JSON with fallback
 */
export const safeJsonParse = (jsonString, fallback = null) => {
  try {
    return JSON.parse(jsonString);
  } catch (err) {
    logger.warn(`Failed to parse JSON: ${jsonString}`, err);
    return fallback;
  }
};

/**
 * Sanitize user input (basic XSS prevention)
 */
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
};

/**
 * Safe localStorage operations with error handling
 */
export const safeStorage = {
  getItem: (key, fallback = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? item : fallback;
    } catch (err) {
      logger.warn(`Failed to get item from localStorage: ${key}`, err);
      return fallback;
    }
  },

  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (err) {
      if (err.name === "QuotaExceededError") {
        logger.error("localStorage quota exceeded", err);
        // Attempt to clear old data
        try {
          // Remove oldest favorites and cache
          const keys = Object.keys(localStorage).filter((k) =>
            k.startsWith("favorites_"),
          );
          if (keys.length > 0) {
            localStorage.removeItem(keys[0]);
            localStorage.setItem(key, value); // Retry
            return true;
          }
        } catch (retryErr) {
          logger.error("Failed to free storage space", retryErr);
        }
      } else {
        logger.error("Failed to set item in localStorage", err);
      }
      return false;
    }
  },

  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (err) {
      logger.warn(`Failed to remove item from localStorage: ${key}`, err);
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (err) {
      logger.error("Failed to clear localStorage", err);
      return false;
    }
  },
};

/**
 * Retry failed API calls with exponential backoff
 */
export const retryWithBackoff = async (
  fn,
  maxRetries = 3,
  baseDelay = 1000,
) => {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i); // Exponential backoff
        logger.debug(`Retry ${i + 1}/${maxRetries} after ${delay}ms`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
};

/**
 * Safe API response validation
 */
export const validateApiResponse = (response, expectedFields = []) => {
  if (!response) {
    logger.warn("API response is null or undefined");
    return false;
  }

  if (typeof response !== "object") {
    logger.warn("API response is not an object", response);
    return false;
  }

  for (const field of expectedFields) {
    if (!(field in response)) {
      logger.warn(`Missing expected field in API response: ${field}`);
      return false;
    }
  }

  return true;
};

/**
 * Create proper error messages for users
 */
export const getUserFriendlyError = (error) => {
  if (!error) return "An unexpected error occurred";

  // Axios error
  if (error.response?.status === 401) {
    return "Your session has expired. Please log in again.";
  }
  if (error.response?.status === 403) {
    return "You do not have permission to perform this action.";
  }
  if (error.response?.status === 404) {
    return "The requested resource was not found.";
  }
  if (error.response?.status >= 500) {
    return "Server error. Please try again later.";
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Network error
  if (error.message === "Network Error") {
    return "Network connection failed. Please check your internet.";
  }

  // Generic message
  return error.message || "An unexpected error occurred. Please try again.";
};

export default {
  validateEmail,
  validateUrl,
  validatePositiveNumber,
  validateStringLength,
  safeJsonParse,
  sanitizeInput,
  safeStorage,
  retryWithBackoff,
  validateApiResponse,
  getUserFriendlyError,
};
