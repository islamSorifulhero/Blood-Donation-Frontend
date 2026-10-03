"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient, getApiErrorMessage } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import type { ApiMeta, ApiSuccess, BloodRequest, RequestMatch } from "@/types";

export interface BloodRequestFilters {
  bloodGroup?: string;
  status?: string;
  urgency?: string;
  city?: string;
  search?: string;
  mine?: boolean;
  page?: number;
  limit?: number;
}

function toQueryString(filters: BloodRequestFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  return params.toString();
}

export function useBloodRequests(filters: BloodRequestFilters) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["blood-requests", filters],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccess<BloodRequest[]>>(`/blood-requests?${toQueryString(filters)}`);
      return { items: res.data.data, meta: res.data.meta as ApiMeta };
    },
    enabled: !!accessToken,
  });
}

export function useBloodRequest(id: string | undefined) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["blood-requests", "detail", id],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccess<BloodRequest>>(`/blood-requests/${id}`);
      return res.data.data;
    },
    enabled: !!accessToken && !!id,
  });
}

export function useRequestMatches(id: string | undefined) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["blood-requests", "matches", id],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccess<RequestMatch[]>>(`/blood-requests/${id}/matches`);
      return res.data.data;
    },
    enabled: !!accessToken && !!id,
  });
}

export function useCreateBloodRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const res = await apiClient.post<ApiSuccess<BloodRequest>>("/blood-requests", payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blood-requests"] });
      toast.success("Blood request submitted — pending admin verification");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useVerifyBloodRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isVerified, remarks }: { id: string; isVerified: boolean; remarks?: string }) => {
      const res = await apiClient.patch<ApiSuccess<{ request: BloodRequest; matchedCount: number }>>(
        `/blood-requests/${id}/verify`,
        { isVerified, remarks }
      );
      return res.data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["blood-requests"] });
      queryClient.invalidateQueries({ queryKey: ["blood-requests", "detail", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["blood-requests", "matches", variables.id] });
      toast.success(
        variables.isVerified ? `Verified — matched ${data.matchedCount} donor(s)` : "Request rejected"
      );
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useCancelBloodRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      await apiClient.patch(`/blood-requests/${id}/cancel`, { reason });
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["blood-requests"] });
      queryClient.invalidateQueries({ queryKey: ["blood-requests", "detail", variables.id] });
      toast.success("Request cancelled");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}
