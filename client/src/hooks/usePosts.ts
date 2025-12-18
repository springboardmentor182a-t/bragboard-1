// src/hooks/usePosts.ts
import { useCallback, useEffect, useState } from "react";
import api from "../api/api";

export type PostAuthor = {
  id: number | string;
  username?: string;
  full_name?: string;
  email?: string;
  profile_picture_url?: string;
};

export type Post = {
  id: number | string;
  description: string;
  image_url?: string | null;
  author: PostAuthor;
  created_at: string;
  reactions_count?: Record<string, number> | number;
  recipients?: Array<number | string> | string[];
  taggedUsers?: string[]; // <--- main field used by ShoutCard
};

type CreatePostPayload = {
  description: string;
  image_url?: string | null;
  recipients?: Array<number | string>;
  tags?: string[];
};

export default function usePosts(initial: Post[] = []) {
  const [posts, setPosts] = useState<Post[]>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert recipients (mixed number/string) → number[]
  const recipientsToNumberArray = (rec?: Array<number | string>): number[] | undefined => {
    if (!rec || !Array.isArray(rec)) return undefined;

    const mapped = rec
      .map((r) => {
        if (typeof r === "number") return r;
        if (typeof r === "string") {
          const n = parseInt(r, 10);
          return Number.isFinite(n) ? n : undefined;
        }
        return undefined;
      })
      .filter((v): v is number => typeof v === "number");

    return mapped.length ? mapped : undefined;
  };

  // ----------------------
  // NORMALIZE POST OBJECT
  // ----------------------
  const normalize = useCallback((raw: any): Post => {
    if (!raw) raw = {};

    // ---- extract basic fields ----
    const id = raw.id ?? raw.post_id ?? raw.postId ?? raw._id ?? "";
    const description = raw.description ?? raw.body ?? "";
    const image_url = raw.image_url ?? raw.imageUrl ?? raw.image ?? null;
    const created_at =
      raw.created_at ?? raw.createdAt ?? raw.timestamp ?? new Date().toISOString();

    // ---- author ----
    let author: PostAuthor;
    if (raw.author || raw.user || raw.user_detail) {
      const u = raw.author ?? raw.user ?? raw.user_detail;
      author = {
        id: u.id ?? u.user_id ?? 0,
        username: u.username ?? u.user_name,
        full_name: u.full_name ?? u.fullName ?? u.name,
        email: u.email ?? "",
        profile_picture_url: u.profile_picture_url ?? u.avatar ?? u.image,
      };
    } else {
      author = {
        id: raw.user_id ?? 0,
        username: raw.user_name,
        full_name: raw.user_full_name ?? raw.user_name,
      };
    }

    // ---- recipients ----
    const recipients =
      raw.recipients ??
      raw.reciepients ??
      raw.to ??
      raw.receiver ??
      raw.receivers ??
      [];

    // ---- reactions ----
    const reactions_count =
      raw.reactions_count ?? raw.reactions ?? raw.reactionCount ?? {};

    // --------------------------
    // NORMALIZE TAGGED USERS
    // --------------------------

    // Accept ANY backend format:
    // taggedUsers, tagged_users, tags, mentionedUsers, plus fallback to recipients
    const taggedUsersRaw =
      raw.taggedUsers ??
      raw.tagged ??
      raw.tags ??
      raw.mentionedUsers ??
      raw.tagged_users ??
      (Array.isArray(raw.recipients)
        ? raw.recipients.map((r: any) =>
            typeof r === "string"
              ? r
              : r?.username ?? r?.name ?? String(r)
          )
        : []);

    // Clean & normalize each username
    const taggedUsers: string[] = (taggedUsersRaw || [])
      .map((t: any) => {
        if (typeof t === "string") return t.trim().replace(/^@+/, "");
        if (typeof t === "number") return String(t);
        return (t?.username ?? t?.name ?? String(t)).trim().replace(/^@+/, "");
      })
      .filter(Boolean);

    return {
      id,
      description,
      image_url,
      author,
      created_at,
      reactions_count,
      recipients,
      taggedUsers, // <---- final usable list for ShoutCard UI
    };
  }, []);

  // ------------------------
  // FETCH POSTS (type-safe)
  // ------------------------
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.getPosts();
      // TypeScript: the API type may be { posts: any[]; total?: number } or other shapes,
      // so treat it as unknown/any and narrow safely.
      const resAny = res as any;

      let items: any[] = [];

      if (Array.isArray(resAny)) {
        items = resAny;
      } else if (resAny && Array.isArray(resAny.posts)) {
        items = resAny.posts;
      } else if (resAny && Array.isArray(resAny.items)) {
        items = resAny.items;
      } else if (resAny && Array.isArray(resAny.data?.posts)) {
        items = resAny.data.posts;
      } else if (resAny && Array.isArray(resAny.data?.items)) {
        items = resAny.data.items;
      } else if (resAny && resAny.post) {
        // single-post wrapper
        items = [resAny.post];
      } else {
        // fallback: maybe it's an object with numeric keys, convert to array values
        if (resAny && typeof resAny === "object") {
          // no-op: keep items empty
          items = [];
        }
      }

      const normalized = items.map((p) => normalize(p));
      setPosts(normalized);
      setLoading(false);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load posts");
      setLoading(false);
    }
  }, [normalize]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // ------------------------
  // CREATE POST
  // ------------------------
  const createPost = useCallback(
    async (payload: CreatePostPayload): Promise<Post> => {
      setLoading(true);
      setError(null);

      try {
        // Convert recipients to numeric IDs:
        const recNums = recipientsToNumberArray(payload.recipients);

        const payloadForApi: any = {
          description: payload.description,
          image_url: payload.image_url ?? null,
        };

        if (recNums) payloadForApi.recipients = recNums;

        if (payload.tags) {
          payloadForApi.tags = payload.tags.map((t) =>
            t.trim().replace(/^@+/, "")
          );
        }

        const createdRaw = await api.createPost(payloadForApi);
        const crAny = createdRaw as any;

        // accept many shapes for the created post:
        const created =
          crAny?.post ??
          crAny?.data ??
          crAny?.data?.post ??
          crAny ??
          null;

        const normalized = normalize(created);
        setPosts((prev) => [normalized, ...prev]);
        setLoading(false);

        return normalized;
      } catch (err: any) {
        setError(err?.message ?? "Failed to create post");
        setLoading(false);
        throw err;
      }
    },
    [normalize]
  );

  // ------------------------
  // UPDATE POST
  // ------------------------
  const updatePost = useCallback(
    async (postId: string | number, patch: Partial<CreatePostPayload>) => {
      setLoading(true);
      setError(null);

      try {
        if (!(api as any).updatePost)
          throw new Error("updatePost API not implemented");

        const payloadForApi: any = { ...patch };

        // recipients to numeric IDs
        if (patch.recipients)
          payloadForApi.recipients = recipientsToNumberArray(patch.recipients);

        // tags cleanup
        if (patch.tags)
          payloadForApi.tags = patch.tags.map((t) =>
            String(t).trim().replace(/^@+/, "")
          );

        const updatedRaw = await (api as any).updatePost(postId, payloadForApi);
        const normalized = normalize(updatedRaw);

        setPosts((prev) =>
          prev.map((p) => (p.id === normalized.id ? normalized : p))
        );

        setLoading(false);
        return normalized;
      } catch (err: any) {
        setError(err?.message ?? "Failed to update post");
        setLoading(false);
        throw err;
      }
    },
    [normalize]
  );

  // ------------------------
  // DELETE POST
  // ------------------------
  const deletePost = useCallback(async (postId: string | number) => {
    setLoading(true);
    setError(null);

    try {
      if (!(api as any).deletePost)
        throw new Error("deletePost API not implemented");

      await (api as any).deletePost(postId);

      setPosts((prev) => prev.filter((p) => p.id !== postId));
      setLoading(false);

      return true;
    } catch (err: any) {
      setError(err?.message ?? "Failed to delete post");
      setLoading(false);
      throw err;
    }
  }, []);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    setPosts,
  };
}
