"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { RequestStatusBadge, UrgencyBadge } from "@/components/shared/status-badges";
import { useBloodRequest, useRequestMatches, useCancelBloodRequest } from "@/hooks/use-blood-requests";
import { useInitiatePayment } from "@/hooks/use-payments";
import { BLOOD_GROUP_LABELS } from "@/lib/constants";

const MATCH_STATUS_VARIANT: Record<string, "default" | "success" | "destructive" | "outline"> = {
  NOTIFIED: "outline",
  ACCEPTED: "success",
  DECLINED: "destructive",
  EXPIRED: "destructive",
  COMPLETED: "success",
};

export default function HospitalRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  const { data: request, isLoading, isError, refetch } = useBloodRequest(id);
  const { data: matches, isLoading: matchesLoading } = useRequestMatches(id);
  const cancelRequest = useCancelBloodRequest();
  const initiatePayment = useInitiatePayment();

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

  const canCancel = !["FULFILLED", "CANCELLED", "EXPIRED"].includes(request.status);

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-medium">{request.patientName}</h1>
          <div className="mt-2 flex items-center gap-2">
            <RequestStatusBadge status={request.status} />
            <UrgencyBadge urgency={request.urgency} />
          </div>
        </div>
        {canCancel && (
          <div className="flex items-center gap-2">
            {confirmingCancel ? (
              <>
                <Button variant="outline" size="sm" onClick={() => setConfirmingCancel(false)}>
                  Keep request
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  loading={cancelRequest.isPending}
                  onClick={() =>
                    cancelRequest.mutate(
                      { id: request.id },
                      { onSuccess: () => setConfirmingCancel(false) }
                    )
                  }
                >
                  Confirm cancel
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setConfirmingCancel(true)}>
                Cancel request
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <InfoCard label="Blood group" value={BLOOD_GROUP_LABELS[request.bloodGroup]} />
        <InfoCard label="Units" value={`${request.unitsFulfilled} / ${request.unitsNeeded} fulfilled`} />
        <InfoCard label="Required by" value={new Date(request.requiredBy).toLocaleString()} />
      </div>

      {canCancel && (
        <Card className="mt-4 border-primary/30">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="font-medium">Priority request fee</p>
              <p className="mt-1 text-sm text-muted-foreground">
                An optional fee tied to this request&rsquo;s urgency level. Matching and
                verification already run the same way regardless of payment.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              loading={initiatePayment.isPending}
              onClick={() =>
                initiatePayment.mutate({ purpose: "PRIORITY_REQUEST_FEE", provider: "STRIPE", bloodRequestId: request.id })
              }
            >
              Pay priority fee
            </Button>
          </CardContent>
        </Card>
      )}

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
                description={
                  request.status === "PENDING_VERIFICATION"
                    ? "Matching starts once an admin verifies this request."
                    : "No compatible donors were found nearby for this request yet."
                }
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

      <Button variant="ghost" className="mt-4" onClick={() => router.push("/hospital/requests")}>
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
