"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient, getApiErrorMessage } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import type { ApiMeta, ApiSuccess, Payment, PaymentProvider, PaymentPurpose } from "@/types";

export interface PaymentFilters {
  status?: string;
  provider?: string;
  purpose?: string;
  userId?: string;
  page?: number;
  limit?: number;
}

function toQueryString(filters: PaymentFilters): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  return params.toString();
}

export function usePayments(filters: PaymentFilters) {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["payments", filters],
    queryFn: async () => {
      const res = await apiClient.get<ApiSuccess<Payment[]>>(`/payments?${toQueryString(filters)}`);
      return { items: res.data.data, meta: res.data.meta as ApiMeta };
    },
    enabled: !!accessToken,
  });
}

interface InitiatePaymentResult {
  paymentId: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
  redirectUrl?: string;
}

export function useInitiatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      purpose: PaymentPurpose;
      provider: PaymentProvider;
      bloodRequestId?: string;
      amount?: number;
    }) => {
      const res = await apiClient.post<ApiSuccess<InitiatePaymentResult>>("/payments/initiate", payload);
      return res.data.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      if (data.redirectUrl) {
        // Full navigation, not a client-side route change — the payer needs to leave
        // the app entirely to the gateway's own hosted checkout page.
        window.location.href = data.redirectUrl;
      } else {
        toast.error("The payment provider didn't return a checkout link");
      }
    },
    onError: (err) => toast.error(getApiErrorMessage(err)),
  });
}
