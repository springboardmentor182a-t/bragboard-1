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
// Helpers to extract safe error message
// -------------------------
const extractError = (error) => {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }

  if (Array.isArray(error.response?.data)) {
    return error.response.data[0]?.msg || "Invalid input";
  }

  return "Something went wrong";
};

// -------------------------
// Auth API Calls
// -------------------------

export const loginUser = async (email, password) => {
  try {
    const res = await API.post("/auth/login", { email, password });
    return res.data;
  } catch (error) {
    throw extractError(error);
  }
};

export const registerUser = async (data) => {
  try {
    const res = await API.post("/auth/register", data);
    return res.data;
  } catch (error) {
    throw extractError(error);
  }
};

// ✔ CORRECT OTP API
export const sendOtp = async (email) => {
  try {
    const res = await API.post("/auth/forgot-password", { email });
    return res.data;
  } catch (error) {
    throw extractError(error);
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const res = await API.post("/auth/verify-otp", { email, otp });
    return res.data;
  } catch (error) {
    throw extractError(error);
  }
};

export const changePassword = async (old_password, new_password) => {
  try {
    const res = await API.post("/auth/change-password", {
      old_password,
      new_password,
    });
    return res.data;
  } catch (error) {
    throw extractError(error);
  }
};
