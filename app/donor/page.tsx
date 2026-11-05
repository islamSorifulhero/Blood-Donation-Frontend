
"use client";

import {
  Droplet,
  Heart,
  CalendarDays,
  MapPin,
  Activity,
  ShieldCheck,
  HeartHandshake,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import {
  useMyDonorProfile,
  useUpdateMyDonorProfile,
} from "@/hooks/use-donor";

import { BLOOD_GROUP_LABELS } from "@/lib/constants";

export default function DonorOverviewPage() {
  const {
    data: profile,
    isLoading,
    isError,
  } = useMyDonorProfile();

  const updateProfile = useUpdateMyDonorProfile();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-xl" />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-36 rounded-xl" />
          ))}
        </div>

        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
          <Activity className="size-6 text-muted-foreground" />
        </div>

        <h2 className="mt-4 font-semibold">
          Unable to load donor profile
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Couldn't load your donor profile. Please refresh the page and try again.
        </p>
      </div>
    );
  }

  const bloodGroup =
    BLOOD_GROUP_LABELS[profile.bloodGroup] ?? profile.bloodGroup;

  const lastDonation = profile.lastDonationDate
    ? new Date(profile.lastDonationDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    : "Never yet";

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <Badge variant="outline" className="mb-4 gap-1.5">
            <Heart className="size-3.5" />
            Donor Dashboard
          </Badge>

          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Welcome back!
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Every donation can make a difference. Keep your donor profile
            updated and stay ready to help someone in need.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4" />
            <span>{profile.city}</span>
          </div>
        </div>

        <div className="pointer-events-none absolute -right-8 -top-8 hidden size-56 items-center justify-center rounded-full bg-primary/5 sm:flex">
          <div className="flex size-36 items-center justify-center rounded-full bg-primary/10">
            <HeartHandshake className="size-20 text-primary/50" />
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {/* Blood Group */}
        <Card className="overflow-hidden">
          <CardContent className="relative p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Blood Group
              </p>

              <div className="rounded-xl bg-red-500/10 p-2.5 text-red-600">
                <Droplet className="size-5" />
              </div>
            </div>

            <p className="mt-4 font-display text-4xl font-bold tracking-tight">
              {bloodGroup}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Your registered blood group
            </p>
          </CardContent>
        </Card>

        {/* Total Donations */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Total Donations
              </p>

              <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-600">
                <Heart className="size-5" />
              </div>
            </div>

            <p className="mt-4 font-display text-4xl font-bold tracking-tight">
              {profile.totalDonations}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Recorded donations
            </p>
          </CardContent>
        </Card>

        {/* Last Donation */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                Last Donation
              </p>

              <div className="rounded-xl bg-blue-500/10 p-2.5 text-blue-600">
                <CalendarDays className="size-5" />
              </div>
            </div>

            <p className="mt-4 font-display text-2xl font-bold tracking-tight">
              {lastDonation}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {profile.lastDonationDate
                ? "Your latest recorded donation"
                : "No donation recorded yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Availability */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-border bg-muted/20">
          <div className="flex items-center gap-2">
            <Activity className="size-5 text-primary" />
            <CardTitle className="text-base">
              Donation Availability
            </CardTitle>
          </div>

          <p className="text-sm text-muted-foreground">
            Manage whether hospitals can find you for blood donation requests.
          </p>
        </CardHeader>

        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div
                className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${profile.isAvailable
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-muted text-muted-foreground"
                  }`}
              >
                {profile.isAvailable ? (
                  <ShieldCheck className="size-5" />
                ) : (
                  <Activity className="size-5" />
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">
                    {profile.isAvailable
                      ? "You are available"
                      : "You are currently unavailable"}
                  </h3>

                  <Badge
                    variant={profile.isAvailable ? "default" : "outline"}
                  >
                    {profile.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </div>

                <p className="mt-1 max-w-lg text-sm leading-relaxed text-muted-foreground">
                  {profile.isAvailable
                    ? "Your profile can be considered for matching with blood requests."
                    : "Your profile is currently not available for donor matching."}
                </p>

                <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="size-3.5" />
                  {profile.city}
                </div>
              </div>
            </div>

            <Button
              variant={profile.isAvailable ? "outline" : "default"}
              loading={updateProfile.isPending}
              disabled={updateProfile.isPending}
              onClick={() =>
                updateProfile.mutate({
                  isAvailable: !profile.isAvailable,
                })
              }
              className="w-full shrink-0 sm:w-auto"
            >
              {profile.isAvailable
                ? "Mark unavailable"
                : "Mark available"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer Message */}
      <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/20 p-4">
        <Heart className="mt-0.5 size-5 shrink-0 text-primary" />

        <div>
          <p className="text-sm font-semibold">
            Be someone's reason to smile
          </p>

          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Your willingness to donate can help save lives. Keep your
            information accurate and update your availability whenever
            your situation changes.
          </p>
        </div>
      </div>
    </div>
  );
}
