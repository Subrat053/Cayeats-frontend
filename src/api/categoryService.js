import api from "./axios";
import { logger } from "../utils/logger";

// Get all categories for restaurant
export const getCategories = async () => {
  try {
    const response = await api.get("/restaurant/categories");
    return response.data.data || [];
  } catch (error) {
    logger.error("Error fetching categories:", error);
    throw error;
  }
};

// Create new category
export const createCategory = async (categoryData) => {
  try {
    const response = await api.post("/restaurant/categories", categoryData);
    return response.data.data;
  } catch (error) {
    logger.error("Error creating category:", error);
    throw error;
  }
};

// Update category
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const response = await api.put(
      `/restaurant/categories/${categoryId}`,
      categoryData,
    );
    return response.data.data;
  } catch (error) {
    logger.error("Error updating category:", error);
    throw error;
  }
};

// Delete category
export const deleteCategory = async (categoryId) => {
  try {
    const response = await api.delete(`/restaurant/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    logger.error("Error deleting category:", error);
    throw error;
  }
};

// Reorder categories
export const reorderCategories = async (categories) => {
  try {
    const response = await api.put("/restaurant/categories/reorder/all", {
      categories,
    });
    return response.data.data;
  } catch (error) {
    logger.error("Error reordering categories:", error);
    throw error;
  }
};

// Get category analytics
export const getCategoryAnalytics = async () => {
  try {
    const response = await api.get("/restaurant/categories/analytics/all");
    return response.data.data || [];
  } catch (error) {
    logger.error("Error fetching category analytics:", error);
    throw error;
  }
};

// Track category view (public)
export const trackCategoryView = async (categoryId) => {
  try {
    const response = await api.post(`/browse/categories/${categoryId}/track`);
    return response.data.data;
  } catch (error) {
    // Fail silently for tracking - don't break UX
    logger.warn("Failed to track category view:", error);
  }
};
