import React from 'react';
import { useAuth } from '../../Context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <nav className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-20 transition-colors duration-200">
      <div className="px-6 mx-auto h-full">
        <div className="flex items-center justify-between h-full">
          {/* Left side (Search) */}
          <div className="flex-1 flex justify-center md:justify-end pr-8">
            <div className="relative w-full max-w-md hidden md:block">
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-gray-700 dark:text-white transition-colors"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right side (User Profile & Logout) */}
          <div className="flex items-center space-x-4">

            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-sm font-bold text-gray-800 dark:text-white leading-tight">{user?.name || 'User'}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{user?.department?.toLowerCase() || 'employee'}</span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold shadow-md border-2 border-white dark:border-gray-600 ring-2 ring-blue-100 dark:ring-blue-900">
                {getInitials(user?.name)}
              </div>
            </div>

          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
