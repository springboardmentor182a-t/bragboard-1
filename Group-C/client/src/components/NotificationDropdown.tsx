import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface NotificationDropdownProps {
  onClose: () => void;
  onViewAll: () => void;
}

const notifications = [
  {
    id: "1",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    title: "Alex Rodriguez reacted to your shout-out",
    text: "👏 to your message about the Q4 launch",
    time: "5m ago",
    unread: true,
  },
  {
    id: "2",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    title: "Marcus Thompson mentioned you",
    text: "Great collaboration on the new feature!",
    time: "1h ago",
    unread: true,
  },
  {
    id: "3",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    title: "Jessica Williams commented",
    text: "Thanks for the shout-out! 🙌",
    time: "3h ago",
    unread: false,
  },
  {
    id: "4",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    title: "Rachel Kim gave you a shout-out",
    text: "Excellent work on the sustainability initiative",
    time: "1d ago",
    unread: false,
  },
];

export function NotificationDropdown({ onClose, onViewAll }: NotificationDropdownProps) {
  const [activeTab, setActiveTab] = useState("all");

  const filteredNotifications =
    activeTab === "unread"
      ? notifications.filter((n) => n.unread)
      : notifications;

  return (
    <div
      className="absolute right-0 top-12 w-96 bg-white shadow-soft-lg border border-gray-200 z-50"
      style={{ borderRadius: 'var(--radius-xl)' }}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-gray-900">Notifications</h3>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6 pt-2">
          <TabsList className="w-full grid grid-cols-2 bg-gray-100" style={{ borderRadius: 'var(--radius-md)' }}>
            <TabsTrigger value="all" style={{ borderRadius: 'var(--radius-md)' }}>All</TabsTrigger>
            <TabsTrigger value="unread" style={{ borderRadius: 'var(--radius-md)' }}>Unread</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-gray-500">
                No {activeTab === "unread" ? "unread " : ""}notifications
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-6 py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                    notification.unread ? "bg-sky-50/30" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <Avatar className="w-10 h-10 ring-2 ring-gray-100 flex-shrink-0">
                      <AvatarImage src={notification.avatar} />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        {notification.unread && (
                          <span className="w-2 h-2 bg-sky-500 rounded-full flex-shrink-0 mt-1.5"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{notification.text}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-gray-100">
        <Button
          variant="ghost"
          className="w-full text-sky-600 hover:text-sky-700 hover:bg-sky-50"
          style={{ borderRadius: 'var(--radius-md)' }}
          onClick={onViewAll}
        >
          View All Notifications
        </Button>
      </div>
    </div>
  );
}
