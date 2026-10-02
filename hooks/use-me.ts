"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import type { ApiSuccess, User } from "@/types";

export function useMe() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccess<User>>("/users/me");
      return res.data.data;
    },
    enabled: !!accessToken,
  });
}
