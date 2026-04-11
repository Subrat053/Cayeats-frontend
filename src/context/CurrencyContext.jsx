import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getCurrency, getCurrencySymbol } from "../api/settingsService";
import { logger } from "../utils/logger";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState("USD");
  const [currencySymbol, setCurrencySymbol] = useState("$");
  const [loading, setLoading] = useState(true);

  // Load currency from localStorage
  const loadFromLocalStorage = useCallback(() => {
    try {
      const savedCurrency = localStorage.getItem("platformCurrency");
      if (savedCurrency) {
        return savedCurrency;
      }
    } catch (error) {
      logger.error("Error reading from localStorage:", error);
    }
    return "USD";
  }, []);

  // Save currency to localStorage
  const saveToLocalStorage = useCallback((curr) => {
    try {
      localStorage.setItem("platformCurrency", curr);
    } catch (error) {
      logger.error("Error saving to localStorage:", error);
    }
  }, []);

  // Fetch currency from backend and save to localStorage
  const fetchCurrency = useCallback(async () => {
    try {
      const curr = await getCurrency();
      if (curr) {
        setCurrency(curr);
        setCurrencySymbol(getCurrencySymbol(curr));
        saveToLocalStorage(curr);
      }
    } catch (error) {
      logger.error("Error loading currency:", error);
      // Keep current value
    } finally {
      setLoading(false);
    }
  }, [saveToLocalStorage]);

  // Directly set currency (called from admin panel when saving)
  // This updates immediately and saves to localStorage + sends to server via admin
  const setCurrencyDirectly = useCallback(
    (newCurrency) => {
      setCurrency(newCurrency);
      setCurrencySymbol(getCurrencySymbol(newCurrency));
      saveToLocalStorage(newCurrency);
    },
    [saveToLocalStorage],
  );

  // Fetch currency on mount (load from localStorage first, then verify with server)
  useEffect(() => {
    // Load from localStorage immediately for fast initial display
    const savedCurrency = loadFromLocalStorage();
    setCurrency(savedCurrency);
    setCurrencySymbol(getCurrencySymbol(savedCurrency));
    setLoading(false);

    // Then fetch from server to verify/update in background
    const verifyAndUpdateCurrency = async () => {
      try {
        const serverCurrency = await getCurrency();
        // Only update if different from localStorage
        if (serverCurrency && serverCurrency !== savedCurrency) {
          setCurrency(serverCurrency);
          setCurrencySymbol(getCurrencySymbol(serverCurrency));
          saveToLocalStorage(serverCurrency);
        }
      } catch (error) {
        // Silently handle errors - localStorage value is already in use
        // This is expected for non-admin users
      }
    };

    verifyAndUpdateCurrency();
  }, [loadFromLocalStorage, saveToLocalStorage]);

  // Refresh when window regains focus
  useEffect(() => {
    const handleFocus = () => {
      fetchCurrency();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [fetchCurrency]);

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencySymbol,
        loading,
        refreshCurrency: fetchCurrency,
        setCurrencyDirectly,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return context;
};
