import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { validateApiResponse } from "../utils/validation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";
  const isRestaurantOwner = user?.role === "restaurant";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    // ✅ Only restore session if BOTH user and token exist
    if (
      storedUser &&
      storedUser !== "undefined" &&
      storedToken &&
      storedToken.length > 0
    ) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // ✅ Ensure the user object has role for auth checks
        if (parsedUser && parsedUser.role) {
          setUser(parsedUser);
        } else {
          // Invalid user object, clear both
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        }
      } catch (e) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } else {
      // ✅ Clean up any partial state - both must be present
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
    setLoading(false);
  }, []);

  // ✅ role-based redirect helper
  const redirectByRole = (role, navigate) => {
    if (role === "admin") navigate("/admin");
    else if (role === "restaurant") navigate("/dashboard");
    else navigate("/");
  };

  const login = async (email, password, type = "user", navigate) => {
    setError(null);

    // ✅ Role-based login endpoints
    const endpoints = {
      restaurant: "/restaurant/login",
      admin: "/admin/login", // ✅ Correct admin endpoint
      user: "/user/login",
    };
    const endpoint = endpoints[type] || endpoints.user;

    try {
      const { data } = await api.post(endpoint, { email, password });

      // ✅ Validate API response - BOTH user AND token must be present
      if (!validateApiResponse(data, ["user", "token"])) {
        setError("Invalid server response: missing user or token data");
        return { success: false, error: "Invalid server response" };
      }

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      // ✅ ALWAYS set token - it's required for API requests
      localStorage.setItem("token", data.token);

      // ✅ redirect based on actual role from backend
      if (navigate) redirectByRole(data.user.role, navigate);

      return { success: true, user: data.user };
    } catch (err) {
      const message =
        err?.response?.data?.message || err.message || "Login failed";
      setError(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData, type = "user", navigate) => {
    setError(null);

    const endpoints = {
      restaurant: "/restaurant/register",
      user: "/user/register",
    };
    const endpoint = endpoints[type] || endpoints.user;

    try {
      const { data } = await api.post(endpoint, userData);

      // ✅ Validate API response - BOTH user AND token must be present
      if (!validateApiResponse(data, ["user", "token"])) {
        setError("Invalid server response: missing user or token data");
        return { success: false, error: "Invalid server response" };
      }

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      // ✅ ALWAYS set token - it's required for API requests
      localStorage.setItem("token", data.token);

      if (navigate) redirectByRole(data.user.role, navigate);

      return { success: true, user: data.user };
    } catch (err) {
      const message =
        err?.response?.data?.message || err.message || "Registration failed";
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = (navigate, redirectTo = "/") => {
    const savedCurrency = localStorage.getItem("platformCurrency");
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    if (savedCurrency) localStorage.setItem("platformCurrency", savedCurrency);
    if (navigate) navigate(redirectTo);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        loading,
        error,
        isAuthenticated,
        isAdmin,
        isRestaurantOwner,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
