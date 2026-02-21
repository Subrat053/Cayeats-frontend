import axios from "axios";

const api = axios.create({
  baseURL: "https://api.cayeats.online/api",
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

export default api;
