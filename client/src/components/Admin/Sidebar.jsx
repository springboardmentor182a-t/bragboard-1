function Sidebar({ activeSection, setActiveSection }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'shoutouts', label: 'ShoutOuts' },
    { id: 'departments', label: 'Departments' },
    { id: 'employees', label: 'Employees' },
    { id: 'leaderboard', label: 'Leaderboard' }
  ];

  return (
    <aside className="bg-violet-600 text-white h-screen w-64 p-4 flex flex-col">
      <div className="mb-8 font-bold text-xl">BRAG BOARD</div>
      <nav className="flex flex-col gap-2">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`text-left px-2 py-2 rounded ${activeSection === item.id ? 'bg-violet-700 font-bold' : 'hover:bg-violet-500'}`}
            onClick={() => setActiveSection(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
export default Sidebar;
