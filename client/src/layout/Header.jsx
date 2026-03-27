
function Header({ userRole = "admin", userName = "Alex" }) {
  return (
    <header className="bg-white shadow flex items-center justify-between px-6 py-4 mb-6">
      {/* App/Section Title */}
      <div className="text-2xl font-bold text-purple-700">{userRole === "admin" ? "Admin" : "Employee"} Dashboard</div>
      
      {/* Search bar */}
      <div className="flex-1 px-8">
        <input
          type="text"
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-purple-200"
          placeholder="Search employees, departments, shoutouts..."
        />
      </div>
      
      {/* Profile area */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="font-medium">{userName}</div>
          <div className="text-xs text-gray-500 capitalize">{userRole}</div>
        </div>
        {/* Avatar (use initial or image) */}
        <div className="bg-purple-400 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
          {userName[0]}
        </div>
      </div>
    </header>
  );
}
export default Header;
