// -----------------------------
// File: src/hooks/useAuth.ts
// -----------------------------

import { useState, useEffect, useCallback } from "react";
import api, { User } from "../api/api";

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Try to read user from localStorage (if you store user there) on mount
  useEffect(() => {
    // If your app stores the user object separately, read it here. Otherwise, user is null until login.
    const stored = localStorage.getItem("bragboard_user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.login(email, password);
      setUser(data.user);
      // store user for persistence
      localStorage.setItem("bragboard_user", JSON.stringify(data.user));
      setLoading(false);
      return data.user;
    } catch (err: any) {
      setError(err?.response?.data?.detail || err.message || "Login failed");
      setLoading(false);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    api.logout();
    setUser(null);
    localStorage.removeItem("bragboard_user");
  }, []);

  const setUserManually = useCallback((u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem("bragboard_user", JSON.stringify(u));
    else localStorage.removeItem("bragboard_user");
  }, []);

  return {
    user,
    loading,
    error,
    login,
    logout,
    setUser: setUserManually,
  };
}

