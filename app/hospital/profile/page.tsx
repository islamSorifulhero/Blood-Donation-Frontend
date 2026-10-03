"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ErrorState } from "@/components/shared/error-state";
import { useMyHospitalProfile, useUpdateMyHospitalProfile } from "@/hooks/use-hospital";
import { BD_CITIES } from "@/lib/constants";

const schema = z.object({
  hospitalName: z.string().min(2).max(150),
  address: z.string().min(3),
  city: z.string().min(2),
});
type FormValues = z.infer<typeof schema>;

export default function HospitalProfilePage() {
  const { data: profile, isLoading, isError, refetch } = useMyHospitalProfile();
  const updateProfile = useUpdateMyHospitalProfile();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { hospitalName: "", address: "", city: "" },
  });

  useEffect(() => {
    if (profile) {
      form.reset({ hospitalName: profile.hospitalName, address: profile.address, city: profile.city });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    return <ErrorState message="Couldn't load your hospital profile." onRetry={() => refetch()} />;
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-2xl font-medium">Hospital profile</h1>
      <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
        <Badge variant={profile.isVerified ? "success" : "pending"}>
          {profile.isVerified ? "Verified" : "Pending verification"}
        </Badge>
        <span>Reg. no. {profile.registrationNumber}</span>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Edit details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((values) => updateProfile.mutate(values))} className="space-y-4">
              <FormField control={form.control} name="hospitalName" render={({ field }) => (
                <FormItem><FormLabel>Hospital name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
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
