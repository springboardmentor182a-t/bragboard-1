// client/src/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

export type AuthContextType = {
  isAuthenticated: boolean;
  userRole: "admin" | "employee" | null;
  userData: { name: string; email: string } | null;
  login: (role: "admin" | "employee", userData: { name: string; email: string }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<"admin" | "employee" | null>(null);
  const [userData, setUserData] = useState<{ name: string; email: string } | null>(null);

  const login = (role: "admin" | "employee", userData: { name: string; email: string }) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setUserData(userData);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserData(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
