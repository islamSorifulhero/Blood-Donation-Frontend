"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useRegisterDonor, useRegisterHospital } from "@/hooks/use-auth";
import {
  registerDonorSchema,
  registerHospitalSchema,
  type RegisterDonorInput,
  type RegisterHospitalInput,
} from "@/lib/validations/auth";
import { BLOOD_GROUP_OPTIONS, GENDER_OPTIONS, BD_CITIES } from "@/lib/constants";

export default function RegisterPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-16">
      <Link href="/" className="font-display text-2xl">
        RaktoSheba
      </Link>
      <h1 className="mt-8 font-display text-3xl font-medium">Create an account</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Register as a donor to receive match requests, or as a hospital to request blood.
      </p>

      <Tabs defaultValue="donor" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="donor">I&rsquo;m a Donor</TabsTrigger>
          <TabsTrigger value="hospital">I&rsquo;m a Hospital</TabsTrigger>
        </TabsList>
        <TabsContent value="donor">
          <DonorForm />
        </TabsContent>
        <TabsContent value="hospital">
          <HospitalForm />
        </TabsContent>
      </Tabs>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}

function CityField({
  value,
  onPick,
}: {
  value?: string;
  onPick: (city: string, lat: number, lng: number) => void;
}) {
  return (
    <FormItem>
      <FormLabel>City</FormLabel>
      <Select
        value={value || ""}
        onValueChange={(val) => {
          const city = BD_CITIES.find((c) => c.name === val);
          if (city) onPick(city.name, city.lat, city.lng);
        }}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a city" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {BD_CITIES.map((c) => (
            <SelectItem key={c.name} value={c.name}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
}

function DonorForm() {
  const registerDonor = useRegisterDonor();
  const form = useForm<RegisterDonorInput>({
    resolver: zodResolver(registerDonorSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      dateOfBirth: "",
      address: "",
      city: "",
      weightKg: undefined,
      latitude: 0,
      longitude: 0,
    },
  });

  function onSubmit(values: RegisterDonorInput) {
    registerDonor.mutate({ ...values, dateOfBirth: new Date(values.dateOfBirth).toISOString() });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+8801XXXXXXXXX" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="bloodGroup"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blood group</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {BLOOD_GROUP_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {GENDER_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of birth</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weightKg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (kg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <CityField
              value={field.value}
              onPick={(city, lat, lng) => {
                form.setValue("city", city, { shouldValidate: true });
                form.setValue("latitude", lat, { shouldValidate: true });
                form.setValue("longitude", lng, { shouldValidate: true });
              }}
            />
          )}
        />

        <Button type="submit" className="w-full" disabled={registerDonor.isPending}>
          Create donor account
        </Button>
      </form>
    </Form>
  );
}

function HospitalForm() {
  const registerHospital = useRegisterHospital();
  const form = useForm<RegisterHospitalInput>({
    resolver: zodResolver(registerHospitalSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      hospitalName: "",
      registrationNumber: "",
      address: "",
      city: "",
      latitude: 0,
      longitude: 0,
    },
  });

  function onSubmit(values: RegisterHospitalInput) {
    registerHospital.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <FormField
          control={form.control}
          name="hospitalName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hospital name</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="registrationNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Registration number</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact person</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+8801XXXXXXXXX" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <CityField
              value={field.value}
              onPick={(city, lat, lng) => {
                form.setValue("city", city, { shouldValidate: true });
                form.setValue("latitude", lat, { shouldValidate: true });
                form.setValue("longitude", lng, { shouldValidate: true });
              }}
            />
          )}
        />
        <p className="text-xs text-muted-foreground">
          Your account starts unverified — an admin must verify it before you can post blood requests.
        </p>
        <Button type="submit" className="w-full" disabled={registerHospital.isPending}>
          Create hospital account
        </Button>
      </form>
    </Form>
  );
}