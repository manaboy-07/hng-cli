import axios from "axios";
import { BACKEND_URL, clearTokens, getTokens, saveTokens } from "./utils.js";

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: { "X-API-Version": "1" },
});

api.interceptors.request.use(async (config) => {
  const tokens = await getTokens();
  if (tokens?.access_token) {
    config.headers.Authorization = `Bearer ${tokens.access_token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const tokens = await getTokens();
      if (tokens?.refresh_token) {
        try {
          const res = await axios.post(`${BACKEND_URL}/auth/refresh`, {
            refresh_token: tokens.refresh_token,
          });
          await saveTokens(res.data);
          originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          await clearTokens();
          console.error(
            "\n Session expired. Please run 'insighta login' again.",
          );
          process.exit(1);
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
