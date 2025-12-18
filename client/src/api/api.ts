// client/src/api/api.ts
// Axios-based API wrapper used by the app (login, posts, reactions, comments, notifications, admin)
// - Defaults baseURL to VITE_API_BASE_URL or http://localhost:8000
// - Persists token in localStorage as 'token' and attaches Authorization header automatically

import axios, { AxiosInstance, AxiosResponse } from "axios";

const DEFAULT_BASE = "http://localhost:8000"; // FastAPI default in this project
const BASE = (import.meta as any).env?.VITE_API_BASE_URL ?? DEFAULT_BASE;

const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// helper to unwrap AxiosResponse.data
function unwrap<T>(r: AxiosResponse<T>) {
  return r.data;
}

// token helpers
function getAccessToken(): string | null {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
}

function setAccessToken(token: string | null) {
  try {
    if (token) {
      localStorage.setItem("token", token);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      delete axiosInstance.defaults.headers.common["Authorization"];
    }
  } catch {
    // ignore
  }
}

// initialize header from storage
const initialToken = getAccessToken();
if (initialToken) {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${initialToken}`;
}

// Optional: intercept responses to automatically clear token on 401 (simple)
axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      // do not auto-clear if you want to keep token — but helpfully clear to force re-login
      setAccessToken(null);
    }
    return Promise.reject(err);
  }
);

/* -----------------------------
   Types (partial, only what's needed)
   ----------------------------- */
export interface AuthResponse {
  access_token?: string;
  token?: string;
  user?: any;
}

/* -----------------------------
   Auth
   ----------------------------- */
export async function login(email: string, password: string): Promise<AuthResponse> {
  // try the canonical endpoint first (/auth/login) then fall back to common others if needed
  const candidates = ["/auth/login", "/login", "/token"];
  let lastErr: any = null;
  for (const path of candidates) {
    try {
      const res = await axiosInstance.post<AuthResponse>(path, { email, password });
      const data = unwrap(res);
      // standard places: access_token, token, data.token
      const token = ((data as any)?.access_token ?? (data as any)?.token ?? (data as any)?.data?.token) ?? null;
      if (token) setAccessToken(token);
      return data;
    } catch (err) {
      lastErr = err;
      // try next endpoint
    }
  }
  throw lastErr ?? new Error("Login failed");
}

export function logout() {
  setAccessToken(null);
  // optional attempt to call backend logout
  (async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch {
      // ignore
    }
  })();
}

export function setTokenForApp(token: string | null) {
  setAccessToken(token);
}

/* -----------------------------
   Users (admin)
   ----------------------------- */
export async function getUsers(params?: { page?: number; limit?: number; search?: string }) {
  const res = await axiosInstance.get<{ users: any[]; total?: number }>("/users", { params });
  return unwrap(res);
}
export async function createUser(payload: any) {
  const res = await axiosInstance.post("/users", payload);
  return unwrap(res);
}
export async function updateUser(id: number, payload: any) {
  const res = await axiosInstance.put(`/users/${id}`, payload);
  return unwrap(res);
}
export async function deleteUser(id: number) {
  const res = await axiosInstance.delete(`/users/${id}`);
  return unwrap(res);
}
export async function suspendUser(id: number) {
  const res = await axiosInstance.post(`/users/${id}/suspend`);
  return unwrap(res);
}

/* -----------------------------
   Posts
   ----------------------------- */
export type Post = any;

export async function getPosts(params?: { page?: number; limit?: number; department?: string }) {
  const res = await axiosInstance.get<{ posts: Post[]; total?: number }>("/posts", { params });
  return unwrap(res);
}

export async function getPost(id: number) {
  const res = await axiosInstance.get<Post>(`/posts/${id}`);
  return unwrap(res);
}

export async function createPost(payload: { description: string; image_url?: string | null; recipients?: number[]; tags?: string[] }) {
  const res = await axiosInstance.post<Post>("/posts", payload);
  return unwrap(res);
}

export async function deletePost(id: number | string) {
  const res = await axiosInstance.delete(`/posts/${id}`);
  return unwrap(res);
}

/* -----------------------------
   Reactions
   ----------------------------- */
export async function reactToPost(post_id: number, reaction_type: string) {
  // some backends use /reactions, some use /posts/:id/reactions — support /reactions with body
  try {
    const res = await axiosInstance.post("/reactions", { post_id, reaction_type });
    return unwrap(res);
  } catch {
    // fallback
    const res = await axiosInstance.post(`/posts/${post_id}/reactions`, { reaction_type });
    return unwrap(res);
  }
}

/* -----------------------------
   Comments
   ----------------------------- */
export async function getComments(post_id: number, params?: { page?: number; limit?: number }) {
  const res = await axiosInstance.get<{ comments: any[] }>(`/posts/${post_id}/comments`, { params });
  return unwrap(res);
}
export async function createComment(post_id: number, text: string) {
  const res = await axiosInstance.post("/comments", { post_id, text });
  return unwrap(res);
}

/* -----------------------------
   Notifications
   ----------------------------- */
export async function getNotifications() {
  const res = await axiosInstance.get("/notifications");
  return unwrap(res);
}
export async function getUnreadNotificationCount() {
  const res = await axiosInstance.get("/notifications/unread-count");
  return unwrap(res);
}
export async function markNotificationRead(id: number) {
  const res = await axiosInstance.post(`/notifications/${id}/mark-read`);
  return unwrap(res);
}
export async function markAllNotificationsRead() {
  const res = await axiosInstance.post("/notifications/mark-all-read");
  return unwrap(res);
}

/* -----------------------------
   Analytics (admin) & Upload
   ----------------------------- */
export async function getTopContributors() {
  const res = await axiosInstance.get("/analytics/top-contributors");
  return unwrap(res);
}
export async function getReactionStats() {
  const res = await axiosInstance.get("/analytics/reaction-stats");
  return unwrap(res);
}

export async function uploadImage(file: File) {
  const form = new FormData();
  form.append("file", file);
  const res = await axiosInstance.post<{ url: string }>("/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return unwrap(res);
}

/* -----------------------------
   Reports
   ----------------------------- */
export async function reportShout({ shoutId, reason }: { shoutId: number | string; reason: string }) {
  const res = await axiosInstance.post(`/posts/${shoutId}/report`, { reason });
  return unwrap(res);
}

/* -----------------------------
   Default export (legacy)
   ----------------------------- */
const api = {
  // auth
  login,
  logout,
  setTokenForApp,
  // users
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  suspendUser,
  // posts
  getPosts,
  getPost,
  createPost,
  deletePost,
  // reactions
  reactToPost,
  // comments
  getComments,
  createComment,
  // notifications
  getNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
  // analytics
  getTopContributors,
  getReactionStats,
  // upload
  uploadImage,
  // reports
  reportShout,
};

export default api;
