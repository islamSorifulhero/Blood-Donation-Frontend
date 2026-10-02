"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import type { ApiError, ApiSuccess, User } from "@/types";

interface AuthResponseData {
  user: User;
  accessToken: string;
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok || json.success === false) {
    // Shape it like an axios error so getApiErrorMessage() handles both call sites identically.
    const error = new Error((json as ApiError).message ?? "Request failed") as Error & { response?: unknown };
    error.response = { data: json };
    throw error;
  }
  return (json as ApiSuccess<T>).data;
}

function useAuthSuccessHandler() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  return (data: AuthResponseData) => {
    setAuth(data.user, data.accessToken);
    router.push(`/${data.user.role.toLowerCase()}`);
  };
}

export function useLogin() {
  const handleSuccess = useAuthSuccessHandler();
  return useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      postJson<AuthResponseData>("/api/auth/login", payload),
    onSuccess: (data) => {
      handleSuccess(data);
      toast.success(`Welcome back, ${data.user.name.split(" ")[0]}`);
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useRegisterDonor() {
  const handleSuccess = useAuthSuccessHandler();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      postJson<AuthResponseData>("/api/auth/register/donor", payload),
    onSuccess: (data) => {
      handleSuccess(data);
      toast.success("Donor account created!");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useRegisterHospital() {
  const handleSuccess = useAuthSuccessHandler();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      postJson<AuthResponseData>("/api/auth/register/hospital", payload),
    onSuccess: (data) => {
      handleSuccess(data);
      toast.success("Hospital account created — an admin must verify it before you can post requests.");
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    },
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      router.push("/login");
    },
  });
}
