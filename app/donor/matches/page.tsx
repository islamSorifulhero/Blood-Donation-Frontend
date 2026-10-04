"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { UrgencyBadge } from "@/components/shared/status-badges";
import { Badge } from "@/components/ui/badge";
import { useMyMatches, useRespondToMatch } from "@/hooks/use-donor-matches";
import { ScheduleDonationDialog } from "@/components/shared/schedule-donation-dialog";
import { BLOOD_GROUP_LABELS } from "@/lib/constants";

const MATCH_STATUS_VARIANT: Record<string, "default" | "success" | "destructive" | "outline"> = {
  NOTIFIED: "outline",
  ACCEPTED: "success",
  DECLINED: "destructive",
  EXPIRED: "destructive",
  COMPLETED: "success",
};

export default function DonorMatchesPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <DonorMatchesContent />
    </Suspense>
  );
}

function DonorMatchesContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const status = searchParams.get("status") ?? undefined;

  const { data, isLoading, isError, refetch } = useMyMatches({ page, limit: 10, status });
  const respond = useRespondToMatch();

  function setParam(key: string, value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-medium">My Matches</h1>
      <p className="mt-1 text-sm text-muted-foreground">Requests you&rsquo;ve been matched to by blood group, eligibility, and distance.</p>

      <div className="mt-6">
        <Select value={status ?? "ALL"} onValueChange={(v) => setParam("status", v === "ALL" ? undefined : v)}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            <SelectItem value="NOTIFIED">Needs response</SelectItem>
            <SelectItem value="ACCEPTED">Accepted</SelectItem>
            <SelectItem value="DECLINED">Declined</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="EXPIRED">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-card">
        {isLoading && (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
          </div>
        )}

        {isError && <ErrorState message="Couldn't load your matches." onRetry={() => refetch()} />}

        {data && data.items.length === 0 && (
          <EmptyState icon={Bell} title="No matches yet" description="You'll see a match here as soon as a nearby compatible request needs your blood group." />
        )}

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
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.bloodRequest.patientName}</TableCell>
                    <TableCell className="text-muted-foreground">{m.bloodRequest.hospital.hospitalName}</TableCell>
                    <TableCell>{BLOOD_GROUP_LABELS[m.bloodRequest.bloodGroup]}</TableCell>
                    <TableCell><UrgencyBadge urgency={m.bloodRequest.urgency} /></TableCell>
                    <TableCell>
                      <Badge variant={MATCH_STATUS_VARIANT[m.status] ?? "default"}>{m.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {m.status === "NOTIFIED" ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="success"
                            loading={respond.isPending}
                            onClick={() => respond.mutate({ bloodRequestId: m.bloodRequest.id, matchId: m.id, response: "ACCEPTED" })}
                          >
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            loading={respond.isPending}
                            onClick={() => respond.mutate({ bloodRequestId: m.bloodRequest.id, matchId: m.id, response: "DECLINED" })}
                          >
                            Decline
                          </Button>
                        </div>
                      ) : m.status === "ACCEPTED" && !m.donation ? (
                        <ScheduleDonationDialog requestMatchId={m.id} patientName={m.bloodRequest.patientName} />
                      ) : m.status === "ACCEPTED" && m.donation ? (
                        <span className="text-sm text-muted-foreground">Scheduled ({m.donation.status.toLowerCase()})</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {m.respondedAt ? new Date(m.respondedAt).toLocaleDateString() : "—"}
                        </span>
                      )}
                    </TableCell>
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
