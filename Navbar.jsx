import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="w-full bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold">Employee Dashboard</h1>

      <ul className="flex gap-6 text-white/90">
        <li>Home</li>
        <li>Profile</li>
        {user.role === "admin" && <li>Admin</li>}
      </ul>

      <span className="font-semibold">{user.name}</span>
    </nav>
  );
}
