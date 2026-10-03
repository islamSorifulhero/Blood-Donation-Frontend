"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Droplet, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { RequestStatusBadge, UrgencyBadge } from "@/components/shared/status-badges";
import { useBloodRequests } from "@/hooks/use-blood-requests";
import { BLOOD_GROUP_LABELS, BLOOD_GROUP_OPTIONS, URGENCY_OPTIONS } from "@/lib/constants";

const STATUS_OPTIONS = [
  "PENDING_VERIFICATION",
  "VERIFIED",
  "MATCHING",
  "PARTIALLY_FULFILLED",
  "FULFILLED",
  "CANCELLED",
  "EXPIRED",
];

export default function AdminRequestsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <AdminRequestsContent />
    </Suspense>
  );
}

function AdminRequestsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const status = searchParams.get("status") ?? undefined;
  const urgency = searchParams.get("urgency") ?? undefined;
  const bloodGroup = searchParams.get("bloodGroup") ?? undefined;
  const search = searchParams.get("search") ?? undefined;

  const { data, isLoading, isError, refetch } = useBloodRequests({
    page,
    limit: 10,
    status,
    urgency,
    bloodGroup,
    search,
  });

  function setParam(key: string, value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-medium">Blood Requests</h1>
      <p className="mt-1 text-sm text-muted-foreground">Every request submitted across all hospitals, including pending verification.</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search patient name..."
            defaultValue={search}
            onKeyDown={(e) => e.key === "Enter" && setParam("search", (e.target as HTMLInputElement).value)}
          />
        </div>
        <Select value={status ?? "ALL"} onValueChange={(v) => setParam("status", v === "ALL" ? undefined : v)}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={urgency ?? "ALL"} onValueChange={(v) => setParam("urgency", v === "ALL" ? undefined : v)}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Urgency" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All urgency</SelectItem>
            {URGENCY_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={bloodGroup ?? "ALL"} onValueChange={(v) => setParam("bloodGroup", v === "ALL" ? undefined : v)}>
          <SelectTrigger className="w-[120px]"><SelectValue placeholder="Group" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All groups</SelectItem>
            {BLOOD_GROUP_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-card">
        {isLoading && (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
          </div>
        )}

        {isError && <ErrorState message="Couldn't load requests." onRetry={() => refetch()} />}

        {data && data.items.length === 0 && <EmptyState icon={Droplet} title="No requests match these filters" />}

        {data && data.items.length > 0 && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Blood group</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((r) => (
                  <TableRow key={r.id} className="cursor-pointer" onClick={() => router.push(`/admin/requests/${r.id}`)}>
                    <TableCell className="font-medium">{r.patientName}</TableCell>
                    <TableCell className="text-muted-foreground">{r.hospital.hospitalName}</TableCell>
                    <TableCell>{BLOOD_GROUP_LABELS[r.bloodGroup]}</TableCell>
                    <TableCell><UrgencyBadge urgency={r.urgency} /></TableCell>
                    <TableCell><RequestStatusBadge status={r.status} /></TableCell>
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
