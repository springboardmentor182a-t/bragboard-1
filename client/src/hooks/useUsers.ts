// -----------------------------
// File: src/hooks/useUsers.ts
// -----------------------------

import { useCallback, useState, useEffect } from "react";
import api, { User } from "../api/api";

export default function useUsers(initialPage = 1, initialLimit = 50) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState<number | null>(null);

  const fetchUsers = useCallback(async (opts?: { page?: number; limit?: number; search?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getUsers(opts);
      if ((res as any).users) {
        setUsers((res as any).users);
        if ((res as any).total) setTotal((res as any).total);
      } else {
        setUsers(res as unknown as User[]);
      }
      setLoading(false);
      return res;
    } catch (err: any) {
      setError(err?.message || "Failed to fetch users");
      setLoading(false);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchUsers({ page, limit }).catch(() => {});
  }, [fetchUsers, page, limit]);

  const create = useCallback(async (payload: Partial<User> & { password: string }) => {
    setLoading(true);
    try {
      const u = await api.createUser(payload);
      // Optionally refresh list or append
      setUsers((prev) => [u as User, ...prev]);
      setLoading(false);
      return u;
    } catch (err: any) {
      setError(err?.message || "Failed to create user");
      setLoading(false);
      throw err;
    }
  }, []);

  const update = useCallback(async (id: number, payload: Partial<User>) => {
    setLoading(true);
    try {
      const u = await api.updateUser(id, payload);
      setUsers((prev) => prev.map((p) => (p.id === id ? (u as User) : p)));
      setLoading(false);
      return u;
    } catch (err: any) {
      setError(err?.message || "Failed to update user");
      setLoading(false);
      throw err;
    }
  }, []);

  const remove = useCallback(async (id: number) => {
    setLoading(true);
    try {
      await api.deleteUser(id);
      setUsers((prev) => prev.filter((p) => p.id !== id));
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err?.message || "Failed to delete user");
      setLoading(false);
      throw err;
    }
  }, []);

  const suspend = useCallback(async (id: number) => {
    setLoading(true);
    try {
      await api.suspendUser(id);
      // Optionally toggle a local field or refetch
      await fetchUsers({ page, limit });
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err?.message || "Failed to suspend user");
      setLoading(false);
      throw err;
    }
  }, [fetchUsers, page, limit]);

  return {
    users,
    loading,
    error,
    page,
    limit,
    total,
    setPage,
    setLimit,
    fetchUsers,
    create,
    update,
    remove,
    suspend,
  };
}

