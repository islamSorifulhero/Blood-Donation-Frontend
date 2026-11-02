
"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Droplet, Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
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
import {
  RequestStatusBadge,
  UrgencyBadge,
} from "@/components/shared/status-badges";

import { useBloodRequests } from "@/hooks/use-blood-requests";

import {
  BLOOD_GROUP_LABELS,
  BLOOD_GROUP_OPTIONS,
  URGENCY_OPTIONS,
} from "@/lib/constants";

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
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
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
  const search = searchParams.get("search") ?? "";

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useBloodRequests({
    page,
    limit: 10,
    status,
    urgency,
    bloodGroup,
    search: search || undefined,
  });

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

  function handleSearch() {
    setParam("search", searchInput.trim() || undefined);
  }

  function clearFilters() {
    setSearchInput("");
    router.push(pathname);
  }

  const hasFilters = Boolean(
    search || status || urgency || bloodGroup
  );

  function openRequest(id: string) {
    router.push(`/admin/requests/${id}`);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-medium">
          Blood Requests
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Every request submitted across all hospitals, including pending verification.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col flex-wrap gap-3 sm:flex-row">
        {/* Search */}
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            className="pl-9 pr-10"
            placeholder="Search patient name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />

          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                setParam("search", undefined);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Status Filter */}
        <Select
          value={status ?? "ALL"}
          onValueChange={(value) =>
            setParam("status", value === "ALL" ? undefined : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[190px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>

            {STATUS_OPTIONS.map((item) => (
              <SelectItem key={item} value={item}>
                {item.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Urgency Filter */}
        <Select
          value={urgency ?? "ALL"}
          onValueChange={(value) =>
            setParam("urgency", value === "ALL" ? undefined : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Urgency" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All urgency</SelectItem>

            {URGENCY_OPTIONS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Blood Group Filter */}
        <Select
          value={bloodGroup ?? "ALL"}
          onValueChange={(value) =>
            setParam("bloodGroup", value === "ALL" ? undefined : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[130px]">
            <SelectValue placeholder="Blood group" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All groups</SelectItem>

            {BLOOD_GROUP_OPTIONS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasFilters && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="shrink-0"
          >
            <X className="mr-2 size-4" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Requests Table */}
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        {isLoading && (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        )}

        {!isLoading && isError && (
          <ErrorState
            message="Couldn't load requests."
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !isError && data?.items.length === 0 && (
          <EmptyState
            icon={Droplet}
            title="No requests found"
          />
        )}

        {!isLoading && !isError && data && data.items.length > 0 && (
          <>
            <div className="overflow-x-auto">
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
                  {data.items.map((request) => (
                    <TableRow
                      key={request.id}
                      className="cursor-pointer"
                      onClick={() => openRequest(request.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          openRequest(request.id);
                        }
                      }}
                      tabIndex={0}
                      role="link"
                      aria-label={`View request for ${request.patientName}`}
                    >
                      <TableCell className="font-medium">
                        {request.patientName}
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {request.hospital?.hospitalName ?? "—"}
                      </TableCell>

                      <TableCell className="font-semibold">
                        {BLOOD_GROUP_LABELS[request.bloodGroup] ??
                          request.bloodGroup}
                      </TableCell>

                      <TableCell>
                        <UrgencyBadge urgency={request.urgency} />
                      </TableCell>

                      <TableCell>
                        <RequestStatusBadge status={request.status} />
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
