import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="w-64 bg-white border-r shadow-sm p-4 h-full">
      <h2 className="text-xl font-bold mb-4">Menu</h2>

      <ul className="space-y-3 text-gray-700">
        <li><Link to="/">Dashboard</Link></li>

        {user.role === "employee" && (
          <>
            <li>My Tasks</li>
            <li>My Activity</li>
          </>
        )}

        {user.role === "admin" && (
          <>
            <li><Link to="/admin">Admin Panel</Link></li>
            <li>Reports</li>
          </>
        )}
      </ul>
    </aside>
  );
}
