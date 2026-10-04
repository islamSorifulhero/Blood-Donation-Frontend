"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import type { ApiSuccess, AppNotification } from "@/types";

export function useNotifications(isRead?: boolean) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["notifications", { isRead }],
    queryFn: async () => {
      const params = isRead === undefined ? "" : `?isRead=${isRead}`;
      const res = await apiClient.get<ApiSuccess<AppNotification[]>>(`/notifications${params}`);
      return res.data.data;
    },
    enabled: !!accessToken,
    refetchInterval: 60_000, // light polling — good enough for an assignment demo
  });
}

export function useUnreadCount() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccess<{ unreadCount: number }>>("/notifications/unread-count");
      return res.data.data.unreadCount;
    },
    enabled: !!accessToken,
    refetchInterval: 60_000,
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.patch(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await apiClient.patch("/notifications/read-all");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
