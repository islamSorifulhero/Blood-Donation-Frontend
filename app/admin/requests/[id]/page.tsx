"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ReasonDialog } from "@/components/shared/reason-dialog";
import { RequestStatusBadge, UrgencyBadge } from "@/components/shared/status-badges";
import { useBloodRequest, useRequestMatches, useVerifyBloodRequest } from "@/hooks/use-blood-requests";
import { BLOOD_GROUP_LABELS } from "@/lib/constants";

const MATCH_STATUS_VARIANT: Record<string, "default" | "success" | "destructive" | "outline"> = {
  NOTIFIED: "outline",
  ACCEPTED: "success",
  DECLINED: "destructive",
  EXPIRED: "destructive",
  COMPLETED: "success",
};

export default function AdminRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const { data: request, isLoading, isError, refetch } = useBloodRequest(id);
  const { data: matches, isLoading: matchesLoading } = useRequestMatches(id);
  const verifyRequest = useVerifyBloodRequest();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (isError || !request) {
    return <ErrorState message="Couldn't load this request." onRetry={() => refetch()} />;
  }

  const pending = request.status === "PENDING_VERIFICATION";

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium">{request.patientName}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{request.hospital.hospitalName} &middot; {request.city}</p>
          <div className="mt-2 flex items-center gap-2">
            <RequestStatusBadge status={request.status} />
            <UrgencyBadge urgency={request.urgency} />
          </div>
        </div>
        {pending && (
          <div className="flex items-center gap-2">
            <ReasonDialog
              trigger="Reject"
              title="Reject this request?"
              description="The hospital will be notified with your reason."
              confirmLabel="Reject"
              reasonRequired
              loading={verifyRequest.isPending}
              onConfirm={(reason) => verifyRequest.mutate({ id: request.id, isVerified: false, remarks: reason })}
            />
            <Button
              variant="success"
              size="sm"
              loading={verifyRequest.isPending}
              onClick={() => verifyRequest.mutate({ id: request.id, isVerified: true })}
            >
              Verify &amp; start matching
            </Button>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <InfoCard label="Blood group" value={BLOOD_GROUP_LABELS[request.bloodGroup]} />
        <InfoCard label="Units" value={`${request.unitsFulfilled} / ${request.unitsNeeded} fulfilled`} />
        <InfoCard label="Required by" value={new Date(request.requiredBy).toLocaleString()} />
      </div>

      {request.reason && (
        <Card className="mt-4">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Reason</p>
            <p className="mt-1 text-sm">{request.reason}</p>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Matched donors</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {matchesLoading && (
            <div className="space-y-2 p-6">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
            </div>
          )}

          {matches && matches.length === 0 && (
            <div className="px-6 pb-6">
              <EmptyState
                icon={Users}
                title="No matches yet"
                description={pending ? "Matching starts once this request is verified." : "No compatible donors were found nearby."}
              />
            </div>
          )}

          {matches && matches.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Donor</TableHead>
                  <TableHead>Blood group</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matches.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.donor.name}</TableCell>
                    <TableCell>{BLOOD_GROUP_LABELS[m.donor.bloodGroup]}</TableCell>
                    <TableCell>{m.donor.city}</TableCell>
                    <TableCell>
                      <Badge variant={MATCH_STATUS_VARIANT[m.status] ?? "default"}>{m.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Button variant="ghost" className="mt-4" onClick={() => router.push("/admin/requests")}>
        Back to all requests
      </Button>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-2 font-display text-xl">{value}</p>
      </CardContent>
    </Card>
  );
}
