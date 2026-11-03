
"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Receipt,
  Wallet,
  CheckCircle2,
  CreditCard,
  Filter,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PaginationControls } from "@/components/shared/pagination-controls";

import { usePayments } from "@/hooks/use-payments";
import { useDashboardStats } from "@/hooks/use-admin";

import {
  PAYMENT_PROVIDER_OPTIONS,
  PAYMENT_STATUS_VARIANT,
  PAYMENT_PURPOSE_LABELS,
} from "@/lib/constants";

export default function AdminPaymentsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
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

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = usePayments({
    page,
    limit: 15,
    status,
    provider,
    purpose,
  });

  const { data: stats } = useDashboardStats();

  function setParam(key: string, value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  }

  function clearFilters() {
    router.push(pathname);
  }

  const hasFilters = Boolean(status || provider || purpose);

  const totalCollected =
    stats?.payments?.totalSuccessfulAmount ?? 0;

  const successfulCount =
    stats?.payments?.totalSuccessfulCount ?? 0;

  const currentPageCount = data?.items?.length ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Receipt className="size-5" />
            </div>

            <h1 className="font-display text-2xl font-semibold">
              Payments
            </h1>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Monitor transactions, payment providers and platform revenue.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Total Collected
            </p>

            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600">
              <Wallet className="size-5" />
            </div>
          </div>

          <p className="mt-4 text-2xl font-bold tracking-tight">
            {Number(totalCollected).toLocaleString()}{" "}
            <span className="text-sm font-medium text-muted-foreground">
              BDT
            </span>
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            All-time successful payment amount
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Successful Payments
            </p>

            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600">
              <CheckCircle2 className="size-5" />
            </div>
          </div>

          <p className="mt-4 text-2xl font-bold tracking-tight">
            {Number(successfulCount).toLocaleString()}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Total completed transactions
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Current Page Transactions
            </p>

            <div className="rounded-lg bg-violet-500/10 p-2 text-violet-600">
              <CreditCard className="size-5" />
            </div>
          </div>

          <p className="mt-4 text-2xl font-bold tracking-tight">
            {currentPageCount}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Transactions displayed on this page
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">
              Filter Transactions
            </h2>
          </div>

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground"
            >
              <X className="mr-1 size-4" />
              Clear filters
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Select
            value={status ?? "ALL"}
            onValueChange={(value) =>
              setParam("status", value === "ALL" ? undefined : value)
            }
          >
            <SelectTrigger className="w-full sm:w-[170px]">
              <SelectValue placeholder="Payment status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="SUCCESS">Success</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
              <SelectItem value="REFUNDED">Refunded</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={provider ?? "ALL"}
            onValueChange={(value) =>
              setParam("provider", value === "ALL" ? undefined : value)
            }
          >
            <SelectTrigger className="w-full sm:w-[190px]">
              <SelectValue placeholder="Payment provider" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">All providers</SelectItem>

              {PAYMENT_PROVIDER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={purpose ?? "ALL"}
            onValueChange={(value) =>
              setParam("purpose", value === "ALL" ? undefined : value)
            }
          >
            <SelectTrigger className="w-full sm:w-[210px]">
              <SelectValue placeholder="Payment purpose" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">All purposes</SelectItem>

              {Object.entries(PAYMENT_PURPOSE_LABELS).map(
                ([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-1 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Recent Transactions</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Payment history across the platform
            </p>
          </div>

          <Badge variant="outline">
            {data?.meta?.total ?? 0} Total Records
          </Badge>
        </div>

        {isLoading && (
          <div className="space-y-3 p-5">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        )}

        {!isLoading && isError && (
          <ErrorState
            message="Couldn't load payments."
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !isError && data?.items.length === 0 && (
          <EmptyState
            icon={Receipt}
            title="No payments found"
          />
        )}

        {!isLoading && !isError && data && data.items.length > 0 && (
          <>
            <div className="overflow-x-auto">
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
                  {data.items.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <span className="font-medium">
                          {PAYMENT_PURPOSE_LABELS[payment.purpose] ??
                            payment.purpose}
                        </span>
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {payment.provider}
                      </TableCell>

                      <TableCell>
                        <span className="font-semibold tabular-nums">
                          {Number(payment.amount).toLocaleString()}
                        </span>{" "}
                        <span className="text-xs text-muted-foreground">
                          {payment.currency}
                        </span>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={
                            PAYMENT_STATUS_VARIANT[payment.status] ??
                            "default"
                          }
                        >
                          {payment.status}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <span className="font-mono text-xs text-muted-foreground">
                          {payment.transactionId || "—"}
                        </span>
                      </TableCell>

                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {new Date(payment.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="border-t border-border p-3">
              <PaginationControls meta={data.meta} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
