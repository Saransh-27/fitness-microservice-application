import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

const API_BASE_URL =
  import.meta.env.VITE_API_GATEWAY_URL || "http://localhost:8083";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Bearer token to every request automatically from Zustand auth store
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn(
        "API 401 Unauthorized:",
        error.config?.method?.toUpperCase(),
        error.config?.url
      );
    }
    return Promise.reject(error);
  }
);

/**
 * Helper: create a one-off Axios instance with an explicit token.
 * Used during loginDirect when the Zustand store hasn't been set yet.
 */
export function createAuthenticatedApi(token: string) {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return instance;
}

export default api;
