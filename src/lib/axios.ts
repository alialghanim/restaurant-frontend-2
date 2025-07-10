import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
  withCredentials: true,
  validateStatus: (status) => status >= 200 && status < 400,
});

// ✅ Request Interceptor
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      const isPublic =
        config.url?.includes("/auth/login") ||
        config.url?.includes("/auth/register");

      if (token && !isPublic && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (process.env.NODE_ENV !== "production") {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor
api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[API Response] ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message || "حدث خطأ غير متوقع";

    // ✅ عرض توست حسب الحالة
    if (status === 401) toast.error("Unauthorized. Please login again.");
    else if (status === 403) toast.error("Access Denied.");
    else if (status === 500) toast.error("Server error. Try again later.");

    if (process.env.NODE_ENV !== "production") {
  console.error("[API Error]", {
    status: error?.response?.status,
    message: error?.message,
    url: error?.config?.url,
  });
}

    return Promise.reject(error);
  }
);

export default api;
