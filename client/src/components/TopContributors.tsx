import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card } from "./ui/card";
import { Trophy } from "lucide-react";

const contributors = [
  {
    name: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    shouts: 42,
  },
  {
    name: "Jessica Williams",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    shouts: 38,
  },
  {
    name: "Alex Rodriguez",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    shouts: 35,
  },
  {
    name: "Marcus Thompson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    shouts: 31,
  },
  {
    name: "Rachel Kim",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    shouts: 28,
  },
];

export function TopContributors() {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="p-3 shadow-soft-lg border border-gray-200 bg-white" style={{ borderRadius: 'var(--radius-2xl)' }}>
      <div className="flex items-center gap-2 mb-0">
        <Trophy className="w-4 h-4 text-yellow-600" />
        <h3 className="text-gray-900">Top Contributors</h3>
      </div>
      <div className="space-y-2">
        {contributors.map((contributor, index) => (
          <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-all group cursor-pointer">
            <div className="flex items-center justify-center w-5 text-sm font-semibold text-gray-400">
              {index + 1}
            </div>
            <Avatar className="w-8 h-8 ring-2 ring-gray-100">
              <AvatarImage src={contributor.avatar} alt={contributor.name} />
              <AvatarFallback>{getInitials(contributor.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{contributor.name}</p>
              <p className="text-xs text-gray-500">{contributor.shouts} shouts</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}