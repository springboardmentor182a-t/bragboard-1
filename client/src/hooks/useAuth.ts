// client/src/hooks/useAuth.ts
import { useState, useEffect } from "react";

// Example: get auth info from localStorage or sessionStorage
export const useAuth = () => {
  const [user, setUser] = useState<{ id: number; name: string } | null>(null);

  useEffect(() => {
    // Try to get user info from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData: { id: number; name: string }) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return { user, login, logout };
};
