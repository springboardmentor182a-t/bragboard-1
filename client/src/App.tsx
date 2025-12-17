// src/App.tsx
import { useEffect, useState } from "react";
import { LoginPage } from "./pages/LoginPage";
import { MainLayout } from "./components/layout/MainLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { UserProfilePage } from "./pages/UserProfilePage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { FindPeoplePage } from "./pages/FindPeoplePage";
import { UserManagementPage } from "./pages/UserManagementPage";
import type { Page } from "./types";

/**
 * Enhanced App:
 * - persists token & user role
 * - restores auth on reload
 * - exposes handleLogin(role, token, user) and handleLogout()
 * - protects admin pages
 */

type AuthUser = {
  id?: number | string;
  username?: string;
  name?: string;
  email?: string;
  avatar?: string;      // common backend field name
  avatar_url?: string;  // alternate backend field name
  role?: string;
  [k: string]: any;
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // store selected user so profile page can render the correct person
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // helper checks
  const isAdmin = Boolean(user?.role && user.role.toLowerCase() === "admin");
  const isModerator = Boolean(user?.role && user.role.toLowerCase() === "moderator");

  // Restore auth from storage (run once)
  useEffect(() => {
    // prefer localStorage, fallback to sessionStorage
    const storedToken = localStorage.getItem("bragboard_token") || sessionStorage.getItem("bragboard_token");
    const storedUserJson = localStorage.getItem("bragboard_user") || sessionStorage.getItem("bragboard_user");

    if (storedToken && storedUserJson) {
      try {
        const parsed: AuthUser = JSON.parse(storedUserJson);
        setToken(storedToken);
        setUser(parsed);
        setIsAuthenticated(true);

        // choose default landing for role
        const role = (parsed?.role || "").toLowerCase();
        if (role === "admin") setCurrentPage("Analytics");
        else setCurrentPage("Dashboard");
      } catch (err) {
        // corrupted stored user — clear it
        console.warn("Failed to parse stored user:", err);
        localStorage.removeItem("bragboard_token");
        localStorage.removeItem("bragboard_user");
        sessionStorage.removeItem("bragboard_token");
        sessionStorage.removeItem("bragboard_user");
      }
    }
  }, []);

  /**
   * handleLogin - called by LoginPage after successful backend auth
   * @param payload - object returned by backend; may contain access_token and user
   * @param remember - whether to persist in localStorage (true) or sessionStorage (false)
   */
  const handleLogin = (payload: { access_token?: string; token?: string; user?: AuthUser } | { role?: string }, remember = true) => {
    // flexible parsing for token key names
    const tokenValue = (payload as any).access_token || (payload as any).token || null;
    const userObj = (payload as any).user || null;

    // if LoginPage is calling handleLogin with just role (older pattern), handle that too
    if (!tokenValue && !userObj && (payload as any).role) {
      // fallback — set user based on role only (useful for dev)
      const role = (payload as any).role as string;
      const minimalUser: AuthUser = { role };
      setUser(minimalUser);
      setToken(null);
      setIsAuthenticated(true);
      if (role === "admin") setCurrentPage("Analytics");
      else setCurrentPage("Dashboard");
      return;
    }

    // set state
    if (tokenValue) setToken(tokenValue);
    if (userObj) setUser(userObj);
    setIsAuthenticated(true);

    // persist in storage
    try {
      if (remember) {
        if (tokenValue) localStorage.setItem("bragboard_token", tokenValue);
        if (userObj) localStorage.setItem("bragboard_user", JSON.stringify(userObj));
      } else {
        if (tokenValue) sessionStorage.setItem("bragboard_token", tokenValue);
        if (userObj) sessionStorage.setItem("bragboard_user", JSON.stringify(userObj));
      }
    } catch (err) {
      console.warn("Storage failed:", err);
    }

    // redirect based on role
    const roleFromUser = (userObj?.role || "").toLowerCase();
    if (roleFromUser === "admin") setCurrentPage("Analytics");
    else setCurrentPage("Dashboard");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    setCurrentPage("login");
    setSelectedUserId(null);

    // clear both storages
    try {
      localStorage.removeItem("bragboard_token");
      localStorage.removeItem("bragboard_user");
      sessionStorage.removeItem("bragboard_token");
      sessionStorage.removeItem("bragboard_user");
    } catch (err) {
      console.warn("Failed clearing storage:", err);
    }
  };

  // called by FindPeoplePage when user clicks View
  const handleViewProfile = (userId?: string) => {
    if (userId) setSelectedUserId(userId);
    setCurrentPage("profile");
  };

  // If not authenticated, show login page.
  // Pass a wrapper to LoginPage so it can call our handleLogin with full payload.
  if (!isAuthenticated && currentPage === "login") {
    // We expect LoginPage to call onLogin with either:
    // 1) an object like { access_token, user } OR
    // 2) a (role: "admin" | "user") (legacy)
    return (
      <LoginPage
        // @ts-ignore - keep flexible typing between pages
        onLogin={(payload: any, remember: boolean = true) => {
          // If LoginPage already posts to backend and returns the server response,
          // pass it directly and persist token/user. Use the remember flag from LoginPage.
          if (payload?.access_token || payload?.token) {
            handleLogin(payload, remember);
            return;
          }

          // if older LoginPage simply passes role string, handle that
          if (typeof payload === "string") {
            handleLogin({ role: payload }, remember);
            return;
          }

          // if LoginPage returns role property
          if (payload?.role) {
            handleLogin({ role: payload.role }, remember);
            return;
          }

          // fallback: assume payload is { token, user }
          handleLogin(payload, remember);
        }}
      />
    );
  }

  return (
    <MainLayout
      currentPage={currentPage}
      onNavigate={(p: Page) => setCurrentPage(p)}
      isAdmin={isAdmin}
      onLogout={handleLogout}
      currentUser={user ?? undefined}   // <-- this is the key prop wired to TopBar/MainLayout
    >
      {currentPage === "Dashboard" && (
        <DashboardPage
          onViewShout={() => setCurrentPage("Analytics")}
          onViewFindPeople={() => setCurrentPage("findpeople")}
        />
      )}

      {currentPage === "findpeople" && (
        <FindPeoplePage onViewProfile={handleViewProfile} onBack={() => setCurrentPage("Dashboard")} />
      )}

      {currentPage === "profile" && (
        <UserProfilePage userId={selectedUserId} onNavigate={(p) => setCurrentPage(p)} />
      )}

      {currentPage === "notifications" && <NotificationsPage />}

      {currentPage === "userManagement" && isAdmin && <UserManagementPage />}

      {currentPage === "settings" && <SettingsPage />}

      {currentPage === "Analytics" && isAdmin && <AnalyticsPage />}

      {/* If user navigates to an admin-only page but isn't admin, show a fallback or redirect */}
      {currentPage === "userManagement" && !isAdmin && (
        <div className="p-6 text-center text-sm text-red-600">You do not have permission to view this page.</div>
      )}
      {currentPage === "Analytics" && !isAdmin && (
        <div className="p-6 text-center text-sm text-red-600">You do not have permission to view Analytics.</div>
      )}
    </MainLayout>
  );
}
