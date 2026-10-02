"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardStats } from "@/hooks/use-admin";

export default function AdminOverviewPage() {
  const { data: stats, isLoading, isError } = useDashboardStats();

  return (
    <div>
      <h1 className="font-display text-2xl font-medium">Overview</h1>
      <p className="mt-1 text-sm text-muted-foreground">Platform-wide numbers, live from the database.</p>

      {isLoading && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      )}

      {isError && (
        <div className="mt-6 rounded-md border border-border bg-card p-6 text-sm text-muted-foreground">
          Couldn&rsquo;t load dashboard stats. Check that the API is reachable.
        </div>
      )}

      {stats && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Donors" value={stats.donors.total} sub={`${stats.donors.available} available`} />
          <StatCard
            label="Hospitals"
            value={stats.hospitals.total}
            sub={`${stats.hospitals.verified} verified · ${stats.hospitals.pendingVerification} pending`}
          />
          <StatCard label="Requests this month" value={stats.bloodRequests.createdThisMonth} />
          <StatCard label="Donations this month" value={stats.donations.completedThisMonth} />
        </div>
      )}

      {stats && (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Requests by status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(stats.bloodRequests.byStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{status.replace(/_/g, " ")}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top cities by requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {stats.topCitiesByRequests.map((c) => (
                <div key={c.city} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{c.city}</span>
                  <span className="font-medium">{c.requestCount}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-2 font-display text-3xl">{value}</p>
        {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  );
}
