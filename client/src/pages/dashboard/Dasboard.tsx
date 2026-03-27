// src/pages/dashboard/Dashboard.tsx
import { Button } from '../../components/ui/button.tsx';

interface DashboardProps {
  userRole: 'admin' | 'employee';
  userData: { name: string; email: string };
  onLogout: () => void;
}

export function Dashboard({ userRole, userData, onLogout }: DashboardProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome, {userData.name}!</h1>
      <p className="mb-6 text-gray-700">Role: {userRole.toUpperCase()}</p>
      <Button onClick={onLogout} className="bg-red-500 hover:bg-red-600">
        Logout
      </Button>
    </div>
  );
}