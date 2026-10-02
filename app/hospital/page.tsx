"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyHospitalProfile } from "@/hooks/use-hospital";

export default function HospitalOverviewPage() {
  const { data: profile, isLoading, isError } = useMyHospitalProfile();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="rounded-md border border-border bg-card p-6 text-sm text-muted-foreground">
        Couldn&rsquo;t load your hospital profile. Try refreshing the page.
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-medium">{profile.hospitalName}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{profile.city}</p>

      <Card className="mt-6">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm text-muted-foreground">Verification status</p>
            <Badge className="mt-2" variant={profile.isVerified ? "success" : "pending"}>
              {profile.isVerified ? "Verified" : "Pending admin verification"}
            </Badge>
          </div>
          {profile.isVerified ? (
            <Button asChild>
              <Link href="/hospital/requests/new">Post a blood request</Link>
            </Button>
          ) : (
            <p className="max-w-xs text-right text-sm text-muted-foreground">
              An admin needs to verify your hospital before you can post requests.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
