"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient, getApiErrorMessage } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import type { ApiSuccess, DonorProfile } from "@/types";

export function useMyDonorProfile() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["donor", "me"],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccess<DonorProfile>>("/donors/me");
      return res.data.data;
    },
    enabled: !!accessToken,
  });
}

export function useUpdateMyDonorProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Pick<DonorProfile, "isAvailable" | "address" | "city" | "medicalNotes">>) => {
      const res = await apiClient.patch<ApiSuccess<DonorProfile>>("/donors/me", payload);
      return res.data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["donor", "me"], data);
      toast.success("Profile updated");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}
