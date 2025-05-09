import axios from "axios";
import { BASE_URL } from "./apiPath";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: "application/json",
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message;

      if (status === 401 || message === "jwt expired") {
        // ✅ Clear token to prevent infinite loop
        localStorage.removeItem("token");
        sessionStorage.clear(); // (Optional, if you store anything there)

        // ✅ Redirect to login
        window.location.href = "/login";
      } else if (status === 500) {
        console.log("Server error. Please try again later.");
      }
    } else if (error.code === "ECONNABORTED") {
      console.log("Timeout error. Please try again later.");
    }
    

    return Promise.reject(error);
  }
);

export default axiosInstance;
