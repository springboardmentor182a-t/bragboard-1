import React from 'react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 px-6 py-3 z-50">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-800">BRAG BOARD</h1>
        </div>

        <div className="flex items-center space-x-8">
          
          {/* Search Bar with Ultra Thin SVG */}
          <div className="relative mr-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg 
                className="w-4 h-4 text-gray-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 text-sm"
            />
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
