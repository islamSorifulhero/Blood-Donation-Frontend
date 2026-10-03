"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient, getApiErrorMessage } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import type { ApiMeta, ApiSuccess, HospitalProfile } from "@/types";

export interface HospitalFilters {
  city?: string;
  isVerified?: boolean;
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

export function useAdminHospitals(filters: HospitalFilters) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["admin", "hospitals", filters],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccess<HospitalProfile[]>>(`/hospitals?${toQueryString(filters)}`);
      return { items: res.data.data, meta: res.data.meta as ApiMeta };
    },
    enabled: !!accessToken,
  });
}

export function useVerifyHospital() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isVerified, remarks }: { id: string; isVerified: boolean; remarks?: string }) => {
      const res = await apiClient.patch<ApiSuccess<HospitalProfile>>(`/hospitals/${id}/verify`, { isVerified, remarks });
      return res.data.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "hospitals"] });
      toast.success(variables.isVerified ? "Hospital verified" : "Hospital verification revoked");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}
