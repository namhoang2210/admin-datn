// lib/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

export default axiosInstance;
