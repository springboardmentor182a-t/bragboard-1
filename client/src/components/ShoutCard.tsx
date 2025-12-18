// src/components/ShoutCard.tsx
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { MessageCircle, X, MoreVertical } from "lucide-react";
import { CommentsWidget } from "./CommentsWidget";
import api from "../api/api";

interface Shout {
  id: number | string;
  sender: { id?: number | string; name: string; avatar?: string };
  recipients?: string[];
  taggedUsers?: string[];
  message: string;
  timestamp: string;
  imageUrl?: string;
  reactions?: Record<string, number>;
  commentPreview?: { author: string; text: string };
}

interface Props {
  shout: Shout;
  onViewMore?: () => void;
  comments?: any[];
  onAddComment?: (author: string, text: string) => void;
  onReport?: (shoutId: string | number) => void;
  onReportWithReason?: (shoutId: string | number, reason: string) => void;
  onDelete?: (shoutId: string | number) => Promise<any> | any;
  currentUserId?: number | string;
  currentUserIsAdmin?: boolean;
}

export function ShoutCard({
  shout,
  onViewMore,
  comments = [],
  onAddComment,
  onReport,
  onReportWithReason,
  onDelete,
  currentUserId: currentUserIdProp,
  currentUserIsAdmin: currentUserIsAdminProp,
}: Props) {
  const [reactions, setReactions] = useState(shout.reactions ?? { clap: 0, star: 0, heart: 0, comment: 0 });
  const [showComments, setShowComments] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportError, setReportError] = useState("");
  const [reportStatus, setReportStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const [deleting, setDeleting] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const [currentUserId, setCurrentUserId] = useState<number | string | undefined>(currentUserIdProp);
  const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState<boolean | undefined>(currentUserIsAdminProp);

  useEffect(() => {
    if (currentUserIdProp !== undefined) setCurrentUserId(currentUserIdProp);
    if (currentUserIsAdminProp !== undefined) setCurrentUserIsAdmin(currentUserIsAdminProp);

    if (currentUserIdProp === undefined || currentUserIsAdminProp === undefined) {
      (async () => {
        try {
          if ((api as any).getCurrentUser) {
            const u = await (api as any).getCurrentUser().catch(() => null);
            if (u) {
              if (currentUserIdProp === undefined) setCurrentUserId(u.id ?? u.user_id ?? u.pk ?? u._id);
              if (currentUserIsAdminProp === undefined) setCurrentUserIsAdmin(Boolean(u.is_admin ?? u.isAdmin ?? u.admin));
              return;
            }
          }
        } catch {
          // ignore
        }

        try {
          const localUser = JSON.parse(localStorage.getItem("user") || localStorage.getItem("currentUser") || "null");
          if (localUser) {
            if (currentUserIdProp === undefined) setCurrentUserId(localUser.id ?? localUser.user_id ?? localUser.pk ?? localUser._id);
            if (currentUserIsAdminProp === undefined) setCurrentUserIsAdmin(Boolean(localUser.is_admin ?? localUser.isAdmin ?? localUser.admin));
            return;
          }
        } catch {
          // ignore
        }

        try {
          const token = localStorage.getItem("token");
          if (token) {
            const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
            if (currentUserIdProp === undefined) setCurrentUserId(payload.sub ?? payload.user_id ?? payload.id ?? payload.uid);
            if (currentUserIsAdminProp === undefined) setCurrentUserIsAdmin(Boolean(payload.is_admin ?? payload.admin ?? payload.role === "admin"));
          }
        } catch {
          // ignore
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (deleted) return null;

  const senderId = shout.sender?.id ?? undefined;
  const isOwner = senderId !== undefined && currentUserId !== undefined && String(senderId) === String(currentUserId);
  const isAdmin = Boolean(currentUserIsAdmin);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const handleDelete = async () => {
    if (deleting) return;
    setMenuOpen(false);
    setDeleting(true);

    try {
      if (typeof onDelete === "function") {
        await onDelete(shout.id);
      } else if ((api as any).deletePost) {
        await (api as any).deletePost(shout.id);
      } else {
        throw new Error("Delete not implemented");
      }

      setDeleted(true);
    } catch (err: any) {
      console.error("Failed to delete shout:", err);
      alert(err?.message ?? "Failed to delete the post. See console.");
      setDeleting(false);
    }
  };

  const openReport = () => {
    setReportReason("");
    setReportError("");
    setReportStatus("idle");
    setShowReportModal(true);
    setMenuOpen(false);
  };
  const closeReport = () => {
    setShowReportModal(false);
    setReportReason("");
    setReportError("");
    setReportStatus("idle");
  };
  const sendReport = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const reason = reportReason.trim();
    if (!reason) {
      setReportError("Please provide a reason for reporting this post.");
      return;
    }
    setReportStatus("sending");
    try {
      if (onReportWithReason) await onReportWithReason(shout.id, reason);
      else if (onReport) await onReport(shout.id);
      else if ((api as any).reportShout) await (api as any).reportShout({ shoutId: shout.id, reason });
      setReportStatus("sent");
    } catch {
      setReportStatus("error");
      setReportError("Failed to send report. Please try again.");
    }
  };

  const handleReaction = async (type: string) => {
    setReactions((prev) => ({ ...prev, [type]: (prev[type] ?? 0) + 1 }));
    try {
      if ((api as any).reactToPost) await (api as any).reactToPost(Number(shout.id), type);
    } catch {
      // ignore
    }
  };

  const tagged = shout.taggedUsers ?? [];

  return (
    <>
      <Card className="p-3 shadow-soft-lg border border-gray-200 bg-white" style={{ borderRadius: "var(--radius-xl)" }}>
        <div className="flex items-start gap-2 mb-2">
          <Avatar className="w-9 h-9 ring-2 ring-gray-100">
            <AvatarImage src={shout.sender.avatar} alt={shout.sender.name} />
            <AvatarFallback>{getInitials(shout.sender.name)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0"> 
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-gray-900">{shout.sender.name}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-500 text-sm">{shout.timestamp}</span>
                </div>

                {/* RECIPIENT BADGES (your old UI) */}
                {shout.recipients?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {shout.recipients.map((r, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="text-xs bg-sky-50 text-sky-700 border-0 px-2 py-0.5"
                      >
                        {r}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* TAGGED USERS — @mention chips */}
                {Array.isArray(shout.taggedUsers) && shout.taggedUsers.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {shout.taggedUsers.map((t, i) => (
                      <span
                        key={i}
                        className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full"
                      >
                        @{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>


              <div className="relative">
                <button aria-label="Open menu" onClick={() => !deleting && setMenuOpen((s) => !s)} className="p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                  <MoreVertical />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-md shadow-lg z-20" onMouseLeave={() => setMenuOpen(false)}>
                    <button onClick={openReport} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Report
                    </button>

                    {(isOwner || isAdmin) && (
                      <button onClick={handleDelete} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50" disabled={deleting}>
                        {deleting ? "Deleting..." : "Delete"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <p className="mb-2 text-gray-700 leading-relaxed">{shout.message}</p>

        {shout.imageUrl && (
          <div className="mb-2 rounded-xl overflow-hidden">
            <img src={shout.imageUrl} alt="Attachment" className="w-full h-64 object-cover" />
          </div>
        )}

        <div className="flex items-center gap-1 mb-2 pb-2 border-b border-gray-100">
          <Button variant="ghost" size="sm" className="gap-1 h-7 px-2" onClick={() => handleReaction("clap")}>
            <span className="text-base">👏</span>
            <span className="text-sm font-medium">{reactions.clap ?? 0}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1 h-7 px-2" onClick={() => handleReaction("star")}>
            <span className="text-base">⭐</span>
            <span className="text-sm font-medium">{reactions.star ?? 0}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1 h-7 px-2" onClick={() => handleReaction("heart")}>
            <span className="text-base">❤️</span>
            <span className="text-sm font-medium">{reactions.heart ?? 0}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1 h-7 px-2 ml-auto text-gray-600 hover:bg-gray-50" onClick={() => setShowComments((s) => !s)}>
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{reactions.comment ?? 0}</span>
          </Button>
        </div>

        {shout.commentPreview && (
          <div className="space-y-1">
            <div className="bg-gray-50 rounded-xl p-2">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-gray-900">{shout.commentPreview.author}</span> {shout.commentPreview.text}
              </p>
            </div>
            <Button variant="link" className="p-0 h-auto text-sm text-sky-600 hover:text-sky-700 font-medium" onClick={onViewMore}>
              View More Comments
            </Button>
          </div>
        )}

        {showComments && (
          <div className="mt-3">
            <CommentsWidget comments={comments} onAddComment={(author, text) => { if (onAddComment) onAddComment(author, text); else if ((api as any).createComment) (api as any).createComment(Number(shout.id), text).catch(console.error); }} />
          </div>
        )}
      </Card>

      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/40" onClick={closeReport} />
          <div className="relative w-full max-w-lg mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Report post</h3>
                  <p className="text-sm text-gray-600">Tell us why you're reporting this post. Our moderators will review it.</p>
                </div>
                <button onClick={closeReport} aria-label="Close" className="p-1 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"><X className="w-5 h-5" /></button>
              </div>

              <div className="border border-gray-100 rounded-xl p-3 mb-4 bg-gray-50">
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10 ring-2 ring-gray-100">
                    <AvatarImage src={shout.sender.avatar} alt={shout.sender.name} />
                    <AvatarFallback>{getInitials(shout.sender.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-gray-900">{shout.sender.name}</div>
                      <div className="text-xs text-gray-400">•</div>
                      <div className="text-xs text-gray-500">{shout.timestamp}</div>
                    </div>
                    <div className="mt-2 text-sm text-gray-700 leading-relaxed">{shout.message}</div>
                    {shout.imageUrl && <div className="mt-3 rounded-md overflow-hidden"><img src={shout.imageUrl} alt="attachment" className="w-full h-20 object-cover rounded-md" /></div>}
                    {shout.recipients?.length > 0 && <div className="mt-2 flex flex-wrap gap-1">{shout.recipients.map((r, i) => <Badge key={i} variant="secondary" className="text-xs bg-sky-50 text-sky-700 border-0 px-2 py-0.5">{r}</Badge>)}</div>}
                  </div>
                </div>
              </div>

              {reportStatus !== "sent" ? (
                <form onSubmit={sendReport} className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Reason for reporting</label>
                    <textarea value={reportReason} onChange={(e) => setReportReason(e.target.value)} placeholder="Please explain why you're reporting this post (required)" className="w-full mt-2 p-3 rounded-md border border-gray-200 h-28 resize-none" />
                    {reportError && <p className="text-sm text-red-600 mt-1">{reportError}</p>}
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <Button variant="ghost" onClick={closeReport} className="px-4 py-2">Cancel</Button>
                    <Button type="submit" className="h-11 px-6 bg-gradient-to-r from-sky-500 to-blue-600 text-white" disabled={reportStatus === "sending"}>{reportStatus === "sending" ? "Sending..." : "Send report"}</Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-700">Thanks — your report has been submitted. Our moderation team will review it shortly.</p>
                  <div className="flex justify-end"><Button onClick={closeReport} className="px-4 py-2">Close</Button></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ShoutCard;
