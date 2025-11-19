import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { CommentsWidget } from "./CommentsWidget";

interface Shout {
  id: string;
  sender: {
    name: string;
    avatar: string;
  };
  recipients: string[];
  message: string;
  timestamp: string;
  imageUrl?: string;
  reactions: {
    clap: number;
    star: number;
    heart: number;
    comment: number;
  };
  commentPreview?: {
    author: string;
    text: string;
  };
}

interface Comment {
  id?: string;
  author: string;
  text: string;
  time?: string;
}

interface ShoutCardProps {
  shout: Shout;
  onViewMore?: () => void;
  comments?: Comment[];
  onAddComment?: (author: string, text: string) => void;
}

export function ShoutCard({ shout, onViewMore, comments = [], onAddComment }: ShoutCardProps) {
  const [reactions, setReactions] = useState(shout.reactions);
  const [activeReactions, setActiveReactions] = useState<Set<string>>(new Set());
  const [showComments, setShowComments] = useState(false);

  const handleReaction = (type: keyof typeof reactions) => {
    const isActive = activeReactions.has(type);
    
    setReactions((prev) => ({
      ...prev,
      [type]: isActive ? prev[type] - 1 : prev[type] + 1,
    }));

    setActiveReactions((prev) => {
      const newSet = new Set(prev);
      if (isActive) {
        newSet.delete(type);
      } else {
        newSet.add(type);
      }
      return newSet;
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="p-3 shadow-soft-lg border border-gray-200 bg-white" style={{ borderRadius: 'var(--radius-xl)' }}>
      {/* Header */}
      <div className="flex items-start gap-2 mb-2">
        <Avatar className="w-9 h-9 ring-2 ring-gray-100">
          <AvatarImage src={shout.sender.avatar} alt={shout.sender.name} />
          <AvatarFallback>{getInitials(shout.sender.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-gray-900">{shout.sender.name}</span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-500 text-sm">{shout.timestamp}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {shout.recipients.map((recipient, index) => (
              <Badge key={index} variant="secondary" className="text-xs bg-sky-50 text-sky-700 border-0 px-2 py-0.5" style={{ borderRadius: 'var(--radius-sm)' }}>
                {recipient}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Message */}
      <p className="mb-2 text-gray-700 leading-relaxed">{shout.message}</p>

      {/* Optional Image */}
      {shout.imageUrl && (
        <div className="mb-2 rounded-xl overflow-hidden">
          <img
            src={shout.imageUrl}
            alt="Attachment"
            className="w-full h-64 object-cover"
          />
        </div>
      )}

      {/* Reactions */}
      <div className="flex items-center gap-1 mb-2 pb-2 border-b border-gray-100">
        <Button
          variant="ghost"
          size="sm"
          className={`gap-1 h-7 px-2 ${activeReactions.has("clap") ? "bg-sky-50 text-sky-600" : "text-gray-600 hover:bg-gray-50"}`}
          style={{ borderRadius: 'var(--radius-md)' }}
          onClick={() => handleReaction("clap")}
        >
          <span className="text-base">👏</span>
          <span className="text-sm font-medium">{reactions.clap}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`gap-1 h-7 px-2 ${activeReactions.has("star") ? "bg-yellow-50 text-yellow-600" : "text-gray-600 hover:bg-gray-50"}`}
          style={{ borderRadius: 'var(--radius-md)' }}
          onClick={() => handleReaction("star")}
        >
          <span className="text-base">⭐</span>
          <span className="text-sm font-medium">{reactions.star}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`gap-1 h-7 px-2 ${activeReactions.has("heart") ? "bg-red-50 text-red-600" : "text-gray-600 hover:bg-gray-50"}`}
          style={{ borderRadius: 'var(--radius-md)' }}
          onClick={() => handleReaction("heart")}
        >
          <span className="text-base">❤️</span>
          <span className="text-sm font-medium">{reactions.heart}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 h-7 px-2 ml-auto text-gray-600 hover:bg-gray-50"
          style={{ borderRadius: 'var(--radius-md)' }}
          onClick={() => setShowComments((s) => !s)}
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm font-medium">{reactions.comment}</span>
        </Button>
      </div>

      {/* Comment Preview */}
      {shout.commentPreview && (
        <div className="space-y-1">
          <div className="bg-gray-50 rounded-xl p-2" style={{ borderRadius: 'var(--radius-md)' }}>
            <p className="text-sm text-gray-700">
              <span className="font-semibold text-gray-900">{shout.commentPreview.author}</span>{" "}
              {shout.commentPreview.text}
            </p>
          </div>
          <Button 
            variant="link" 
            className="p-0 h-auto text-sm text-sky-600 hover:text-sky-700 font-medium"
            onClick={onViewMore}
          >
            View More Comments
          </Button>
        </div>
      )}

      {/* Inline Comments panel (keeps same page layout) */}
      {showComments && (
        <div className="mt-3">
          <CommentsWidget
            comments={comments}
            onAddComment={(author, text) => {
              if (onAddComment) onAddComment(author, text);
            }}
          />
        </div>
      )}
    </Card>
  );
}
