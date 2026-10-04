"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { HeartPulse } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { ReasonDialog } from "@/components/shared/reason-dialog";
import { useDonations, useCancelDonation } from "@/hooks/use-donations";

const DONATION_STATUS_VARIANT: Record<string, "default" | "success" | "destructive" | "outline"> = {
  SCHEDULED: "outline",
  COMPLETED: "success",
  CANCELLED: "destructive",
  NO_SHOW: "destructive",
};

export default function DonorDonationsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <DonorDonationsContent />
    </Suspense>
  );
}

function DonorDonationsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const status = searchParams.get("status") ?? undefined;

  const { data, isLoading, isError, refetch } = useDonations({ page, limit: 10, status });
  const cancelDonation = useCancelDonation();

  function setParam(key: string, value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-medium">Donation History</h1>
      <p className="mt-1 text-sm text-muted-foreground">Every donation you&rsquo;ve scheduled or completed.</p>

      <div className="mt-6">
        <Select value={status ?? "ALL"} onValueChange={(v) => setParam("status", v === "ALL" ? undefined : v)}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            <SelectItem value="SCHEDULED">Scheduled</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="NO_SHOW">No-show</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-card">
        {isLoading && (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
          </div>
        )}

        {isError && <ErrorState message="Couldn't load your donation history." onRetry={() => refetch()} />}

        {data && data.items.length === 0 && (
          <EmptyState icon={HeartPulse} title="No donations yet" description="Accept a match and schedule a donation to see it here." />
        )}

        {data && data.items.length > 0 && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.bloodRequest.patientName}</TableCell>
                    <TableCell className="text-muted-foreground">{d.bloodRequest.hospital.hospitalName}</TableCell>
                    <TableCell>{new Date(d.donationDate).toLocaleString()}</TableCell>
                    <TableCell>{d.unitsDonated}</TableCell>
                    <TableCell>
                      <Badge variant={DONATION_STATUS_VARIANT[d.status] ?? "default"}>{d.status.replace("_", " ")}</Badge>
                    </TableCell>
                    <TableCell>
                      {d.status === "SCHEDULED" && (
                        <ReasonDialog
                          trigger="Cancel"
                          title="Cancel this donation?"
                          confirmLabel="Cancel donation"
                          loading={cancelDonation.isPending}
                          onConfirm={(reason) => cancelDonation.mutate({ id: d.id, reason })}
                        />
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
