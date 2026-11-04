
"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  ScrollText,
  Filter,
  UserRound,
  CalendarDays,
  X,
  ShieldCheck,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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

import { useAuditLogs } from "@/hooks/use-admin-audit-logs";

export default function AdminAuditLogsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <AdminAuditLogsContent />
    </Suspense>
  );
}

function AdminAuditLogsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const entityType = searchParams.get("entityType") ?? "";
  const action = searchParams.get("action") ?? "";

  const { data, isLoading, isError, refetch } = useAuditLogs({
    page,
    limit: 15,
    entityType: entityType || undefined,
    action: action || undefined,
  });

  function setParam(key: string, value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());

    if (value?.trim()) {
      params.set(key, value.trim());
    } else {
      params.delete(key);
    }

    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  }

  function clearFilters() {
    router.push(pathname);
  }

  const hasFilters = Boolean(entityType || action);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ScrollText className="size-5" />
            </div>

            <h1 className="font-display text-2xl font-semibold">
              Audit Logs
            </h1>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Monitor critical actions and activities performed across the platform.
          </p>
        </div>

        <Badge variant="outline" className="w-fit gap-1.5 px-3 py-1.5">
          <ShieldCheck className="size-3.5" />
          Admin Activity Monitor
        </Badge>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold">
              Filter Audit Logs
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

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Entity Type
            </label>

            <Input
              placeholder="e.g. BloodRequest"
              defaultValue={entityType}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setParam(
                    "entityType",
                    (e.target as HTMLInputElement).value
                  );
                }
              }}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Action
            </label>

            <Input
              placeholder="e.g. VERIFY_HOSPITAL"
              defaultValue={action}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setParam(
                    "action",
                    (e.target as HTMLInputElement).value
                  );
                }
              }}
            />
          </div>
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Enter a value and press Enter to apply the filter.
        </p>
      </div>

      {/* Audit Logs Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-1 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">
              Activity History
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Recorded actions across the platform
            </p>
          </div>

          <Badge variant="outline">
            {data?.meta?.total ?? 0} Total Records
          </Badge>
        </div>

        {isLoading && (
          <div className="space-y-3 p-5">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-14 w-full" />
            ))}
          </div>
        )}

        {!isLoading && isError && (
          <ErrorState
            message="Couldn't load audit logs."
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !isError && data?.items.length === 0 && (
          <EmptyState
            icon={ScrollText}
            title="No audit logs found"
          />
        )}

        {!isLoading && !isError && data && data.items.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead>Date & Time</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data.items.map((log) => (
                    <TableRow key={log.id}>
                      {/* Action */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="whitespace-nowrap font-mono text-xs"
                        >
                          {log.action}
                        </Badge>
                      </TableCell>

                      {/* Entity */}
                      <TableCell>
                        <div className="font-medium">
                          {log.entityType}
                        </div>
                      </TableCell>

                      {/* Actor */}
                      <TableCell>
                        {log.actor ? (
                          <div className="flex items-center gap-2">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
                              <UserRound className="size-4 text-muted-foreground" />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">
                                {log.actor.name}
                              </p>

                              <p className="text-xs text-muted-foreground">
                                {log.actor.role}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <ShieldCheck className="size-4" />
                            System
                          </div>
                        )}
                      </TableCell>

                      {/* Date */}
                      <TableCell>
                        <div className="flex items-start gap-2">
                          <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

                          <div className="whitespace-nowrap">
                            <p className="text-sm font-medium">
                              {new Date(log.createdAt).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              {new Date(log.createdAt).toLocaleTimeString(
                                "en-GB",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="border-t border-border p-3">
              <PaginationControls meta={data.meta} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
