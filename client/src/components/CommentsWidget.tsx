// src/components/CommentsWidget.tsx
import React, { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import api from "../api/api";

type Comment = {
  id?: string;
  author: string;
  product?: string;
  time?: string;
  text: string;
  avatar?: string;
};

const defaultComments: Comment[] = [
  {
    author: "Joyce",
    product: "Bento Pro 2.0",
    time: "3 days ago",
    text: "Great work! When HTML version will be available?",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
  },
  {
    author: "Gladyce",
    product: "Food Delivery App",
    time: "5 days ago",
    text: "",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  },
];

interface Props {
  comments?: Comment[];
  onAddComment?: (author: string, text: string) => void;
  postId?: number;
  headerTitle?: string;
}

export function CommentsWidget({
  comments: externalComments,
  onAddComment,
  postId,
  headerTitle = "Top Comments",
}: Props) {
  const [localComments, setLocalComments] = useState<Comment[]>(defaultComments);
  const [text, setText] = useState<string>("");
  const commentsToRender = externalComments ?? localComments;
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    const author = "You";

    if (onAddComment) {
      onAddComment(author, trimmed);
    } else if (postId) {
      // call backend if postId provided
      setSubmitting(true);
      try {
        await api.createComment(postId, trimmed);
        // If backend doesn't return new comment object, add locally
        const newComment: Comment = {
          id: `local-${Date.now()}`,
          author,
          text: trimmed,
          time: "now",
        };
        setLocalComments((prev) => [newComment, ...prev]);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to add comment", err);
        // fallback to local comment
        const newComment: Comment = {
          id: `local-${Date.now()}`,
          author,
          text: trimmed,
          time: "now",
        };
        setLocalComments((prev) => [newComment, ...prev]);
      } finally {
        setSubmitting(false);
      }
    } else {
      const newComment: Comment = {
        id: `local-${Date.now()}`,
        author,
        text: trimmed,
        time: "now",
      };
      setLocalComments((prev) => [newComment, ...prev]);
    }

    setText("");
  };

  return (
    <Card
      className="p-5 shadow-xl shadow-gray-200/50 border border-gray-100 bg-white hover:shadow-2xl hover:shadow-gray-300/50 transition-all duration-300"
      style={{ borderRadius: "var(--radius-2xl)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-900 font-semibold text-lg">{headerTitle}</h3>
        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
          {commentsToRender.length} new
        </span>
      </div>

      <div className="space-y-4 max-h-64 overflow-y-auto">
        {commentsToRender.length === 0 ? (
          <div className="text-xs text-gray-500">No comments yet.</div>
        ) : (
          commentsToRender.map((comment, index) => (
            <div
              key={comment.id ?? index}
              className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-xl transition-all group cursor-pointer"
            >
              <Avatar className="w-10 h-10 ring-2 ring-white shadow-md group-hover:ring-indigo-100 transition-all">
                {comment.avatar ? (
                  <AvatarImage src={comment.avatar} alt={comment.author} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                    {(comment.author || "U")[0]}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5 mb-1">
                  <span className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {comment.author}
                  </span>
                  {comment.product && (
                    <>
                      <span className="text-xs text-gray-400">on</span>
                      <span className="text-xs font-medium text-gray-600">
                        {comment.product}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-400 mb-1.5">{comment.time}</p>
                {comment.text && (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {comment.text}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={submit} className="mt-3 flex gap-2">
        <button className="p-0 h-auto hover:opacity-90 transition-all bg-transparent border-0 cursor-pointer group">
          <Avatar className="w-10 h-10 ring-2 ring-gray-200 group-hover:ring-indigo-300 transition-all">
            <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" />
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white">SC</AvatarFallback>
          </Avatar>
        </button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 rounded-md border px-2 py-1 text-sm"
          placeholder="Write a comment..."
          style={{ borderRadius: 'var(--radius-xl)' }}
        />
        <Button
          type="submit"
          disabled={submitting}
          className="h-10 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40"
          style={{ borderRadius: 'var(--radius-xl)' }}
        >
          {submitting ? "Posting..." : "Post"}
        </Button>
      </form>
    </Card>
  );
}

export default CommentsWidget;
