import { Button } from "../ui/button";
import type { Page } from "../../types";
import {
  Home,
  LayoutDashboard,
  BarChart3,
  Package,
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

const navigation: NavItem[] = [
  { name: "Home", icon: Home, page: "Home" },
  { name: "Dashboard", icon: LayoutDashboard, page: "Dashboard"},
  { name: "Analytics", icon: BarChart3, page: "Analytics" },
  { name: "settings", icon: Settings, page: "settings"},
  { name: "Notifications", icon: Megaphone, page: "notifications"},
  { name: "Component Library", icon: Package, page: "components"},
];

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onCreateShout?: () => void; // <-- new optional prop
}

export function Sidebar({ currentPage, onNavigate, onCreateShout }: SidebarProps) {
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
              {/* {item.hasDropdown && (
                <ChevronDown className={`w-3.5 h-3.5 ml-auto ${isActive ? "text-indigo-400" : "text-gray-400"}`} />
              )} */}
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
            // call the handler if provided; otherwise no-op
            if (onCreateShout) onCreateShout();
          }}
        >
          Create Shout Out
        </Button>
      </div>
    </aside>
  );
}
