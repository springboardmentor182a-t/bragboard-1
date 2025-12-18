// src/components/Sidebar.tsx
import { Button } from "../ui/button";
import type { Page } from "../../types";
import {
  Home,
  LayoutDashboard,
  BarChart3,
  Package,
  User,
  Users,
  Store,
  TrendingUp,
  Megaphone,
  MessageCircle,
  Moon,
  Settings,
  ChevronDown
} from "lucide-react";

type NavItem = {
  name: string;
  icon: any;
  page: Page;
};

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onCreateShout?: () => void;
  isAdmin?: boolean;
}

export function Sidebar({ currentPage, onNavigate, onCreateShout, isAdmin = false }: SidebarProps) {
  // The page keys must match your `Page` union in ../../types
  const findPeopleItem: NavItem = isAdmin
    ? { name: "User Management", icon: Users, page: "userManagement" as Page }
    : { name: "Find People", icon: Users, page: "findpeople" as Page };

  const baseNav: NavItem[] = [
    { name: "Dashboard", icon: LayoutDashboard, page: "Dashboard" as Page },
    { name: "Profile", icon: User, page: "profile" as Page },
    { name: "settings", icon: Settings, page: "settings" as Page },
    findPeopleItem,
    // { name: "Notifications", icon: Megaphone, page: "notifications" },
  ];

  // place admin-only items (Analytics) at top if admin
  const navigation: NavItem[] = isAdmin ? [{ name: "Admin", icon: BarChart3, page: "Analytics" as Page }, ...baseNav] : baseNav;

  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-gray-100 border-r border-gray-100 flex flex-col shadow-sm">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-100">
        <img src="/logo.png" alt="logo" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.page;
          return (
            <Button
              key={item.name}
              variant="ghost"
              className={`w-full justify-start h-10 px-3.5 transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
              style={{ borderRadius: 'var(--radius-lg)' }}
              onClick={() => onNavigate(item.page)}
            >
              <Icon className={`w-4.5 h-4.5 mr-3.5 ${isActive ? "text-indigo-600" : ""}`} />
              <span className={isActive ? "font-medium" : ""}>{item.name}</span>
            </Button>
          );
        })}
      </nav>

      {/* Create Button */}
      <div className="p-4">
        <Button
          className="w-full h-10 px-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40"
          style={{ borderRadius: 'var(--radius-xl)' }}
          onClick={() => {
            if (onCreateShout) onCreateShout();
          }}
        >
          Create Shout Out
        </Button>
      </div>
    </aside>
  );
}
