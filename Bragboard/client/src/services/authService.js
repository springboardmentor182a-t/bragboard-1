import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const login = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user || {}));
  }
  return res.data;
};

export const signup = async (payload) => {
  const res = await api.post("/auth/signup", payload);
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

export default api;
