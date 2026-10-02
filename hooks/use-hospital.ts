"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
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
