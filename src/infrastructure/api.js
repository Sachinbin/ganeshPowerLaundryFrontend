import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export default api;
