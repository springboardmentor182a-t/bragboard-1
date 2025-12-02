import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import DashboardLayout from "./layouts/DashboardLayout";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import NotAuthorized from "./pages/NotAuthorized";

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  if (!role.includes(user.role)) {
    return <NotAuthorized />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Layout route */}
          <Route path="/" element={<DashboardLayout />}>

            {/* Employee + Admin Dashboard */}
            <Route
              index
              element={
                <ProtectedRoute role={["employee", "admin"]}>
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            />

            {/* Profile (employee + admin) */}
            <Route
              path="profile"
              element={
                <ProtectedRoute role={["employee", "admin"]}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Settings (employee + admin) */}
            <Route
              path="settings"
              element={
                <ProtectedRoute role={["employee", "admin"]}>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* Reports (admin only) */}
            <Route
              path="reports"
              element={
                <ProtectedRoute role={["admin"]}>
                  <Reports />
                </ProtectedRoute>
              }
            />

            {/* Admin Dashboard */}
            <Route
              path="admin"
              element={
                <ProtectedRoute role={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Not Found */}
            <Route path="*" element={<NotAuthorized />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
<Route
  path="settings"
  element={
    <ProtectedRoute role={["employee", "admin"]}>
      <Settings />
    </ProtectedRoute>
  }
/>


