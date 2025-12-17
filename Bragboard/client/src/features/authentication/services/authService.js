import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

// 🔐 Attach token automatically
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ❗ Unified error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message;
        throw new Error(message);
    }
);

/* ================= AUTH APIs ================= */

// Signup
export async function signup(payload) {
    const response = await api.post("/auth/register", payload);
    return response.data;
}

// Login
export async function login(email, password) {
    const response = await api.post("/auth/login", { email, password });

    const { access_token, refresh_token } = response.data;

    // store tokens
    localStorage.setItem("token", access_token);
    if (refresh_token) {
        localStorage.setItem("refresh_token", refresh_token);
    }

    // minimal user info
    localStorage.setItem("user", JSON.stringify({ email }));

    return response.data;
}

// Logout
export async function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
}

/* ================= USERS ================= */

export async function getUsers() {
    const response = await api.get("/users");
    return response.data;
}

/* ================= FORGOT PASSWORD FLOW ================= */

// 1️⃣ Request OTP
export async function requestOtp(email) {
    const response = await api.post("/auth/request-otp", { email });
    return response.data;
}

// 2️⃣ Verify OTP
export async function verifyOtp(email, otp) {
    const response = await api.post("/auth/verify-otp", { email, otp });
    return response.data;
}

// 3️⃣ Change password
export async function changePassword(email, newPassword) {
    const response = await api.post("/auth/change-password", {
        email,
        password: newPassword,
    });
    return response.data;
}

/* ================= DEFAULT EXPORT (OPTIONAL) ================= */

export default {
    signup,
    login,
    logout,
    getUsers,
    requestOtp,
    verifyOtp,
    changePassword,
};
