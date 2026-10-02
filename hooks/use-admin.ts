"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import type { ApiSuccess, DashboardStats } from "@/types";

export function useDashboardStats() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["admin", "dashboard-stats"],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccess<DashboardStats>>("/admin/dashboard-stats");
      return res.data.data;
    },
    enabled: !!accessToken,
  });
}
