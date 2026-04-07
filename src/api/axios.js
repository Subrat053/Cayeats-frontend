import axios from "axios";

const resolveApiBaseUrl = () => {
  const configured =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Prevent mixed content: if app is served over HTTPS, never call an HTTP API.
  if (
    typeof window !== "undefined" &&
    window.location.protocol === "https:" &&
    configured.startsWith("http://")
  ) {
    return configured.replace("http://", "https://");
  }

  return configured;
};

const api = axios.create({
  baseURL: resolveApiBaseUrl(),
});

api.interceptors.request.use((config) => {
  // Robust token retrieval: prefer explicit `token`, fallback to `user.token` if present
  let token = localStorage.getItem("token");
  if (!token) {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        const parsed = JSON.parse(storedUser);
        token = parsed?.token || token;
      } catch (e) {
        // ignore
      }
    }
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // protect middleware expects 'Bearer <token>'
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;
    if (status === 403 && message === "Waiting for admin approval") {
      return Promise.reject(
        new Error("Without approval you cant update anything"),
      );
    }
    return Promise.reject(error);
  },
);

export default api;
