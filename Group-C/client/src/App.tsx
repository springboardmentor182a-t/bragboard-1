import { useState } from "react";
import { LoginPage } from "./pages/LoginPage";
import { MainLayout } from "./components/layout/MainLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { HomePage } from "./pages/HomePage";
import { UserProfilePage } from "./pages/UserProfilePage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { ComponentLibrary } from "./pages/ComponentLibrary";
import type { Page } from "./types";

// type Page = 
//   | "login"
//   | "Home"
//   | "Dashboard" 
//   | "Analytics"
//   | "profile"
//   | "notifications"
//   | "settings"
//   | "components";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage("Home");
  };

  if (!isAuthenticated && currentPage === "login") {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <MainLayout currentPage={currentPage} onNavigate={setCurrentPage}>
      {currentPage === "Home" && <HomePage onViewShout={() => setCurrentPage("Dashboard")} />}
      {currentPage === "Dashboard" && <DashboardPage onViewShout={() => setCurrentPage("Analytics")} />}
      {currentPage === "profile" && <UserProfilePage onNavigate={setCurrentPage} />}
      {currentPage === "notifications" && <NotificationsPage />}
      {currentPage === "settings" && <SettingsPage />}
      {currentPage === "Analytics" && <AnalyticsPage />}
      {currentPage === "components" && <ComponentLibrary />}
    </MainLayout>
  );
}
