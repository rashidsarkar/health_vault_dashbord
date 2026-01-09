import axios from "axios";

const axiosInstancePublic = axios.create({
  // baseURL: "https://server-livid-eight.vercel.app", // Your API base URL
  baseURL: "http://10.10.20.3:3333/api/v1", // Your API base URL
  withCredentials: true,
});

export default axiosInstancePublic;
