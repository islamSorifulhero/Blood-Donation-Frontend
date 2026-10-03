"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ScrollText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { useAuditLogs } from "@/hooks/use-admin-audit-logs";

export default function AdminAuditLogsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <AdminAuditLogsContent />
    </Suspense>
  );
}

function AdminAuditLogsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const entityType = searchParams.get("entityType") ?? undefined;
  const action = searchParams.get("action") ?? undefined;

  const { data, isLoading, isError, refetch } = useAuditLogs({ page, limit: 15, entityType, action });

  function setParam(key: string, value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-medium">Audit Logs</h1>
      <p className="mt-1 text-sm text-muted-foreground">Every critical action taken across the platform.</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Input
          className="max-w-[220px]"
          placeholder="Entity type, e.g. BloodRequest"
          defaultValue={entityType}
          onKeyDown={(e) => e.key === "Enter" && setParam("entityType", (e.target as HTMLInputElement).value)}
        />
        <Input
          className="max-w-[220px]"
          placeholder="Action, e.g. VERIFY_HOSPITAL"
          defaultValue={action}
          onKeyDown={(e) => e.key === "Enter" && setParam("action", (e.target as HTMLInputElement).value)}
        />
      </div>

      <div className="mt-6 rounded-lg border border-border bg-card">
        {isLoading && (
          <div className="space-y-3 p-4">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
          </div>
        )}

        {isError && <ErrorState message="Couldn't load audit logs." onRetry={() => refetch()} />}

        {data && data.items.length === 0 && <EmptyState icon={ScrollText} title="No matching audit log entries" />}

        {data && data.items.length > 0 && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>When</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">
                      <Badge variant="outline">{log.action}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{log.entityType}</TableCell>
                    <TableCell>{log.actor ? `${log.actor.name} (${log.actor.role})` : "System"}</TableCell>
                    <TableCell className="text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</TableCell>
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
