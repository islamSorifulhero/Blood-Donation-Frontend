"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient, getApiErrorMessage } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import type { ApiSuccess, HospitalProfile } from "@/types";

export function useMyHospitalProfile() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["hospital", "me"],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccess<HospitalProfile>>("/hospitals/me");
      return res.data.data;
    },
    enabled: !!accessToken,
  });
}

export function useUpdateMyHospitalProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Pick<HospitalProfile, "hospitalName" | "address" | "city">>) => {
      const res = await apiClient.patch<ApiSuccess<HospitalProfile>>("/hospitals/me", payload);
      return res.data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["hospital", "me"], data);
      toast.success("Hospital profile updated");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}
