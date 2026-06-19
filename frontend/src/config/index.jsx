import axios from "axios";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9080";

const clientServerConfig = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request Interceptor: Inject JWT token from localStorage if it exists
clientServerConfig.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default clientServerConfig;