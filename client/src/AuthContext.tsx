import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

export type AuthContextType = {
  isAuthenticated: boolean;
  userRole: "admin" | "employee" | null;
  userData: { id: number; name: string; email: string } | null;
  loading: boolean;
  login: (
    role: "admin" | "employee",
    userData: { id: number; name: string; email: string } // ✅ fixed
  ) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<"admin" | "employee" | null>(null);

  // ✅ fixed: added id
  const [userData, setUserData] = useState<{
    id: number;
    name: string;
    email: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedAuth = localStorage.getItem("auth");
    if (savedAuth) {
      const parsed = JSON.parse(savedAuth);
      setIsAuthenticated(parsed.isAuthenticated);
      setUserRole(parsed.userRole);
      setUserData(parsed.userData);
    }
    setLoading(false);
  }, []);

  const login = (
    role: "admin" | "employee",
    userData: { id: number; name: string; email: string }
  ) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setUserData(userData);

    // optional but safe (keeps login on refresh)
    localStorage.setItem(
      "auth",
      JSON.stringify({
        isAuthenticated: true,
        userRole: role,
        userData,
      })
    );
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setUserData(null);
    localStorage.removeItem("auth");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        userData,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
