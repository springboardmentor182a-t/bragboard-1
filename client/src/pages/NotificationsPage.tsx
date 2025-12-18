import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Card } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Check } from "lucide-react";

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
  {
    id: "5",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    title: "Alex Rodriguez started following you",
    text: "Now following your shout-outs",
    time: "2d ago",
    unread: false,
  },
  {
    id: "6",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    title: "You earned a new badge!",
    text: "🏆 Top Contributor - You're in the top 10% this month",
    time: "3d ago",
    unread: false,
  },
  {
    id: "7",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    title: "Jessica Williams reacted",
    text: "⭐ starred your shout-out about the Q3 results",
    time: "4d ago",
    unread: false,
  },
  {
    id: "8",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    title: "Rachel Kim mentioned you",
    text: "Thanks for the support on the team meeting!",
    time: "5d ago",
    unread: false,
  },
];

export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [notificationList, setNotificationList] = useState(notifications);

  const filteredNotifications =
    activeTab === "unread"
      ? notificationList.filter((n) => n.unread)
      : notificationList;

  const markAllAsRead = () => {
    setNotificationList(notificationList.map((n) => ({ ...n, unread: false })));
  };

  const unreadCount = notificationList.filter((n) => n.unread).length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-gray-900 mb-1">Notifications</h1>
          <p className="text-gray-600">
            {unreadCount > 0 ? `You have ${unreadCount} unread notifications` : "You're all caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            className="border-gray-200"
            style={{ borderRadius: 'var(--radius-md)' }}
            onClick={markAllAsRead}
          >
            <Check className="w-4 h-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      <Card className="shadow-soft-lg border border-gray-200 bg-white" style={{ borderRadius: 'var(--radius-xl)' }}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="px-6 pt-6 border-b border-gray-100">
            <TabsList className="bg-gray-100" style={{ borderRadius: 'var(--radius-md)' }}>
              <TabsTrigger value="all" style={{ borderRadius: 'var(--radius-md)' }}>
                All
              </TabsTrigger>
              <TabsTrigger value="unread" style={{ borderRadius: 'var(--radius-md)' }}>
                Unread {unreadCount > 0 && `(${unreadCount})`}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-0">
            {filteredNotifications.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Check className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-gray-900 mb-2">All caught up!</h3>
                <p className="text-gray-600">
                  {activeTab === "unread"
                    ? "You have no unread notifications"
                    : "You have no notifications"}
                </p>
              </div>
            ) : (
              <div>
                {filteredNotifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    className={`px-6 py-5 hover:bg-gray-50 cursor-pointer transition-colors ${
                      notification.unread ? "bg-sky-50/30" : ""
                    } ${index !== filteredNotifications.length - 1 ? "border-b border-gray-100" : ""}`}
                  >
                    <div className="flex gap-4">
                      <Avatar className="w-12 h-12 ring-2 ring-gray-100 flex-shrink-0">
                        <AvatarImage src={notification.avatar} />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <p className="font-semibold text-gray-900">
                            {notification.title}
                          </p>
                          {notification.unread && (
                            <span className="w-2.5 h-2.5 bg-sky-500 rounded-full flex-shrink-0 mt-1.5"></span>
                          )}
                        </div>
                        <p className="text-gray-700 mb-2">{notification.text}</p>
                        <p className="text-sm text-gray-500">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
