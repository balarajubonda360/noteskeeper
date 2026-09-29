import axios from "axios";
import toast from "react-hot-toast";

export const TOKEN_STORAGE_KEY = "inkvault_token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

const wakeupToastId = "inkvault-server-wakeup";
let hasStartedRequest = false;
let wakeupTimer;

const clearWakeupNotice = () => {
  window.clearTimeout(wakeupTimer);
  toast.dismiss(wakeupToastId);
};

api.interceptors.request.use((config) => {
  if (!hasStartedRequest) {
    hasStartedRequest = true;
    wakeupTimer = window.setTimeout(() => {
      toast.loading("Server is waking up, please wait", { id: wakeupToastId });
    }, 2200);
  }
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => { clearWakeupNotice(); return response; },
  (error) => {
    clearWakeupNotice();
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
