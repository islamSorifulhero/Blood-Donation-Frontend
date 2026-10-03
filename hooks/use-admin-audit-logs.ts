"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import type { ApiMeta, ApiSuccess, AuditLogEntry } from "@/types";

export interface AuditLogFilters {
  entityType?: string;
  action?: string;
  actorId?: string;
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

export function useAuditLogs(filters: AuditLogFilters) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["admin", "audit-logs", filters],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccess<AuditLogEntry[]>>(`/admin/audit-logs?${toQueryString(filters)}`);
      return { items: res.data.data, meta: res.data.meta as ApiMeta };
    },
    enabled: !!accessToken,
  });
}
