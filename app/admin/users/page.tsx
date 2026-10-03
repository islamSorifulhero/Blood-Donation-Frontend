"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Users, Search } from "lucide-react";
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
import { useAdminUsers, useUpdateUserRole, useUpdateUserStatus } from "@/hooks/use-admin-users";
import type { Role } from "@/types";

export default function AdminUsersPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <AdminUsersContent />
    </Suspense>
  );
}

function AdminUsersContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const role = searchParams.get("role") ?? undefined;
  const isActive = searchParams.get("isActive") ?? undefined;
  const search = searchParams.get("search") ?? undefined;

  const { data, isLoading, isError, refetch } = useAdminUsers({
    page,
    limit: 10,
    role,
    isActive: isActive === undefined ? undefined : isActive === "true",
    search,
  });
  const updateRole = useUpdateUserRole();
  const updateStatus = useUpdateUserStatus();

  function setParam(key: string, value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-medium">Users</h1>
      <p className="mt-1 text-sm text-muted-foreground">Every registered account on the platform.</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search name or email..."
            defaultValue={search}
            onKeyDown={(e) => e.key === "Enter" && setParam("search", (e.target as HTMLInputElement).value)}
          />
        </div>
        <Select value={role ?? "ALL"} onValueChange={(v) => setParam("role", v === "ALL" ? undefined : v)}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All roles</SelectItem>
            <SelectItem value="DONOR">Donor</SelectItem>
            <SelectItem value="HOSPITAL">Hospital</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>
        <Select value={isActive ?? "ALL"} onValueChange={(v) => setParam("isActive", v === "ALL" ? undefined : v)}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-card">
        {isLoading && (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
          </div>
        )}

        {isError && <ErrorState message="Couldn't load users." onRetry={() => refetch()} />}

        {data && data.items.length === 0 && (
          <EmptyState icon={Users} title="No users match these filters" />
        )}

        {data && data.items.length > 0 && (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell className="text-muted-foreground">{u.email}</TableCell>
                    <TableCell>
                      {u.role === "ADMIN" ? (
                        <Badge variant="outline">Admin</Badge>
                      ) : (
                        <Select value={u.role} onValueChange={(v) => updateRole.mutate({ id: u.id, role: v as Role })}>
                          <SelectTrigger className="h-8 w-[120px]"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DONOR">Donor</SelectItem>
                            <SelectItem value="HOSPITAL">Hospital</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.isActive ? "success" : "destructive"}>{u.isActive ? "Active" : "Inactive"}</Badge>
                    </TableCell>
                    <TableCell>
                      {u.role !== "ADMIN" &&
                        (u.isActive ? (
                          <ReasonDialog
                            trigger="Deactivate"
                            title={`Deactivate ${u.name}?`}
                            description="They will no longer be able to log in or use the platform."
                            confirmLabel="Deactivate"
                            loading={updateStatus.isPending}
                            onConfirm={(reason) => updateStatus.mutate({ id: u.id, isActive: false, reason })}
                          />
                        ) : (
                          <Button size="sm" variant="outline" loading={updateStatus.isPending} onClick={() => updateStatus.mutate({ id: u.id, isActive: true })}>
                            Reactivate
                          </Button>
                        ))}
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
