// src/pages/DashboardPage.tsx
import usePosts from "../hooks/usePosts";
import { useMemo, useState, useEffect } from "react";
import { MetricCard } from "../components/MetricCard";
import ShoutCard from "../components/ShoutCard";
import { TopContributors } from "../components/TopContributors";
import { TrendingTags } from "../components/TrendingTags";
import { QuickLinks } from "../components/QuickLinks";
import { CommentsWidget } from "../components/CommentsWidget";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import api from "../api/api";

interface DashboardPageProps {
  onViewShout?: () => void;
  onViewFindPeople?: () => void;
}

export function DashboardPage({ onViewShout, onViewFindPeople }: DashboardPageProps) {
  const [departmentFilter, setDepartmentFilter] = useState<string>("All");
  const [timeFilter, setTimeFilter] = useState<string>("7days");
  const [reactionSort, setReactionSort] = useState<string>("All");

  const { posts: apiPosts, loading: postsLoading, fetchPosts, deletePost } = usePosts();
  const [currentUserId, setCurrentUserId] = useState<number | string | undefined>(undefined);
  const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        if ((api as any).getCurrentUser) {
          const u = await (api as any).getCurrentUser();
          if (u) {
            setCurrentUserId(u.id ?? u.user_id ?? u.pk);
            setCurrentUserIsAdmin(Boolean(u.is_admin ?? u.isAdmin ?? u.admin));
          }
        }
      } catch {
        // ignore
      }
    };
    loadUser();
  }, []);

  // Map API posts into the shape used by ShoutCard
  const apiShouts = useMemo(() => {
    if (!Array.isArray(apiPosts) || apiPosts.length === 0) return [];
    return apiPosts.map((p: any) => {
      const id = p.id ?? p.post_id ?? p.postId ?? String(Math.random()).slice(2);
      const author = p.author ?? p.user ?? p.user_detail ?? null;

      const sender = author
        ? {
            id: author.id ?? author.user_id ?? author.pk ?? author._id ?? p.user_id ?? p.userId ?? undefined,
            name: author.full_name ?? author.username ?? author.name ?? "Unknown",
            avatar: author.profile_picture_url ?? author.avatar ?? author.image,
          }
        : {
            id: p.user_id ?? undefined,
            name: p.user_full_name ?? p.user_name ?? "Unknown",
            avatar: undefined,
          };

      const recipients =
        Array.isArray(p.recipients) ? p.recipients.map((r: any) => (typeof r === "string" ? r : r?.name ?? r?.username ?? String(r))) : [];

      const message = p.description ?? p.body ?? p.message ?? "";
      const timestamp = p.created_at ?? p.createdAt ?? p.timestamp ?? "";
      const imageUrl = p.image_url ?? p.imageUrl ?? p.image ?? undefined;
      const reactions = p.reactions_count ?? p.reactions ?? p.reactionCount ?? { clap: 0, star: 0, heart: 0, comment: 0 };
      const department = (author?.department ?? p.department ?? "General") as string;
      const ageDays = p.ageDays ?? 0;

      const taggedUsers = p.taggedUsers ?? p.tagged ?? p.tags ?? p.mentionedUsers ?? p.tagged_users ?? [];

      return {
        id,
        sender,
        recipients,
        message,
        timestamp,
        imageUrl,
        reactions,
        ageDays,
        department,
        taggedUsers,
      };
    });
  }, [apiPosts]);

  const departments = useMemo(() => {
    const set = new Set<string>(apiShouts.map((s) => s.department || "General"));
    return ["All", ...Array.from(set)];
  }, [apiShouts]);

  const filteredShouts = useMemo(() => {
    const maxDays = timeFilter === "7days" ? 7 : timeFilter === "30days" ? 30 : 90;
    let list = apiShouts.filter((s) => {
      const passDept = departmentFilter === "All" || s.department === departmentFilter;
      const passTime = (s.ageDays ?? 0) <= maxDays;
      return passDept && passTime;
    });

    if (reactionSort !== "All") {
      list = list.sort((a, b) => {
        const ra = (a.reactions as any)[reactionSort] ?? 0;
        const rb = (b.reactions as any)[reactionSort] ?? 0;
        return rb - ra;
      });
    } else {
      list = list.sort((a, b) => {
        const ta = (a.reactions?.clap ?? 0) + (a.reactions?.star ?? 0) + (a.reactions?.heart ?? 0) + (a.reactions?.comment ?? 0);
        const tb = (b.reactions?.clap ?? 0) + (b.reactions?.star ?? 0) + (b.reactions?.heart ?? 0) + (b.reactions?.comment ?? 0);
        return tb - ta;
      });
    }

    return list;
  }, [departmentFilter, timeFilter, reactionSort, apiShouts]);

  useEffect(() => {
    // ensure latest posts on mount
    fetchPosts().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
        <div className="lg:col-span-2 space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <MetricCard title="Total Users" value="1,293" change="56.8%" isPositive subtitle="vs last month" icon="users" />
            <MetricCard title="All Shouts" value="256k" change="36.8%" isPositive subtitle="vs last month" icon="Shout" />
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Recent Shout-outs</h3>

              <div className="flex items-center gap-2">
                <Select value={departmentFilter} onValueChange={(v) => setDepartmentFilter(v)}>
                  <SelectTrigger className="w-40 h-10 text-sm bg-gray-50 border-gray-200" style={{ borderRadius: "var(--radius-md)" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent style={{ borderRadius: "var(--radius-md)" }}>
                    {departments.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={timeFilter} onValueChange={(v) => setTimeFilter(v)}>
                  <SelectTrigger className="w-36 h-10 text-sm bg-gray-50 border-gray-200" style={{ borderRadius: "var(--radius-md)" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent style={{ borderRadius: "var(--radius-md)" }}>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="90days">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={reactionSort} onValueChange={(v) => setReactionSort(v)}>
                  <SelectTrigger className="w-44 h-10 text-sm bg-gray-50 border-gray-200" style={{ borderRadius: "var(--radius-md)" }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent style={{ borderRadius: "var(--radius-md)" }}>
                    <SelectItem value="All">Most reactions (all)</SelectItem>
                    <SelectItem value="clap">Most claps</SelectItem>
                    <SelectItem value="star">Most stars</SelectItem>
                    <SelectItem value="heart">Most hearts</SelectItem>
                    <SelectItem value="comment">Most comments</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3 max-h-[48rem] overflow-y-auto">
              {postsLoading ? (
                <div className="p-4 text-sm text-gray-500">Loading posts...</div>
              ) : filteredShouts.length === 0 ? (
                <div className="text-sm text-gray-500">No shout-outs found.</div>
              ) : (
                filteredShouts.map((s: any) => (
                  <ShoutCard
                    key={s.id}
                    shout={{
                      id: s.id,
                      sender: s.sender,
                      recipients: s.recipients,
                      message: s.message,
                      timestamp: s.timestamp,
                      imageUrl: s.imageUrl,
                      reactions: s.reactions,
                      commentPreview: undefined,
                      taggedUsers: s.taggedUsers,
                    }}
                    onViewMore={onViewShout}
                    onDelete={async (id) => {
                      // call hook delete
                      try {
                        await deletePost(id);
                      } catch (err) {
                        console.error("Dashboard onDelete failed:", err);
                        throw err;
                      }
                    }}
                    currentUserId={currentUserId}
                    currentUserIsAdmin={currentUserIsAdmin}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <TopContributors onViewAll={() => onViewFindPeople?.()} />
          <TrendingTags />
          <QuickLinks />
          <CommentsWidget />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
