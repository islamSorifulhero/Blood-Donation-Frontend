"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient, getApiErrorMessage } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import type { ApiMeta, ApiSuccess, MyMatch } from "@/types";

export interface MyMatchFilters {
  status?: string;
  page?: number;
  limit?: number;
}

function toQueryString(filters: MyMatchFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  return params.toString();
}

export function useMyMatches(filters: MyMatchFilters) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["donor", "matches", filters],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccess<MyMatch[]>>(`/blood-requests/matches/mine?${toQueryString(filters)}`);
      return { items: res.data.data, meta: res.data.meta as ApiMeta };
    },
    enabled: !!accessToken,
  });
}

export function useRespondToMatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      bloodRequestId,
      matchId,
      response,
    }: {
      bloodRequestId: string;
      matchId: string;
      response: "ACCEPTED" | "DECLINED";
    }) => {
      const res = await apiClient.patch<ApiSuccess<MyMatch>>(
        `/blood-requests/${bloodRequestId}/matches/${matchId}/respond`,
        { response }
      );
      return res.data.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["donor", "matches"] });
      toast.success(variables.response === "ACCEPTED" ? "You accepted this request" : "You declined this request");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}
