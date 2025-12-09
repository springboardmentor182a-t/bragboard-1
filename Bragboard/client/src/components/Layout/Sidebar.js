import React from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'DASHBOARD' },
    { id: 'shoutouts', label: 'SHOUT-OUTS' },
    { id: 'analytics', label: 'ANALYTICS' },  // Changed from 'reports' to 'analytics'
    { id: 'settings', label: 'SETTINGS' },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 pt-12">
      <div className="p-4">
        <h2 className="text-md font-semibold mb-4 text-gray-300">BRAG BOARD</h2>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-4 py-3 rounded transition-colors text-sm font-medium ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;