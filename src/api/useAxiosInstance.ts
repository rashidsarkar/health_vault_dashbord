import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const axiosInstanceSecure = axios.create({
  baseURL: "https://ass-12-v2.vercel.app",
});

function useAxiosInstanceSecure() {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const requestInterceptor = axiosInstanceSecure.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access-token");
        if (token) {
          config.headers.authorization = `${token}`;
        }
        return config;
      }
    );

    const responseInterceptor = axiosInstanceSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
          await logOut();
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    // cleanup (very important)
    return () => {
      axiosInstanceSecure.interceptors.request.eject(requestInterceptor);
      axiosInstanceSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [logOut, navigate]);

  return axiosInstanceSecure;
}

export default useAxiosInstanceSecure;
