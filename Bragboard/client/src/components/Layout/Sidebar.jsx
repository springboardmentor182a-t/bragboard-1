import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

const navigation = [
  { name: 'DASHBOARD', href: '/dashboard', emoji: '🏠' },
  { name: 'SHOUT-OUTS', href: '/shoutouts', emoji: '📣' },
  { name: 'REPORTS', href: '/reports', emoji: '📊' },
  { name: 'EXPORT REPORT', href: '/admin/export-report', adminOnly: true, emoji: '📥' },
  { name: 'ANALYTICS', href: '/analytics', emoji: '📈' },
  { name: 'USER MANAGEMENT', href: '/admin/users', adminOnly: true, emoji: '👥' },
  { name: 'SETTINGS', href: '/settings', emoji: '⚙️' },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { isAdmin, logout } = useAuth();
  const location = useLocation();

  const filteredNavigation = navigation.filter(item => !item.adminOnly || isAdmin());

  return (
    <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-[#6366f1] to-[#8b5cf6] transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col border-r border-indigo-500/30 shadow-2xl`}>

      {/* Header */}
      <div className="flex items-center justify-center h-24 px-6 shrink-0 bg-white/5 backdrop-blur-md border-b border-indigo-400/20">
        <h1 className="text-3xl font-black italic tracking-widest bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400 bg-clip-text text-transparent filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
          BRAG BOARD
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-3 overflow-y-auto pb-6 pt-6">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={`relative w-full flex items-center px-4 py-3 text-sm font-bold uppercase tracking-wider rounded-xl transition-all duration-200 
                ${isActive
                  ? 'bg-white text-indigo-600 shadow-[0_0_20px_rgba(255,255,255,0.3)] transform scale-105 ring-2 ring-white/50'
                  : 'text-indigo-100 hover:bg-white/10 hover:text-white hover:shadow-lg hover:shadow-purple-500/20'
                }`}
            >
              <span className="mr-3 text-xl">{item.emoji}</span>
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Sign Out Button in Sidebar - Pushed to bottom */}
      <div className="p-4 border-t border-indigo-400/20 mt-auto bg-black/5 backdrop-blur-sm">
        <button
          onClick={logout}
          className="relative w-full flex items-center justify-center px-4 py-3 text-sm font-bold uppercase tracking-wider rounded-xl transition-all duration-200 
            bg-indigo-600/30 border border-indigo-400/30 text-white hover:bg-red-500/80 hover:border-red-400 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] hover:-translate-y-1"
        >
          <span className="mr-3 text-lg">👋</span>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
