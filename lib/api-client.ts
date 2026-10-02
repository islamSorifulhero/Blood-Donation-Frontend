import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth-store";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

// Queue concurrent requests while a single refresh call is in flight, so a page that
// fires several queries at once doesn't trigger several parallel refresh attempts.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const { setAccessToken, clearAuth } = useAuthStore.getState();

  if (!refreshPromise) {
    // Same-origin call to our own Next.js route handler, which holds the real
    // refresh token in a first-party httpOnly cookie — see app/api/auth/refresh.
    refreshPromise = fetch("/api/auth/refresh", { method: "POST" })
      .then(async (res) => {
        if (!res.ok) throw new Error("refresh failed");
        const body = await res.json();
        const newAccessToken: string = body.data.accessToken;
        setAccessToken(newAccessToken);
        return newAccessToken;
      })
      .catch(() => {
        clearAuth();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;

    if (error.response?.status === 401 && original && !original._retried && !original.url?.includes("/auth/")) {
      original._retried = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(original);
      }
    }

    return Promise.reject(error);
  }
);

/** Pulls the backend's structured `{success:false, message, errors}` body into a readable string. */
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; errors?: Array<{ message?: string }> } | undefined;
    if (data?.errors?.length) {
      const first = data.errors[0];
      return first?.message ? `${data.message}: ${first.message}` : (data?.message ?? "Something went wrong");
    }
    return data?.message ?? error.message ?? "Something went wrong";
  }
  return "Something went wrong";
}

export { refreshAccessToken };
