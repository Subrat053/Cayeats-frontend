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
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("user");
      }
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

      // Validate API response
      if (!validateApiResponse(data, ["user"])) {
        setError("Invalid server response: missing user data");
        return { success: false, error: "Invalid server response" };
      }

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.token) localStorage.setItem("token", data.token);

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

      // Validate API response
      if (!validateApiResponse(data, ["user"])) {
        setError("Invalid server response: missing user data");
        return { success: false, error: "Invalid server response" };
      }

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.token) localStorage.setItem("token", data.token);

      if (navigate) redirectByRole(data.user.role, navigate);

      return { success: true, user: data.user };
    } catch (err) {
      const message =
        err?.response?.data?.message || err.message || "Registration failed";
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = (navigate) => {
    // Save currency before clearing localStorage (it's a global platform setting, not user-specific)
    const savedCurrency = localStorage.getItem("platformCurrency");

    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Restore currency after clearing
    if (savedCurrency) {
      localStorage.setItem("platformCurrency", savedCurrency);
    }

    if (navigate) navigate("/login");
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
