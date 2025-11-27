import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// -------------------------
// Auth API Calls
// -------------------------

export const loginUser = async (email, password) => {
  const res = await API.post("/auth/login", { email, password });
  return res.data;
};

export const registerUser = async (data) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};

export const sendOtp = async (email) => {
  const res = await API.post(`/auth/send-otp?email=${email}`);
  return res.data;
};

export const verifyOtp = async (email, otp) => {
  const res = await API.post(`/auth/verify-otp?email=${email}&otp=${otp}`);
  return res.data;
};

export const changePassword = async (old_password, new_password) => {
  const res = await API.post("/auth/change-password", {
    old_password,
    new_password,
  });
  return res.data;
};
