import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);

  const login = (token) => setAccessToken(token);
  const logout = () => {
    setAccessToken(null);
    // optional: notify backend to revoke server-side refresh token
    try {
      fetch((process.env.REACT_APP_API_BASE || "http://localhost:8000") + "/api/auth/logout", {
        method: "POST",
        credentials: "include"
      }).catch(() => {});
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ accessToken, login, logout, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
