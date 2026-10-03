"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Hospital as HospitalIcon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { ReasonDialog } from "@/components/shared/reason-dialog";
import { useAdminHospitals, useVerifyHospital } from "@/hooks/use-admin-hospitals";

export default function AdminHospitalsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
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
  const search = searchParams.get("search") ?? undefined;

  const { data, isLoading, isError, refetch } = useAdminHospitals({
    page,
    limit: 10,
    isVerified: isVerified === undefined ? undefined : isVerified === "true",
    search,
  });
  const verifyHospital = useVerifyHospital();

  function setParam(key: string, value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-medium">Hospitals</h1>
      <p className="mt-1 text-sm text-muted-foreground">Verify hospitals before they can post blood requests.</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search hospital name..."
            defaultValue={search}
            onKeyDown={(e) => e.key === "Enter" && setParam("search", (e.target as HTMLInputElement).value)}
          />
        </div>
        <Select value={isVerified ?? "ALL"} onValueChange={(v) => setParam("isVerified", v === "ALL" ? undefined : v)}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Verification" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="false">Pending verification</SelectItem>
            <SelectItem value="true">Verified</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-card">
        {isLoading && (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
          </div>
        )}

        {isError && <ErrorState message="Couldn't load hospitals." onRetry={() => refetch()} />}

        {data && data.items.length === 0 && (
          <EmptyState icon={HospitalIcon} title="No hospitals match these filters" />
        )}

        {data && data.items.length > 0 && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hospital</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Registration no.</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((h) => (
                  <TableRow key={h.id}>
                    <TableCell className="font-medium">{h.hospitalName}</TableCell>
                    <TableCell>{h.city}</TableCell>
                    <TableCell className="text-muted-foreground">{h.registrationNumber}</TableCell>
                    <TableCell>
                      <Badge variant={h.isVerified ? "success" : "pending"}>
                        {h.isVerified ? "Verified" : "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {h.isVerified ? (
                        <ReasonDialog
                          trigger="Revoke"
                          title={`Revoke verification for ${h.hospitalName}?`}
                          description="They won't be able to post new blood requests until re-verified."
                          confirmLabel="Revoke"
                          loading={verifyHospital.isPending}
                          onConfirm={(reason) => verifyHospital.mutate({ id: h.id, isVerified: false, remarks: reason })}
                        />
                      ) : (
                        <Button
                          size="sm"
                          variant="success"
                          loading={verifyHospital.isPending}
                          onClick={() => verifyHospital.mutate({ id: h.id, isVerified: true })}
                        >
                          Verify
                        </Button>
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
