import axios from "axios";

const baseURL = 'https://laundry-backend-wdek.onrender.com' || "http://localhost:3000";

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export default api;
