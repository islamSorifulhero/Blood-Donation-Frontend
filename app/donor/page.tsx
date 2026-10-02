"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyDonorProfile, useUpdateMyDonorProfile } from "@/hooks/use-donor";
import { BLOOD_GROUP_LABELS } from "@/lib/constants";

export default function DonorOverviewPage() {
  const { data: profile, isLoading, isError } = useMyDonorProfile();
  const updateProfile = useUpdateMyDonorProfile();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="rounded-md border border-border bg-card p-6 text-sm text-muted-foreground">
        Couldn&rsquo;t load your donor profile. Try refreshing the page.
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-medium">Welcome back</h1>
      <p className="mt-1 text-sm text-muted-foreground">Here&rsquo;s your donor status at a glance.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Blood group</p>
            <p className="mt-2 font-display text-3xl">{BLOOD_GROUP_LABELS[profile.bloodGroup]}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total donations</p>
            <p className="mt-2 font-display text-3xl">{profile.totalDonations}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Last donation</p>
            <p className="mt-2 font-display text-xl">
              {profile.lastDonationDate ? new Date(profile.lastDonationDate).toLocaleDateString() : "Never yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Availability</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant={profile.isAvailable ? "success" : "outline"}>
              {profile.isAvailable ? "Available for matching" : "Not available"}
            </Badge>
            <span className="text-sm text-muted-foreground">in {profile.city}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            loading={updateProfile.isPending}
            onClick={() => updateProfile.mutate({ isAvailable: !profile.isAvailable })}
          >
            {profile.isAvailable ? "Mark unavailable" : "Mark available"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
