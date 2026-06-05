import axios from "axios";
import {
  notifyApiResponse,
  getApiMessage,
  notifyError,
} from "../utils/notifications";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Ne montrer un toast que si explicitement demandé via showToast: true
    const shouldToast = response?.config?.showToast === true;
    if (shouldToast) {
      notifyApiResponse(response?.data, "Opération réussie");
    }
    return response;
  },
  (error) => {
    const shouldToast = error?.config?.suppressToast !== true;
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    if (shouldToast) {
      const message = getApiMessage(error.response?.data, error.message);
      notifyError(message);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
