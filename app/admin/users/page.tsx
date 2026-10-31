"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Activity,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";

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
  useAdminUsers,
  useUpdateUserRole,
  useUpdateUserStatus,
} from "@/hooks/use-admin-users";

import type { Role } from "@/types";

export default function AdminUsersPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-5">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      }
    >
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
  } = useAdminUsers({
    page,
    limit: 10,
    role,
    isActive:
      isActive === undefined ? undefined : isActive === "true",
    search: search || undefined,
  });

  const updateRole = useUpdateUserRole();
  const updateStatus = useUpdateUserStatus();

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

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedSearch = searchInput.trim();
    setParam("search", trimmedSearch || undefined);
  }

  function clearSearch() {
    setSearchInput("");
    setParam("search", undefined);
  }

  const totalUsers = data?.meta?.total ?? 0;

  const activeFilterCount = [
    role,
    isActive,
    search,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6 pb-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
            <Users className="h-5 w-5" />
          </div>

          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">
              User Management
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage registered users, roles and account status.
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isLoading}
          className="gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border bg-gradient-to-br from-rose-500/10 to-pink-500/5 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Users
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold">
                {isLoading ? (
                  <Skeleton className="h-9 w-20" />
                ) : (
                  totalUsers.toLocaleString()
                )}
              </h2>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Registered accounts on RaktoSheba
          </p>
        </div>

        <div className="rounded-2xl border bg-gradient-to-br from-blue-500/10 to-cyan-500/5 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Current Page
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold">
                {page}
              </h2>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Showing up to 10 users per page
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border bg-card p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-semibold">Search & Filters</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Find users by name, email, role or account status.
            </p>
          </div>

          {activeFilterCount > 0 && (
            <Badge variant="secondary">
              {activeFilterCount} active filter
              {activeFilterCount > 1 ? "s" : ""}
            </Badge>
          )}
        </div>

        <div className="flex flex-col gap-3 lg:flex-row">
          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="flex min-w-0 flex-1 gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search by name or email..."
                className="h-10 pl-9 pr-9"
              />

              {searchInput && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Clear search input"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Button type="submit" className="h-10 gap-2">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </Button>
          </form>

          {/* Role Filter */}
          <Select
            value={role ?? "ALL"}
            onValueChange={(value) =>
              setParam("role", value === "ALL" ? undefined : value)
            }
          >
            <SelectTrigger className="h-10 w-full lg:w-[160px]">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All roles</SelectItem>
              <SelectItem value="DONOR">Donor</SelectItem>
              <SelectItem value="HOSPITAL">Hospital</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={isActive ?? "ALL"}
            onValueChange={(value) =>
              setParam(
                "isActive",
                value === "ALL" ? undefined : value
              )
            }
          >
            <SelectTrigger className="h-10 w-full lg:w-[160px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              <SelectItem value="true">Active</SelectItem>
              <SelectItem value="false">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        {activeFilterCount > 0 && (
          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchInput("");
                router.push(pathname);
              }}
              className="gap-2 text-muted-foreground"
            >
              <X className="h-4 w-4" />
              Clear all filters
            </Button>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="flex flex-col gap-2 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">Registered Users</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Manage platform accounts and permissions.
            </p>
          </div>

          {data && !isLoading && (
            <Badge variant="outline" className="w-fit">
              {data.items.length} users on this page
            </Badge>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-3 p-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-14 w-full rounded-lg"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="p-5">
            <ErrorState
              message="Couldn't load users. Please check your connection and try again."
              onRetry={() => refetch()}
            />
          </div>
        )}

        {/* Empty State */}
        {data && !isLoading && data.items.length === 0 && (
          <div className="p-8 text-center">
            <EmptyState
              icon={Users}
              title="No users found"
            />
            <p className="mt-2 text-sm text-muted-foreground">
              Try changing your search or filters to find users.
            </p>
          </div>
        )}

        {/* Table Data */}
        {data && !isLoading && data.items.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="min-w-[190px]">User</TableHead>
                    <TableHead className="min-w-[220px]">Email Address</TableHead>
                    <TableHead className="min-w-[150px]">Role</TableHead>
                    <TableHead className="min-w-[120px]">Status</TableHead>
                    <TableHead className="min-w-[150px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data.items.map((user) => (
                    <TableRow
                      key={user.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      {/* User */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-100 text-sm font-semibold text-rose-600">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium">
                              {user.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              User account
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Email */}
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {user.email}
                        </span>
                      </TableCell>

                      {/* Role */}
                      <TableCell>
                        {user.role === "ADMIN" ? (
                          <Badge
                            variant="outline"
                            className="gap-1 border-purple-200 bg-purple-50 text-purple-700"
                          >
                            <ShieldCheck className="h-3 w-3" />
                            Admin
                          </Badge>
                        ) : (
                          <Select
                            value={user.role}
                            disabled={updateRole.isPending}
                            onValueChange={(value) =>
                              updateRole.mutate({
                                id: user.id,
                                role: value as Role,
                              })
                            }
                          >
                            <SelectTrigger className="h-8 w-[125px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DONOR">Donor</SelectItem>
                              <SelectItem value="HOSPITAL">Hospital</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          variant={user.isActive ? "default" : "destructive"}
                          className={`gap-1 ${user.isActive ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${user.isActive ? "bg-white" : "bg-white"
                              }`}
                          />
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        {user.role !== "ADMIN" &&
                          (user.isActive ? (
                            <ReasonDialog
                              trigger="Deactivate"
                              title={`Deactivate ${user.name}?`}
                              description="This user will no longer be able to log in or use the platform."
                              confirmLabel="Deactivate"
                              loading={updateStatus.isPending}
                              onConfirm={(reason) =>
                                updateStatus.mutate({
                                  id: user.id,
                                  isActive: false,
                                  reason,
                                })
                              }
                            />
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={updateStatus.isPending}
                              onClick={() =>
                                updateStatus.mutate({
                                  id: user.id,
                                  isActive: true,
                                })
                              }
                            >
                              Reactivate
                            </Button>
                          ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="border-t p-4">
              <PaginationControls meta={data.meta} />
            </div>
          </>
        )}
      </div>

      {/* Footer Information */}
      <div className="flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-blue-800 dark:border-blue-900 dark:bg-blue-950/20 dark:text-blue-300">
        <UserRound className="mt-0.5 h-4 w-4 shrink-0" />
        <p className="text-xs leading-relaxed">
          Admin accounts are protected from role changes and account
          deactivation through this page. Manage other user permissions
          carefully.
        </p>
      </div>
    </div>
  );
}