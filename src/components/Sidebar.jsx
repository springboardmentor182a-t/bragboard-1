import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

import {
  HomeIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  UserCircleIcon   // <-- NEW
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-white h-full border-r shadow-sm p-4">
      <h2 className="text-xl font-bold mb-6 text-blue-600">Menu</h2>

      <ul className="space-y-4 font-medium text-gray-700">
        
        {/* Dashboard */}
        <li>
          <Link className="flex items-center gap-3 hover:text-blue-600" to="/">
            <HomeIcon className="w-5" /> Dashboard
          </Link>
        </li>

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
            </li>
          </>
        )}

        {/* Admin-specific */}
        {user.role === "admin" && (
          <>
            <li>
              <Link className="flex items-center gap-3 hover:text-blue-600" to="/admin">
                <ShieldCheckIcon className="w-5" /> Admin Panel
              </Link>
            </li>

            <li>
              <Link className="flex items-center gap-3 hover:text-blue-600" to="#">
                <UserGroupIcon className="w-5" /> Manage Employees
              </Link>
            </li>
          </>
        )}
      </ul>
      <li>
  <Link to="/settings" className="flex items-center gap-3 hover:text-blue-600">
    ⚙️ <span>Settings</span>
  </Link>
</li>

    </aside>
  );
}
