import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-800">BRAG BOARD</h1>
        </div>

        <div className="flex items-center space-x-8">
          {/* Search Bar */}
          <div className="relative mr-4">
            <input
              type="text"
              placeholder="Search"
              className="pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 text-sm bg-white"
            />
            {/* Search Symbol - Using filled icon for better visibility */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="font-semibold text-gray-800 text-sm">Jane doe</p>
              <p className="text-xs text-gray-600">software engineering</p>
            </div>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">JD</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
