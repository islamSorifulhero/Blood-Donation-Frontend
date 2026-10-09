"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ErrorState } from "@/components/shared/error-state";
import { useMyDonorProfile, useUpdateMyDonorProfile } from "@/hooks/use-donor";
import { BD_CITIES, BLOOD_GROUP_LABELS, GENDER_OPTIONS } from "@/lib/constants";

const schema = z.object({
  address: z.string().min(3),
  city: z.string().min(2),
  medicalNotes: z.string().max(1000).optional(),
});
type FormValues = z.infer<typeof schema>;

export default function DonorProfilePage() {
  const { data: profile, isLoading, isError, refetch } = useMyDonorProfile();
  const updateProfile = useUpdateMyDonorProfile();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { address: "", city: "", medicalNotes: "" },
  });

  useEffect(() => {
    if (profile) {
      form.reset({ address: profile.address ?? "", city: profile.city, medicalNotes: profile.medicalNotes ?? "" });
    }
  }, [profile]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (isError || !profile) {
    return <ErrorState message="Couldn't load your profile." onRetry={() => refetch()} />;
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-2xl font-medium">Profile</h1>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Donor identity</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Blood group</p>
            <Badge className="mt-1">{BLOOD_GROUP_LABELS[profile.bloodGroup]}</Badge>
          </div>
          <div>
            <p className="text-muted-foreground">Gender</p>
            <p className="mt-1 font-medium">{GENDER_OPTIONS.find((g) => g.value === profile.gender)?.label ?? "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Date of birth</p>
            <p className="mt-1 font-medium">{profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Weight</p>
            <p className="mt-1 font-medium">{profile.weightKg ? `${profile.weightKg} kg` : "—"}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Contact &amp; location</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((values) => updateProfile.mutate(values))} className="space-y-4">
              <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {BD_CITIES.map((c) => <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="medicalNotes" render={({ field }) => (
                <FormItem>
                  <FormLabel>Medical notes (optional)</FormLabel>
                  <FormControl><Textarea rows={3} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" loading={updateProfile.isPending}>
                Save changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}