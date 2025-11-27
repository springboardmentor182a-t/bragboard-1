import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center shadow">
      <h1 className="text-2xl font-bold tracking-wide">BragBoard | Employee Dashboard</h1>

      <div className="flex items-center gap-6">
        <span className="font-semibold">{user.name}</span>
        <span className="text-white/80 text-sm bg-white/20 px-3 py-1 rounded-full">
          {user.role.toUpperCase()}
        </span>
      </div>
    </nav>
  );
}
