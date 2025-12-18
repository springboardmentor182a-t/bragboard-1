const Sidebar = () => {
  return (
    <aside className="fixed top-16 left-0 w-64 h-full bg-gray-800 text-white">
      <ul className="p-4 space-y-4">
        <li>Dashboard</li>
        <li>Analytics</li>
        <li>Reports</li>
        <li>Shoutouts</li>
        <li>Settings</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
