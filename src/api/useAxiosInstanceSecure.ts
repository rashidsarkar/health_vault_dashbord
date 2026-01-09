import axios, { AxiosInstance } from "axios";
import { useEffect } from "react";
import { useAuth } from "@/providers/useAuth";
import { useNavigate } from "react-router";

const axiosInstanceSecure: AxiosInstance = axios.create({
  baseURL: "http://10.10.20.3:3333/api/v1",
  withCredentials: true,
});

// Export the base instance for setup
export const getAxiosInstanceSecure = () => axiosInstanceSecure;

export function useAxiosInstanceSecure() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const requestInterceptor = axiosInstanceSecure.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access-token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosInstanceSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
          // Token expired or unauthorized
          logout();
          navigate("/login", { replace: true });
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors
    return () => {
      axiosInstanceSecure.interceptors.request.eject(requestInterceptor);
      axiosInstanceSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [logout, navigate]);

  return axiosInstanceSecure;
}

export default axiosInstanceSecure;
