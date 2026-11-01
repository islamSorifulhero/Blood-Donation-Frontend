"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Hospital as HospitalIcon, Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
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
  useAdminHospitals,
  useVerifyHospital,
} from "@/hooks/use-admin-hospitals";

export default function AdminHospitalsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full rounded-2xl" />}>
      <AdminHospitalsContent />
    </Suspense>
  );
}

function AdminHospitalsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const isVerified = searchParams.get("isVerified") ?? undefined;
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
  } = useAdminHospitals({
    page,
    limit: 10,
    isVerified:
      isVerified === undefined ? undefined : isVerified === "true",
    search: search || undefined,
  });

  const verifyHospital = useVerifyHospital();

  function setParam(key: string, value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.set("page", "1");

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setParam("search", searchInput.trim() || undefined);
  }

  function clearFilters() {
    setSearchInput("");
    router.push(pathname);
  }

  const hasFilters = Boolean(search || isVerified);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          Hospitals
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Verify hospitals before they can post blood requests.
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border bg-card p-4 sm:p-5">
        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              className="h-10 pl-9 pr-10"
              placeholder="Search hospital name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />

            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  setParam("search", undefined);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Select
            value={isVerified ?? "ALL"}
            onValueChange={(value) =>
              setParam(
                "isVerified",
                value === "ALL" ? undefined : value
              )
            }
          >
            <SelectTrigger className="h-10 w-full sm:w-[190px]">
              <SelectValue placeholder="Verification status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">All hospitals</SelectItem>
              <SelectItem value="false">Pending verification</SelectItem>
              <SelectItem value="true">Verified</SelectItem>
            </SelectContent>
          </Select>

          <Button type="submit" className="h-10 gap-2">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search</span>
          </Button>

          {hasFilters && (
            <Button
              type="button"
              variant="outline"
              onClick={clearFilters}
              className="h-10 shrink-0 gap-2 text-muted-foreground"
            >
              <X className="h-4 w-4" />
              Clear filters
            </Button>
          )}
        </form>
      </div>

      {/* Hospitals Table */}
      <div className="overflow-hidden rounded-2xl border bg-card">
        {isLoading && (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        )}

        {!isLoading && isError && (
          <div className="p-5">
            <ErrorState
              message="Couldn't load hospitals. Please check your connection."
              onRetry={() => refetch()}
            />
          </div>
        )}

        {!isLoading && !isError && data?.items.length === 0 && (
          <div className="p-8 text-center">
            <EmptyState
              icon={HospitalIcon}
              title="No hospitals found"
            />
            <p className="mt-2 text-sm text-muted-foreground">
              Try changing your search or verification filters.
            </p>
          </div>
        )}

        {!isLoading && !isError && data && data.items.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead>Hospital</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Registration no.</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data.items.map((hospital) => (
                    <TableRow key={hospital.id} className="transition-colors hover:bg-muted/30">
                      <TableCell>
                        <div className="font-medium">
                          {hospital.hospitalName}
                        </div>
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {hospital.city}
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {hospital.registrationNumber || "—"}
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={hospital.isVerified ? "default" : "secondary"}
                          className={`gap-1 ${hospital.isVerified ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}`}
                        >
                          {hospital.isVerified ? "Verified" : "Pending"}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        {hospital.isVerified ? (
                          <ReasonDialog
                            trigger="Revoke"
                            title={`Revoke verification for ${hospital.hospitalName}?`}
                            description="They won't be able to post new blood requests until re-verified."
                            confirmLabel="Revoke"
                            loading={verifyHospital.isPending}
                            onConfirm={(reason) =>
                              verifyHospital.mutate({
                                id: hospital.id,
                                isVerified: false,
                                remarks: reason,
                              })
                            }
                          />
                        ) : (
                          <Button
                            size="sm"
                            variant="default"
                            disabled={verifyHospital.isPending}
                            onClick={() =>
                              verifyHospital.mutate({
                                id: hospital.id,
                                isVerified: true,
                              })
                            }
                          >
                            Verify
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="border-t p-4">
              <PaginationControls meta={data.meta} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}