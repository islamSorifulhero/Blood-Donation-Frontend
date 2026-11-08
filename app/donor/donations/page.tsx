
"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  HeartPulse,
  Droplet,
  CalendarDays,
  Clock3,
  CheckCircle2,
  XCircle,
  Filter,
  MapPin,
  HeartHandshake,
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
import { ReasonDialog } from "@/components/shared/reason-dialog";

import {
  useDonations,
  useCancelDonation,
} from "@/hooks/use-donations";

const DONATION_STATUS_VARIANT: Record<
  string,
  "default" | "destructive" | "outline"
> = {
  SCHEDULED: "outline",
  COMPLETED: "default",
  CANCELLED: "destructive",
  NO_SHOW: "destructive",
};

function getStatusIcon(status: string) {
  switch (status) {
    case "COMPLETED":
      return <CheckCircle2 className="h-3.5 w-3.5" />;

    case "CANCELLED":
    case "NO_SHOW":
      return <XCircle className="h-3.5 w-3.5" />;

    default:
      return <Clock3 className="h-3.5 w-3.5" />;
  }
}

function formatDonationDate(date: string) {
  return new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DonorDonationsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-5">
          <Skeleton className="h-36 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      }
    >
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

  const { data, isLoading, isError, refetch } = useDonations({
    page,
    limit: 10,
    status,
  });

  const cancelDonation = useCancelDonation();

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

  const donationCount = data?.items.length ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-red-100 bg-gradient-to-br from-red-50 via-white to-rose-50 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="max-w-xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-100 bg-white/80 px-3 py-1 text-xs font-semibold text-red-600">
              <HeartPulse className="h-3.5 w-3.5" />
              Donor Activity
            </div>

            <h1 className="font-display text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              Donation History
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-600 sm:text-base">
              Keep track of your scheduled and completed donations.
              Your contribution can help save lives.
            </p>
          </div>

          <div className="flex h-20 w-20 shrink-0 items-center justify-center self-start rounded-2xl bg-red-100 text-red-600 sm:h-24 sm:w-24">
            <HeartPulse className="h-10 w-10 sm:h-12 sm:w-12" />
          </div>
        </div>

        <div className="pointer-events-none absolute -bottom-16 -right-10 h-48 w-48 rounded-full bg-red-100/50 blur-2xl" />
      </div>

      {/* Information Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <Droplet className="h-6 w-6" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Donations on this page
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {isLoading ? "—" : donationCount}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <HeartHandshake className="h-6 w-6" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Your impact
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              Every donation is a chance to save a life.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <Filter className="h-5 w-5 text-muted-foreground" />
            </div>

            <div>
              <h2 className="font-semibold">Filter donations</h2>
              <p className="text-xs text-muted-foreground">
                Find donations by their current status
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select
              value={status ?? "ALL"}
              onValueChange={(value) =>
                setParam(
                  "status",
                  value === "ALL" ? undefined : value
                )
              }
            >
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="NO_SHOW">No-show</SelectItem>
              </SelectContent>
            </Select>

            {status && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setParam("status", undefined)}
              >
                Clear filter
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Donation History Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-2 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-foreground">
              Your donations
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              A record of your donation appointments and activity.
            </p>
          </div>

          <Badge variant="outline" className="w-fit">
            {status ? status.replaceAll("_", " ") : "All donations"}
          </Badge>
        </div>

        {isLoading && (
          <div className="space-y-3 p-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-14 w-full rounded-lg"
              />
            ))}
          </div>
        )}

        {isError && (
          <div className="p-5">
            <ErrorState
              message="Couldn't load your donation history."
              onRetry={() => refetch()}
            />
          </div>
        )}

        {data && data.items.length === 0 && (
          <div className="px-4 py-12">
            <EmptyState
              icon={HeartPulse}
              title="No donations found"
              description="Your scheduled and completed donations will appear here. Accept a match and schedule a donation to get started."
            />
          </div>
        )}

        {data && data.items.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="min-w-[150px]">
                      Patient
                    </TableHead>
                    <TableHead className="min-w-[180px]">
                      Hospital
                    </TableHead>
                    <TableHead className="min-w-[180px]">
                      Donation date
                    </TableHead>
                    <TableHead className="min-w-[90px]">
                      Units
                    </TableHead>
                    <TableHead className="min-w-[130px]">
                      Status
                    </TableHead>
                    <TableHead className="min-w-[120px]">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data.items.map((d) => (
                    <TableRow
                      key={d.id}
                      className="transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                            <HeartPulse className="h-4 w-4" />
                          </div>

                          <span className="font-medium text-foreground">
                            {d.bloodRequest.patientName}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span>
                            {d.bloodRequest.hospital.hospitalName}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span>
                            {formatDonationDate(d.donationDate)}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="inline-flex items-center gap-2 font-medium">
                          <Droplet className="h-4 w-4 text-red-500" />
                          {d.unitsDonated}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={
                            DONATION_STATUS_VARIANT[d.status] ??
                            "outline"
                          }
                          className="gap-1.5"
                        >
                          {getStatusIcon(d.status)}
                          {d.status.replaceAll("_", " ")}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {d.status === "SCHEDULED" ? (
                          <ReasonDialog
                            trigger="Cancel"
                            title="Cancel this donation?"
                            confirmLabel="Cancel donation"
                            loading={cancelDonation.isPending}
                            onConfirm={(reason) =>
                              cancelDonation.mutate({
                                id: d.id,
                                reason,
                              })
                            }
                          />
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            —
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="border-t border-border px-4 py-3">
              <PaginationControls meta={data.meta} />
            </div>
          </>
        )}
      </div>

      {/* Bottom Note */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
        <div className="mt-0.5 text-blue-600">
          <HeartHandshake className="h-5 w-5" />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-blue-900">
            Thank you for being a donor
          </h3>
          <p className="mt-1 text-xs leading-5 text-blue-800">
            Your willingness to donate can make a meaningful difference.
            Always follow the hospital's instructions and medical
            screening before donating blood.
          </p>
        </div>
      </div>
    </div>
  );
}
