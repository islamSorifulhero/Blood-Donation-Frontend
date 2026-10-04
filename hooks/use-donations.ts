"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient, getApiErrorMessage } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import type { ApiMeta, ApiSuccess, Donation } from "@/types";

export interface DonationFilters {
  status?: string;
  page?: number;
  limit?: number;
}

function toQueryString(filters: DonationFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  return params.toString();
}

export function useDonations(filters: DonationFilters) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["donations", filters],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccess<Donation[]>>(`/donations?${toQueryString(filters)}`);
      return { items: res.data.data, meta: res.data.meta as ApiMeta };
    },
    enabled: !!accessToken,
  });
}

export function useScheduleDonation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { requestMatchId: string; donationDate: string; location?: string }) => {
      const res = await apiClient.post<ApiSuccess<Donation>>("/donations", payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donations"] });
      queryClient.invalidateQueries({ queryKey: ["donor", "matches"] });
      toast.success("Donation scheduled");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useCancelDonation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      await apiClient.patch(`/donations/${id}/cancel`, { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["donations"] });
      toast.success("Donation cancelled");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}
