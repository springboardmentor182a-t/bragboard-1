import { useState } from "react";
import type { Page } from "../../types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Bell, Search, MessageCircle } from "lucide-react";
import { NotificationDropdown } from "../NotificationDropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface TopBarProps {
  onCreateShout: () => void;
  onNavigate: (page: Page) => void;
  currentPage: Page;
}

export function TopBar({ onCreateShout, onNavigate, currentPage }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="fixed top-0 left-56 right-0 h-16 bg-gray-100 backdrop-blur-xl z-10 ">
      <div className="h-full px-8 flex items-center justify-between">

        {/* Search Bar */}
        <div className="flex-1 max-w-lg mx-12">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <Input
              placeholder="Search anything..."
              className="pl-11 h-11 text-sm bg-gray-50 border-gray-200 focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 transition-all"
              style={{ borderRadius: 'var(--radius-xl)' }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button
            className="h-10 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40"
            style={{ borderRadius: 'var(--radius-xl)' }}
            onClick={onCreateShout}
          >
            Create
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative w-10 h-10 hover:bg-gray-100 transition-all"
              style={{ borderRadius: 'var(--radius-xl)' }}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full ring-2 ring-white"></span>
            </Button>
            {showNotifications && (
              <NotificationDropdown
                onClose={() => setShowNotifications(false)}
                onViewAll={() => {
                  setShowNotifications(false);
                  onNavigate("notifications");
                }}
              />
            )}
          </div>

          {/* Messages */}
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 hover:bg-gray-100 transition-all"
            style={{ borderRadius: 'var(--radius-xl)' }}
          >
            <MessageCircle className="w-5 h-5 text-gray-600" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-0 h-auto hover:opacity-90 transition-all bg-transparent border-0 cursor-pointer group">
                <Avatar className="w-10 h-10 ring-2 ring-gray-200 group-hover:ring-indigo-300 transition-all">
                  <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">SC</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56" style={{ borderRadius: 'var(--radius-2xl)' }}>
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">Sarah Chen</p>
                  <p className="text-xs text-gray-500">sarah@company.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onNavigate("profile")}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate("settings")}>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate("notifications")}>Notifications</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}