// /mnt/data/TopBar.tsx
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

interface CurrentUser {
  id?: string | number;
  username?: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  role?: string;
  [k: string]: any;
}

interface TopBarProps {
  onCreateShout: () => void;
  onNavigate: (page: Page) => void;
  currentPage: Page;
  isAdmin?: boolean;
  onLogout?: () => void;
  currentUser?: CurrentUser; // <-- added
}

export function TopBar({
  onCreateShout,
  onNavigate,
  currentPage,
  isAdmin = false,
  onLogout,
  currentUser,
}: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  const displayName = currentUser?.name || currentUser?.username || "User";
  const displayEmail = currentUser?.email || "—";
  const avatarSrc = currentUser?.avatarUrl || currentUser?.avatar || undefined;

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <>
      <header className="fixed top-0 left-56 right-0 h-16 bg-gray-100 backdrop-blur-xl z-10 ">
        <div className="h-full px-8 flex items-center justify-between">
          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-12">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500" />
              <Input
                placeholder="Search anything..."
                className="pl-11 h-11 text-sm bg-gray-50 border-gray-200"
                style={{ borderRadius: "var(--radius-xl)" }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {!isAdmin && (
              <Button
                className="h-10 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 shadow-lg"
                style={{ borderRadius: "var(--radius-xl)" }}
                onClick={onCreateShout}
              >
                Create
              </Button>
            )}

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="relative w-10 h-10 hover:bg-gray-100"
                style={{ borderRadius: "var(--radius-xl)" }}
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
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
              className="w-10 h-10 hover:bg-gray-100"
              style={{ borderRadius: "var(--radius-xl)" }}
            >
              <MessageCircle className="w-5 h-5 text-gray-600" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-0 h-auto">
                  <Avatar className="w-10 h-10 ring-2 ring-gray-200">
                    {avatarSrc ? (
                      <AvatarImage src={avatarSrc} />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                        {getInitials(displayName)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56" style={{ borderRadius: "var(--radius-2xl)" }}>
                <DropdownMenuLabel>
                  <div>
                    <p className="font-medium">{displayName}</p>
                    <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => onNavigate("profile")}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNavigate("settings")}>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNavigate("notifications")}>Notifications</DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => {
                    if (onLogout) onLogout();
                    else onNavigate("login");
                  }}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  );
}

export default TopBar;
