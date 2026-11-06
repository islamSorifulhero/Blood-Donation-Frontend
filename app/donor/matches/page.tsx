
"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Bell,
  Droplet,
  HeartHandshake,
  CalendarDays,
  MapPin,
  CheckCircle2,
  Clock3,
  XCircle,
  Filter,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { UrgencyBadge } from "@/components/shared/status-badges";
import { ScheduleDonationDialog } from "@/components/shared/schedule-donation-dialog";

import {
  useMyMatches,
  useRespondToMatch,
} from "@/hooks/use-donor-matches";

import { BLOOD_GROUP_LABELS } from "@/lib/constants";

const MATCH_STATUS_VARIANT: Record<
  string,
  "default" | "destructive" | "outline"
> = {
  NOTIFIED: "outline",
  ACCEPTED: "default",
  DECLINED: "destructive",
  EXPIRED: "destructive",
  COMPLETED: "default",
};

function getStatusIcon(status: string) {
  switch (status) {
    case "ACCEPTED":
    case "COMPLETED":
      return <CheckCircle2 className="h-3.5 w-3.5" />;

    case "DECLINED":
    case "EXPIRED":
      return <XCircle className="h-3.5 w-3.5" />;

    default:
      return <Clock3 className="h-3.5 w-3.5" />;
  }
}

function formatDate(date?: string | null) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function DonorMatchesPage() {
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

  const { data, isLoading, isError, refetch } = useMyMatches({
    page,
    limit: 10,
    status,
  });

  const respond = useRespondToMatch();

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

  const matchesCount = data?.items.length ?? 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-2xl border border-red-100 bg-gradient-to-br from-red-50 via-white to-rose-50 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="max-w-xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-100 bg-white/80 px-3 py-1 text-xs font-semibold text-red-600">
              <HeartHandshake className="h-3.5 w-3.5" />
              Donor Matching Center
            </div>

            <h1 className="font-display text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              My Matches
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-600 sm:text-base">
              View blood donation requests matched with your blood group and
              respond when someone needs your help.
            </p>
          </div>

          <div className="flex h-20 w-20 shrink-0 items-center justify-center self-start rounded-2xl bg-red-100 text-red-600 sm:h-24 sm:w-24">
            <HeartHandshake className="h-10 w-10 sm:h-12 sm:w-12" />
          </div>
        </div>

        <div className="pointer-events-none absolute -bottom-16 -right-10 h-48 w-48 rounded-full bg-red-100/50 blur-2xl" />
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <Droplet className="h-6 w-6" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Matches on this page
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {isLoading ? "—" : matchesCount}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <HeartHandshake className="h-6 w-6" />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Your contribution matters
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              Every response can make a difference.
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
              <h2 className="font-semibold">Filter matches</h2>
              <p className="text-xs text-muted-foreground">
                Find matches by their current status
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Select
              value={status ?? "ALL"}
              onValueChange={(value) =>
                setParam("status", value === "ALL" ? undefined : value)
              }
            >
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                <SelectItem value="NOTIFIED">Needs response</SelectItem>
                <SelectItem value="ACCEPTED">Accepted</SelectItem>
                <SelectItem value="DECLINED">Declined</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
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

      {/* Matches Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-2 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-foreground">
              Matched blood requests
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Review requests and manage your responses.
            </p>
          </div>

          <Badge variant="outline" className="w-fit">
            {status ? status.replaceAll("_", " ") : "All matches"}
          </Badge>
        </div>

        {isLoading && (
          <div className="space-y-3 p-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        )}

        {isError && (
          <div className="p-5">
            <ErrorState
              message="Couldn't load your matches."
              onRetry={() => refetch()}
            />
          </div>
        )}

        {data && data.items.length === 0 && (
          <div className="px-4 py-12">
            <EmptyState
              icon={Bell}
              title="No matches found"
              description="You'll see a match here when a compatible blood request is matched with your donor profile."
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
                    <TableHead className="min-w-[170px]">
                      Hospital
                    </TableHead>
                    <TableHead className="min-w-[110px]">
                      Blood group
                    </TableHead>
                    <TableHead className="min-w-[110px]">
                      Urgency
                    </TableHead>
                    <TableHead className="min-w-[130px]">
                      Status
                    </TableHead>
                    <TableHead className="min-w-[190px]">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data.items.map((m) => (
                    <TableRow key={m.id} className="transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                            <HeartHandshake className="h-4 w-4" />
                          </div>

                          <span className="font-medium text-foreground">
                            {m.bloodRequest.patientName}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span>
                            {m.bloodRequest.hospital.hospitalName}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant="outline"
                          className="border-red-200 bg-red-50 font-semibold text-red-600"
                        >
                          {BLOOD_GROUP_LABELS[m.bloodRequest.bloodGroup]}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <UrgencyBadge
                          urgency={m.bloodRequest.urgency}
                        />
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={
                            MATCH_STATUS_VARIANT[m.status] ?? "outline"
                          }
                          className="gap-1.5"
                        >
                          {getStatusIcon(m.status)}
                          {m.status.replaceAll("_", " ")}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {m.status === "NOTIFIED" ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <Button
                              size="sm"
                              loading={respond.isPending}
                              disabled={respond.isPending}
                              onClick={() =>
                                respond.mutate({
                                  bloodRequestId: m.bloodRequest.id,
                                  matchId: m.id,
                                  response: "ACCEPTED",
                                })
                              }
                            >
                              <CheckCircle2 className="mr-1.5 h-4 w-4" />
                              Accept
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              loading={respond.isPending}
                              disabled={respond.isPending}
                              onClick={() =>
                                respond.mutate({
                                  bloodRequestId: m.bloodRequest.id,
                                  matchId: m.id,
                                  response: "DECLINED",
                                })
                              }
                            >
                              Decline
                            </Button>
                          </div>
                        ) : m.status === "ACCEPTED" && !m.donation ? (
                          <ScheduleDonationDialog
                            requestMatchId={m.id}
                            patientName={m.bloodRequest.patientName}
                          />
                        ) : m.status === "ACCEPTED" && m.donation ? (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarDays className="h-4 w-4" />
                            <span className="capitalize">
                              Scheduled ({m.donation.status.toLowerCase()})
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarDays className="h-4 w-4" />
                            <span>{formatDate(m.respondedAt)}</span>
                          </div>
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
          <Bell className="h-5 w-5" />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-blue-900">
            Stay connected
          </h3>
          <p className="mt-1 text-xs leading-5 text-blue-800">
            Keep your donor profile updated and check your matches regularly.
            Accepting a request does not replace the required medical
            screening and confirmation before donation.
          </p>
        </div>
      </div>
    </div>
  );
}
