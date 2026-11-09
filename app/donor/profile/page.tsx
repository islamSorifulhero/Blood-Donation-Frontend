
"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  UserRound,
  Droplet,
  CalendarDays,
  Weight,
  MapPin,
  HeartPulse,
  ShieldCheck,
  Save,
  ClipboardList,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { ErrorState } from "@/components/shared/error-state";
import {
  useMyDonorProfile,
  useUpdateMyDonorProfile,
} from "@/hooks/use-donor";

import {
  BD_CITIES,
  BLOOD_GROUP_LABELS,
  GENDER_OPTIONS,
} from "@/lib/constants";

const schema = z.object({
  address: z.string().min(3),
  city: z.string().min(2),
  medicalNotes: z.string().max(1000).optional(),
});

type FormValues = z.infer<typeof schema>;

function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Skeleton className="h-40 w-full rounded-2xl" />

      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>

      <Skeleton className="h-80 w-full rounded-2xl" />
    </div>
  );
}

function formatDate(date?: string | null) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function DonorProfilePage() {
  const {
    data: profile,
    isLoading,
    isError,
    refetch,
  } = useMyDonorProfile();

  const updateProfile = useUpdateMyDonorProfile();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      address: "",
      city: "",
      medicalNotes: "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        address: profile.address ?? "",
        city: profile.city,
        medicalNotes: profile.medicalNotes ?? "",
      });
    }
  }, [profile, form]);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError || !profile) {
    return (
      <ErrorState
        message="Couldn't load your profile."
        onRetry={() => refetch()}
      />
    );
  }

  const gender =
    GENDER_OPTIONS.find((g) => g.value === profile.gender)?.label ?? "—";

  const bloodGroup =
    BLOOD_GROUP_LABELS[profile.bloodGroup] ?? profile.bloodGroup;

  const profileDetails = [
    {
      label: "Blood group",
      value: bloodGroup,
      icon: Droplet,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      isBloodGroup: true,
    },
    {
      label: "Gender",
      value: gender,
      icon: UserRound,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Date of birth",
      value: formatDate(profile.dateOfBirth),
      icon: CalendarDays,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      label: "Weight",
      value: profile.weightKg ? `${profile.weightKg} kg` : "—",
      icon: Weight,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Profile Header */}
      <div className="relative overflow-hidden rounded-2xl border border-red-100 bg-gradient-to-br from-red-50 via-white to-rose-50 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-100 bg-white/80 px-3 py-1 text-xs font-semibold text-red-600">
              <UserRound className="h-3.5 w-3.5" />
              Donor Account
            </div>

            <h1 className="font-display text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
              My Profile
            </h1>

            <p className="mt-2 max-w-lg text-sm leading-6 text-gray-600 sm:text-base">
              Manage your personal information and keep your donor
              profile up to date.
            </p>
          </div>

          <div className="flex h-20 w-20 shrink-0 items-center justify-center self-start rounded-2xl bg-red-100 text-red-600 sm:h-24 sm:w-24">
            <UserRound className="h-10 w-10 sm:h-12 sm:w-12" />
          </div>
        </div>

        <div className="pointer-events-none absolute -bottom-16 -right-10 h-48 w-48 rounded-full bg-red-100/50 blur-2xl" />
      </div>

      {/* Donor Identity */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <ShieldCheck className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-semibold text-foreground">
              Donor identity
            </h2>
            <p className="text-xs text-muted-foreground">
              Your basic donor information
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {profileDetails.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.label} className="shadow-sm">
                <CardContent className="flex items-center gap-4 p-5">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">
                      {item.label}
                    </p>

                    <div className="mt-1">
                      {item.isBloodGroup ? (
                        <Badge className="bg-red-600 text-white hover:bg-red-700">
                          {item.value}
                        </Badge>
                      ) : (
                        <p className="truncate font-semibold text-foreground">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Contact & Location Form */}
      <Card className="overflow-hidden shadow-sm">
        <CardHeader className="border-b border-border bg-muted/20 px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <MapPin className="h-5 w-5" />
            </div>

            <div>
              <CardTitle className="text-base">
                Contact & Location
              </CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                Update your address and location details
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) =>
                updateProfile.mutate(values)
              )}
              className="space-y-5"
            >
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your city" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {BD_CITIES.map((city) => (
                          <SelectItem
                            key={city.name}
                            value={city.name}
                          >
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="border-t border-border pt-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                    <ClipboardList className="h-4 w-4" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">
                      Medical information
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Optional information for your donor profile
                    </p>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="medicalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medical notes (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          maxLength={1000}
                          placeholder="Mention any relevant medical information..."
                          {...field}
                        />
                      </FormControl>

                      <p className="text-xs text-muted-foreground">
                        Maximum 1000 characters.
                      </p>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground">
                  Make sure your information is accurate.
                </p>

                <Button
                  type="submit"
                  loading={updateProfile.isPending}
                  disabled={updateProfile.isPending}
                  className="w-full sm:w-auto"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Privacy Note */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50/70 p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

        <div>
          <h3 className="text-sm font-semibold text-blue-900">
            Keep your profile updated
          </h3>

          <p className="mt-1 text-xs leading-5 text-blue-800">
            Accurate contact and medical information helps hospitals
            communicate with you. Medical notes are optional, and
            hospital staff may still need to perform their own medical
            screening before donation.
          </p>
        </div>
      </div>
    </div>
  );
}
