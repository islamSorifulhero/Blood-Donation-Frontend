"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient, getApiErrorMessage } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import type { ApiMeta, ApiSuccess, Role, User } from "@/types";

export interface UserFilters {
  role?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  [key: string]: unknown;
}

function toQueryString(filters: Record<string, unknown>): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  return params.toString();
}

export function useAdminUsers(filters: UserFilters) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["admin", "users", filters],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccess<User[]>>(`/admin/users?${toQueryString(filters)}`);
      return { items: res.data.data, meta: res.data.meta as ApiMeta };
    },
    enabled: !!accessToken,
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: Role }) => {
      const res = await apiClient.patch<ApiSuccess<User>>(`/admin/users/${id}/role`, { role });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User role updated");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isActive, reason }: { id: string; isActive: boolean; reason?: string }) => {
      const res = await apiClient.patch<ApiSuccess<User>>(`/admin/users/${id}/status`, { isActive, reason });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User status updated");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}
