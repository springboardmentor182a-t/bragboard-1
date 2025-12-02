import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

import DashboardLayout from "./layouts/DashboardLayout";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";
<<<<<<< HEAD
=======
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
>>>>>>> 4163705ee011f0c80ed5ef0d729ddd8d233f5fcd
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
<<<<<<< HEAD
        <DashboardLayout>
          <Routes>
            {/* Employee + Admin can see this */}
            <Route
              path="/"
=======
        <Routes>

          {/* Layout route */}
          <Route path="/" element={<DashboardLayout />}>

            {/* Employee + Admin Dashboard */}
            <Route
              index
>>>>>>> 4163705ee011f0c80ed5ef0d729ddd8d233f5fcd
              element={
                <ProtectedRoute role={["employee", "admin"]}>
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            />

<<<<<<< HEAD
            {/* Only Admin */}
            <Route
              path="/admin"
=======
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
>>>>>>> 4163705ee011f0c80ed5ef0d729ddd8d233f5fcd
              element={
                <ProtectedRoute role={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

<<<<<<< HEAD
            <Route path="*" element={<NotAuthorized />} />
          </Routes>
        </DashboardLayout>
=======
            {/* Not Found */}
            <Route path="*" element={<NotAuthorized />} />
          </Route>
        </Routes>
>>>>>>> 4163705ee011f0c80ed5ef0d729ddd8d233f5fcd
      </BrowserRouter>
    </AuthProvider>
  );
}
<<<<<<< HEAD
=======
<Route
  path="settings"
  element={
    <ProtectedRoute role={["employee", "admin"]}>
      <Settings />
    </ProtectedRoute>
  }
/>


>>>>>>> 4163705ee011f0c80ed5ef0d729ddd8d233f5fcd
