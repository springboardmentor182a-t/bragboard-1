import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

import {
  HomeIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  UserGroupIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-white h-full border-r shadow-sm p-4">
      <h2 className="text-xl font-bold mb-6 text-blue-600">Menu</h2>

      <ul className="space-y-4 font-medium text-gray-700">
        <li>
          <Link className="flex items-center gap-3 hover:text-blue-600" to="/">
            <HomeIcon className="w-5" /> Dashboard
          </Link>
        </li>

        {user.role === "employee" && (
          <>
            <li className="flex items-center gap-3 hover:text-blue-600">
              <ClipboardDocumentListIcon className="w-5" /> My Tasks
            </li>

            <li className="flex items-center gap-3 hover:text-blue-600">
              <ChartBarIcon className="w-5" /> My Performance
            </li>
          </>
        )}

        {user.role === "admin" && (
          <>
            <li>
              <Link className="flex items-center gap-3 hover:text-blue-600" to="/admin">
                <ShieldCheckIcon className="w-5" /> Admin Panel
              </Link>
            </li>

            <li className="flex items-center gap-3 hover:text-blue-600">
              <UserGroupIcon className="w-5" /> Manage Employees
            </li>
          </>
        )}
      </ul>
    </aside>
  );
}
