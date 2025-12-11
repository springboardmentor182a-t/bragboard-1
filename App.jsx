import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import DashboardLayout from "./layouts/DashboardLayout";

import EmployeeDashboard from "./pages/EmployeeDashboard";
import AdminDashboard from "./pages/AdminDashboard";
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
        <DashboardLayout>
          <Routes>

            {/* Employee Dashboard */}
            <Route
              path="/"
              element={
                <ProtectedRoute role={["employee", "admin"]}>
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin Dashboard */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute role={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Unauthorized Page */}
            <Route path="/unauthorized" element={<NotAuthorized />} />

          </Routes>
        </DashboardLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}
