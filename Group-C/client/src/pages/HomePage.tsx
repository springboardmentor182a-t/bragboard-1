import { ShoutCard } from "../components/ShoutCard";
import { FindPeople } from "../components/FindPeople";
import { CommentsWidget } from "../components/CommentsWidget";
import { useState } from "react";

const mockShouts = [
  {
    id: "1",
    sender: {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    },
    recipients: ["Marketing Team", "Design Team"],
    message: "Amazing work on the Q4 campaign launch! The new design system is looking incredible and the user feedback has been overwhelmingly positive. Let's keep this momentum going! 🚀",
    timestamp: "2 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1739298061766-e2751d92e9db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    reactions: {
      clap: 12,
      star: 8,
      heart: 15,
      comment: 5,
    },
  },
  {
    id: "2",
    sender: {
      name: "Alex Rodriguez",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    },
    recipients: ["Engineering"],
    message: "Huge shoutout to the backend team for resolving the performance issues so quickly. Response times are down 40%! 💪",
    timestamp: "4 hours ago",
    reactions: {
      clap: 18,
      star: 10,
      heart: 7,
      comment: 3,
    },
  },
  {
    id: "3",
    sender: {
      name: "Jessica Williams",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    },
    recipients: ["Sales Team", "Customer Success"],
    message: "Just closed our biggest deal of the quarter! Thank you to everyone who supported this 6-month journey. Couldn't have done it without the amazing demos and customer support.",
    timestamp: "6 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1642406415849-a410b5d01a94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    reactions: {
      clap: 25,
      star: 14,
      heart: 20,
      comment: 8,
    },
  },
  {
    id: "4",
    sender: {
      name: "Marcus Thompson",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    },
    recipients: ["Product Team"],
    message: "Love the new feature roadmap! The customer-centric approach is exactly what we need. Looking forward to seeing these roll out.",
    timestamp: "8 hours ago",
    reactions: {
      clap: 9,
      star: 6,
      heart: 11,
      comment: 2,
    },
  },
  {
    id: "5",
    sender: {
      name: "Rachel Kim",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    },
    recipients: ["All Hands", "Leadership"],
    message: "Excited to announce our new sustainability initiative! We're committed to carbon neutrality by 2026. More details coming in next week's all-hands meeting.",
    timestamp: "1 day ago",
    imageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    reactions: {
      clap: 32,
      star: 18,
      heart: 28,
      comment: 12,
    },
  },
];

interface HomePageProps {
  onViewShout: () => void;
}

type Comment = {
  id: string;
  author: string;
  text: string;
  time?: string;
};

export function HomePage({ onViewShout }: HomePageProps) {
  // local comments map keyed by shout id
  const [commentsMap, setCommentsMap] = useState<Record<string, Comment[]>>({
    "1": [
      { id: "1-c1", author: "Mike Johnson", text: "Thanks Sarah! The team really pulled together on this one.", time: "2h" },
    ],
    "2": [{ id: "2-c1", author: "Emily Davis", text: "Great teamwork everyone!", time: "4h" }],
  });

  const addComment = (shoutId: string, author: string, text: string) => {
    const newComment: Comment = {
      id: `${shoutId}-c-${Date.now()}`,
      author,
      text,
      time: "now",
    };
    setCommentsMap((prev) => {
      const existing = prev[shoutId] ?? [];
      return { ...prev, [shoutId]: [...existing, newComment] };
    });
  };

  return (
    <div className="space-y-4" >
      {/* Overview Section */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-900">Home</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2" >
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-2" >
          {mockShouts.map((shout) => (
            <ShoutCard
              key={shout.id}
              shout={shout}
              onViewMore={onViewShout}
              comments={commentsMap[shout.id] ?? []}
              onAddComment={(author, text) => addComment(shout.id, author, text)}
            />
          ))}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-2">
          <FindPeople />
          {/* keep CommentsWidget in sidebar as before, but you can pass aggregated comments if desired */}
          <CommentsWidget />
        </div>
      </div>
    </div>  
  );
}
