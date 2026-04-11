import { createContext, useContext, useState, useCallback } from "react";
import { getFooterPage } from "../api/browseServices";
import { logger } from "../utils/logger";

const FooterPageContext = createContext();

export const FooterPageProvider = ({ children }) => {
  const [cache, setCache] = useState({});
  const [loading, setLoading] = useState({});
  const [error, setError] = useState({});

  const fetchFooterPage = useCallback(
    async (slug, forceRefresh = false) => {
      // Return cached data if available and not forcing refresh
      if (cache[slug] && !forceRefresh) {
        return cache[slug];
      }

      try {
        setLoading((prev) => ({ ...prev, [slug]: true }));
        setError((prev) => ({ ...prev, [slug]: null }));

        const data = await getFooterPage(slug);

        // Update cache
        setCache((prev) => ({
          ...prev,
          [slug]: data,
        }));

        return data;
      } catch (err) {
        setError((prev) => ({
          ...prev,
          [slug]: err.message || "Failed to load page",
        }));
        logger.error(`Failed to load footer page: ${slug}`, err);
        return null;
      } finally {
        setLoading((prev) => ({ ...prev, [slug]: false }));
      }
    },
    [cache],
  );

  const invalidateCache = useCallback((slug) => {
    // Force refresh a specific page
    setCache((prev) => {
      const newCache = { ...prev };
      delete newCache[slug];
      return newCache;
    });
  }, []);

  const invalidateAllCache = useCallback(() => {
    // Clear entire cache
    setCache({});
  }, []);

  const value = {
    getFooterPage: fetchFooterPage,
    invalidateCache,
    invalidateAllCache,
    cache,
    loading,
    error,
  };

  return (
    <FooterPageContext.Provider value={value}>
      {children}
    </FooterPageContext.Provider>
  );
};

export const useFooterPage = () => {
  const context = useContext(FooterPageContext);
  if (!context) {
    throw new Error("useFooterPage must be used within FooterPageProvider");
  }
  return context;
};
