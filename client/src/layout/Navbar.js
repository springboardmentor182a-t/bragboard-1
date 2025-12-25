<<<<<<< HEAD
// Navbar.jsx
import { FiSearch, FiLogIn } from "react-icons/fi";

function Navbar({ setActiveSection, onLogout }) {
  return (
    <nav className="fixed top-0 left-[256px] right-0 h-[70px] bg-white shadow-md z-50 flex items-center px-6">
      {/* SEARCH BAR */}
      <div className="relative w-[280px]">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full 
                     focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>

      {/* PROFILE DROPDOWN */}
      <div className="ml-auto flex items-center gap-6">
        <div className="relative group">
          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
            className="w-10 h-10 rounded-full border cursor-pointer"
          />

          <div className="hidden group-hover:block absolute right-0 mt-2 w-40 
                          bg-white shadow-lg rounded-md p-2">
            <button
              className="w-full text-left px-3 py-2 hover:bg-gray-100"
              onClick={() => setActiveSection("settings")}
            >
              Settings
            </button>

            <button
              className="w-full flex items-center gap-2 text-left px-3 py-2 
                         hover:bg-gray-100 text-red-600"
              onClick={onLogout}
            >
              <FiLogIn /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
=======
// Navbar.jsx
import { FiSearch, FiLogIn } from "react-icons/fi";

function Navbar({ setActiveSection, onLogout }) {
  return (
    <nav className="fixed top-0 left-[256px] right-0 h-[70px] bg-white shadow-md z-50 flex items-center px-6">
      {/* SEARCH BAR */}
      <div className="relative w-[280px]">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full 
                     focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>

      {/* PROFILE DROPDOWN */}
      <div className="ml-auto flex items-center gap-6">
        <div className="relative group">
          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
            className="w-10 h-10 rounded-full border cursor-pointer"
          />

          <div className="hidden group-hover:block absolute right-0 mt-2 w-40 
                          bg-white shadow-lg rounded-md p-2">
            <button
              className="w-full text-left px-3 py-2 hover:bg-gray-100"
              onClick={() => setActiveSection("settings")}
            >
              Settings
            </button>

            <button
              className="w-full flex items-center gap-2 text-left px-3 py-2 
                         hover:bg-gray-100 text-red-600"
              onClick={onLogout}
            >
              <FiLogIn /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
>>>>>>> 3e2424c214281832d92a15cbeb86496329d2c772
