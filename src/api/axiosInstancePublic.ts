import axios from "axios";

const axiosInstancePublic = axios.create({
  baseURL: "http://10.10.20.3:3333/api/v1",
  withCredentials: true,
});

// Add token to requests
axiosInstancePublic.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access-token");
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration and errors
axiosInstancePublic.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("access-token");
      localStorage.removeItem("user");
      document.cookie =
        "access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstancePublic;
