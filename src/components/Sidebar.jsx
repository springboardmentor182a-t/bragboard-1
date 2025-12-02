import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

import {
  HomeIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  UserGroupIcon,
<<<<<<< HEAD
  ShieldCheckIcon
=======
  ShieldCheckIcon,
  UserCircleIcon   // <-- NEW
>>>>>>> 4163705ee011f0c80ed5ef0d729ddd8d233f5fcd
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-white h-full border-r shadow-sm p-4">
      <h2 className="text-xl font-bold mb-6 text-blue-600">Menu</h2>

      <ul className="space-y-4 font-medium text-gray-700">
<<<<<<< HEAD
=======
        
        {/* Dashboard */}
>>>>>>> 4163705ee011f0c80ed5ef0d729ddd8d233f5fcd
        <li>
          <Link className="flex items-center gap-3 hover:text-blue-600" to="/">
            <HomeIcon className="w-5" /> Dashboard
          </Link>
        </li>

<<<<<<< HEAD
        {user.role === "employee" && (
          <>
            <li className="flex items-center gap-3 hover:text-blue-600">
              <ClipboardDocumentListIcon className="w-5" /> My Tasks
            </li>

            <li className="flex items-center gap-3 hover:text-blue-600">
              <ChartBarIcon className="w-5" /> My Performance
=======
        {/* Profile — visible for everyone */}
        <li>
          <Link className="flex items-center gap-3 hover:text-blue-600" to="/profile">
            <UserCircleIcon className="w-5" /> Profile
          </Link>
        </li>

        {/* Employee-specific */}
        {user.role === "employee" && (
          <>
            <li>
              <Link className="flex items-center gap-3 hover:text-blue-600" to="#">
                <ClipboardDocumentListIcon className="w-5" /> My Tasks
              </Link>
            </li>

            <li>
              <Link className="flex items-center gap-3 hover:text-blue-600" to="#">
                <ChartBarIcon className="w-5" /> My Performance
              </Link>
>>>>>>> 4163705ee011f0c80ed5ef0d729ddd8d233f5fcd
            </li>
          </>
        )}

<<<<<<< HEAD
=======
        {/* Admin-specific */}
>>>>>>> 4163705ee011f0c80ed5ef0d729ddd8d233f5fcd
        {user.role === "admin" && (
          <>
            <li>
              <Link className="flex items-center gap-3 hover:text-blue-600" to="/admin">
                <ShieldCheckIcon className="w-5" /> Admin Panel
              </Link>
            </li>

<<<<<<< HEAD
            <li className="flex items-center gap-3 hover:text-blue-600">
              <UserGroupIcon className="w-5" /> Manage Employees
=======
            <li>
              <Link className="flex items-center gap-3 hover:text-blue-600" to="#">
                <UserGroupIcon className="w-5" /> Manage Employees
              </Link>
>>>>>>> 4163705ee011f0c80ed5ef0d729ddd8d233f5fcd
            </li>
          </>
        )}
      </ul>
<<<<<<< HEAD
=======
      <li>
  <Link to="/settings" className="flex items-center gap-3 hover:text-blue-600">
    ⚙️ <span>Settings</span>
  </Link>
</li>

>>>>>>> 4163705ee011f0c80ed5ef0d729ddd8d233f5fcd
    </aside>
  );
}
