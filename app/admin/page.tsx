"use client";

import {
  Activity,
  Droplets,
  HeartHandshake,
  Hospital,
  MapPin,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "@/hooks/use-admin";

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  ACCEPTED: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-indigo-100 text-indigo-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-rose-100 text-rose-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function AdminOverviewPage() {
  const { data: stats, isLoading, isError, refetch } = useDashboardStats();

  const statCards = stats
    ? [
      {
        label: "Total Donors",
        value: stats.donors?.total ?? 0,
        sub: `${stats.donors?.available ?? 0} currently available`,
        icon: Users,
        iconBg: "bg-rose-100 text-rose-600",
        accent: "from-rose-500/10 to-pink-500/5",
      },
      {
        label: "Registered Hospitals",
        value: stats.hospitals?.total ?? 0,
        sub: `${stats.hospitals?.verified ?? 0} verified`,
        icon: Hospital,
        iconBg: "bg-blue-100 text-blue-600",
        accent: "from-blue-500/10 to-cyan-500/5",
      },
      {
        label: "Blood Requests",
        value: stats.bloodRequests?.createdThisMonth ?? 0,
        sub: "Created this month",
        icon: Droplets,
        iconBg: "bg-orange-100 text-orange-600",
        accent: "from-orange-500/10 to-amber-500/5",
      },
      {
        label: "Completed Donations",
        value: stats.donations?.completedThisMonth ?? 0,
        sub: "Completed this month",
        icon: HeartHandshake,
        iconBg: "bg-emerald-100 text-emerald-600",
        accent: "from-emerald-500/10 to-teal-500/5",
      },
    ]
    : [];

  const cities = stats?.topCitiesByRequests ?? [];
  const maxRequestCount = Math.max(
    ...cities.map((city) => city.requestCount),
    1
  );

  const statusEntries = Object.entries(stats?.bloodRequests?.byStatus ?? {});

  return (
    <div className="space-y-7 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
              <Activity className="h-5 w-5" />
            </div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">
              Dashboard Overview
            </h1>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Monitor your RaktoSheba platform performance and activities.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isLoading}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-36 rounded-2xl" />
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && !isLoading && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-900 dark:bg-rose-950/20">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <Activity className="h-6 w-6" />
          </div>
          <h3 className="mt-3 font-semibold">Unable to load dashboard</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Something went wrong while fetching dashboard statistics.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Statistics Display */}
      {stats && !isLoading && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((item) => {
              const Icon = item.icon;

              return (
                <Card
                  key={item.label}
                  className={`overflow-hidden rounded-2xl border bg-gradient-to-br ${item.accent} transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {item.label}
                        </p>
                        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
                          {item.value.toLocaleString()}
                        </h2>
                      </div>

                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.iconBg}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <TrendingUp className="h-3.5 w-3.5" />
                      {item.sub}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Additional Insights */}
          <div className="grid gap-5 lg:grid-cols-2">
            {/* Request Status */}
            <Card className="rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-base font-semibold">
                    Requests by Status
                  </CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Current blood request distribution
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                  <Droplets className="h-4 w-4" />
                </div>
              </CardHeader>

              <CardContent>
                {statusEntries.length > 0 ? (
                  <div className="space-y-4">
                    {statusEntries.map(([status, count]) => (
                      <div
                        key={status}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${status === "COMPLETED"
                                ? "bg-emerald-500"
                                : status === "PENDING"
                                  ? "bg-amber-500"
                                  : status === "CANCELLED"
                                    ? "bg-rose-500"
                                    : "bg-blue-500"
                              }`}
                          />
                          <span className="text-sm capitalize text-muted-foreground">
                            {status.replace(/_/g, " ").toLowerCase()}
                          </span>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[status] ??
                            "bg-muted text-muted-foreground"
                            }`}
                        >
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState message="No request status data available yet." />
                )}
              </CardContent>
            </Card>

            {/* Top Cities */}
            <Card className="rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-base font-semibold">
                    Top Cities by Requests
                  </CardTitle>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Cities with the highest request activity
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <MapPin className="h-4 w-4" />
                </div>
              </CardHeader>

              <CardContent>
                {cities.length > 0 ? (
                  <div className="space-y-5">
                    {cities.map((city, index) => (
                      <div key={city.city} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-xs font-semibold">
                              {index + 1}
                            </span>
                            <span className="font-medium">{city.city}</span>
                          </div>
                          <span className="font-semibold tabular-nums">
                            {city.requestCount}
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-500"
                            style={{
                              width: `${(city.requestCount / maxRequestCount) * 100
                                }%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState message="No city request data available yet." />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Hospital Verification */}
          <Card className="rounded-2xl">
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold">Hospital Verification</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Track registered and verified hospitals on the platform.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="rounded-xl bg-emerald-50 px-4 py-3 dark:bg-emerald-950/30">
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">
                    Verified
                  </p>
                  <p className="mt-1 text-xl font-bold text-emerald-700 dark:text-emerald-400">
                    {stats.hospitals?.verified ?? 0}
                  </p>
                </div>

                <div className="rounded-xl bg-amber-50 px-4 py-3 dark:bg-amber-950/30">
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    Pending
                  </p>
                  <p className="mt-1 text-xl font-bold text-amber-700 dark:text-amber-400">
                    {stats.hospitals?.pendingVerification ?? 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-28 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-4 text-center">
      <Activity className="h-6 w-6 text-muted-foreground/50" />
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}