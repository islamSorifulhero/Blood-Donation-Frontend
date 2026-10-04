"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { usePayments } from "@/hooks/use-payments";
import { useDashboardStats } from "@/hooks/use-admin";
import { PAYMENT_PROVIDER_OPTIONS, PAYMENT_STATUS_VARIANT, PAYMENT_PURPOSE_LABELS } from "@/lib/constants";

export default function AdminPaymentsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <AdminPaymentsContent />
    </Suspense>
  );
}

function AdminPaymentsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const status = searchParams.get("status") ?? undefined;
  const provider = searchParams.get("provider") ?? undefined;
  const purpose = searchParams.get("purpose") ?? undefined;

  const { data, isLoading, isError, refetch } = usePayments({ page, limit: 15, status, provider, purpose });
  const { data: stats } = useDashboardStats();

  function setParam(key: string, value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-medium">Payments</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every payment across the platform.
        {stats && ` ${stats.payments.totalSuccessfulAmount} BDT collected across ${stats.payments.totalSuccessfulCount} successful payments, all-time.`}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Select value={status ?? "ALL"} onValueChange={(v) => setParam("status", v === "ALL" ? undefined : v)}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="SUCCESS">Success</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="REFUNDED">Refunded</SelectItem>
          </SelectContent>
        </Select>
        <Select value={provider ?? "ALL"} onValueChange={(v) => setParam("provider", v === "ALL" ? undefined : v)}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Provider" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All providers</SelectItem>
            {PAYMENT_PROVIDER_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={purpose ?? "ALL"} onValueChange={(v) => setParam("purpose", v === "ALL" ? undefined : v)}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Purpose" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All purposes</SelectItem>
            {Object.entries(PAYMENT_PURPOSE_LABELS).map(([value, label]) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-card">
        {isLoading && (
          <div className="space-y-3 p-4">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
          </div>
        )}

        {isError && <ErrorState message="Couldn't load payments." onRetry={() => refetch()} />}

        {data && data.items.length === 0 && <EmptyState icon={Receipt} title="No payments match these filters" />}

        {data && data.items.length > 0 && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{PAYMENT_PURPOSE_LABELS[p.purpose] ?? p.purpose}</TableCell>
                    <TableCell className="text-muted-foreground">{p.provider}</TableCell>
                    <TableCell>{p.amount} {p.currency}</TableCell>
                    <TableCell>
                      <Badge variant={PAYMENT_STATUS_VARIANT[p.status] ?? "default"}>{p.status}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{p.transactionId}</TableCell>
                    <TableCell className="text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <PaginationControls meta={data.meta} />
          </>
        )}
      </div>
    </div>
  );
}
