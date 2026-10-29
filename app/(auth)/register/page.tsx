"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  HeartHandshake,
  HeartPulse,
  Hospital,
  MapPin,
  ShieldCheck,
  Droplet,
  UserRound,
  Building2,
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import { useRegisterDonor, useRegisterHospital } from "@/hooks/use-auth";
import {
  registerDonorSchema,
  registerHospitalSchema,
  type RegisterDonorInput,
  type RegisterHospitalInput,
} from "@/lib/validations/auth";
import {
  BLOOD_GROUP_OPTIONS,
  GENDER_OPTIONS,
  BD_CITIES,
} from "@/lib/constants";

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-2">
      {/* Left branding panel */}
      <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-gradient-to-br from-red-800 via-red-700 to-rose-600 p-10 text-white lg:flex xl:p-14">
        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full border border-white/10" />
        <div className="absolute -right-16 top-36 h-64 w-64 rounded-full border border-white/10" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-rose-400/15 blur-3xl" />

        <Link href="/" className="relative inline-flex w-fit items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/20">
            <HeartPulse className="h-6 w-6" />
          </div>
          <span className="font-display text-2xl font-semibold tracking-tight">
            RaktoSheba
          </span>
        </Link>

        <div className="relative max-w-lg">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90">
            <HeartHandshake className="h-4 w-4" />
            Join the life-saving community
          </div>

          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
            Be the reason{" "}
            <span className="text-rose-200">someone gets another chance.</span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-8 text-white/80">
            Create your RaktoSheba account to help connect people in need of
            blood with potential donors and support emergency coordination.
          </p>

          <div className="mt-10 space-y-4">
            {[
              {
                title: "For blood donors",
                description: "Create your profile and manage your availability.",
                icon: Droplet,
              },
              {
                title: "For hospitals",
                description: "Register your institution to coordinate requests.",
                icon: Hospital,
              },
              {
                title: "Built around trust",
                description: "Support a more organized donation process.",
                icon: ShieldCheck,
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
                    <Icon className="h-5 w-5 text-rose-100" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-1 text-sm leading-5 text-white/70">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="relative text-xs leading-5 text-white/60">
          Blood Donation &amp; Emergency Assistance Platform
          <span className="mt-1 block">
            Made to bring people together when it matters.
          </span>
        </p>
      </section>

      {/* Registration panel */}
      <section className="flex min-h-screen flex-col px-5 py-6 sm:px-8 lg:justify-center lg:px-10 xl:px-16">
        <div className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center lg:flex-none">
          <Link
            href="/"
            className="mb-7 inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="mb-7 lg:hidden">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-700 to-rose-500 text-white">
                <HeartPulse className="h-5 w-5" />
              </span>
              <span className="font-display text-xl font-semibold">
                RaktoSheba
              </span>
            </Link>
          </div>

          <div>
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
              <UserRound className="h-6 w-6" />
            </div>

            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Create your account
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Choose your account type and fill in the details to get started.
            </p>
          </div>

          <Tabs defaultValue="donor" className="mt-8">
            <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-2xl bg-muted/70 p-1.5">
              <TabsTrigger
                value="donor"
                className="flex h-auto flex-col gap-2 rounded-xl px-3 py-4 data-[state=active]:bg-background data-[state=active]:text-rose-600 data-[state=active]:shadow-sm dark:data-[state=active]:text-rose-400"
              >
                <Droplet className="h-5 w-5" />
                <span className="font-semibold">Blood Donor</span>
                <span className="text-xs font-normal text-muted-foreground">
                  I want to donate
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="hospital"
                className="flex h-auto flex-col gap-2 rounded-xl px-3 py-4 data-[state=active]:bg-background data-[state=active]:text-rose-600 data-[state=active]:shadow-sm dark:data-[state=active]:text-rose-400"
              >
                <Hospital className="h-5 w-5" />
                <span className="font-semibold">Hospital</span>
                <span className="text-xs font-normal text-muted-foreground">
                  We need blood support
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="donor" className="mt-6">
              <DonorForm />
            </TabsContent>

            <TabsContent value="hospital" className="mt-6">
              <HospitalForm />
            </TabsContent>
          </Tabs>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-rose-600 transition-colors hover:text-rose-700 hover:underline dark:text-rose-400"
            >
              Sign in
            </Link>
          </p>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Please provide accurate information when creating your account.
        </p>
      </section>
    </main>
  );
}

/* Shared form field: city and coordinates */

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
        onValueChange={(selectedValue) => {
          const city = BD_CITIES.find(
            (item) => item.name === selectedValue,
          );

          if (city) {
            onPick(city.name, city.lat, city.lng);
          }
        }}
      >
        <FormControl>
          <SelectTrigger className="h-11 w-full rounded-xl">
            <SelectValue placeholder="Select your city" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {BD_CITIES.map((city) => (
            <SelectItem key={city.name} value={city.name}>
              {city.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
}

/* Donor registration */

function DonorForm() {
  const registerDonor = useRegisterDonor();
  const [showPassword, setShowPassword] = useState(false);

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
    registerDonor.mutate({
      ...values,
      dateOfBirth: new Date(values.dateOfBirth).toISOString(),
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div className="flex items-center gap-3 rounded-xl border border-rose-100 bg-rose-50/70 p-3.5 dark:border-rose-900/50 dark:bg-rose-950/20">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
            <Droplet className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">Donor registration</p>
            <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
              Add your details to create your donor profile.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your full name"
                    autoComplete="name"
                    className="h-11 rounded-xl"
                    {...field}
                    value={field.value || ""}
                  />
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
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="+8801XXXXXXXXX"
                    autoComplete="tel"
                    className="h-11 rounded-xl"
                    {...field}
                    value={field.value || ""}
                  />
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
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="h-11 rounded-xl"
                  {...field}
                  value={field.value || ""}
                />
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
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    className="h-11 rounded-xl pr-12"
                    {...field}
                    value={field.value || ""}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="bloodGroup"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blood group</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger className="h-11 w-full rounded-xl">
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {BLOOD_GROUP_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
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
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger className="h-11 w-full rounded-xl">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {GENDER_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of birth</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    autoComplete="bday"
                    className="h-11 rounded-xl"
                    {...field}
                    value={field.value || ""}
                  />
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
                    min="0"
                    step="0.1"
                    placeholder="e.g. 60"
                    className="h-11 rounded-xl"
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    value={field.value ?? ""}
                    onChange={(event) => {
                      const value = event.target.value;
                      field.onChange(value === "" ? undefined : Number(value));
                    }}
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
              <FormLabel>Full address</FormLabel>
              <FormControl>
                <Input
                  placeholder="House, road, area"
                  autoComplete="street-address"
                  className="h-11 rounded-xl"
                  {...field}
                  value={field.value || ""}
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

        <div className="flex items-start gap-2 rounded-xl bg-muted/60 p-3.5">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-xs leading-5 text-muted-foreground">
            Your selected city helps the platform determine your approximate
            location for potential donor matching.
          </p>
        </div>

        <Button
          type="submit"
          className="h-12 w-full rounded-xl bg-gradient-to-r from-red-700 to-rose-600 font-semibold text-white shadow-md shadow-rose-600/15 transition-all hover:from-red-800 hover:to-rose-700"
          disabled={registerDonor.isPending}
        >
          {registerDonor.isPending ? (
            "Creating account..."
          ) : (
            <>
              Create donor account
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}

/* Hospital registration */

function HospitalForm() {
  const registerHospital = useRegisterHospital();
  const [showPassword, setShowPassword] = useState(false);

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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div className="flex items-center gap-3 rounded-xl border border-sky-100 bg-sky-50/70 p-3.5 dark:border-sky-900/50 dark:bg-sky-950/20">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400">
            <Hospital className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold">Hospital registration</p>
            <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
              Register your institution and contact representative.
            </p>
          </div>
        </div>

        <FormField
          control={form.control}
          name="hospitalName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hospital or institution name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter official hospital name"
                  className="h-11 rounded-xl"
                  {...field}
                  value={field.value || ""}
                />
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
                <Input
                  placeholder="Official registration number"
                  className="h-11 rounded-xl"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact person</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Full name"
                    autoComplete="name"
                    className="h-11 rounded-xl"
                    {...field}
                    value={field.value || ""}
                  />
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
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="+8801XXXXXXXXX"
                    autoComplete="tel"
                    className="h-11 rounded-xl"
                    {...field}
                    value={field.value || ""}
                  />
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
              <FormLabel>Official email address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="contact@hospital.com"
                  autoComplete="email"
                  className="h-11 rounded-xl"
                  {...field}
                  value={field.value || ""}
                />
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
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    className="h-11 rounded-xl pr-12"
                    {...field}
                    value={field.value || ""}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
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
              <FormLabel>Hospital address</FormLabel>
              <FormControl>
                <Input
                  placeholder="Street, area, or full address"
                  autoComplete="street-address"
                  className="h-11 rounded-xl"
                  {...field}
                  value={field.value || ""}
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

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/60 dark:bg-amber-950/20">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400" />
            <div>
              <p className="text-sm font-semibold text-amber-950 dark:text-amber-200">
                Verification required
              </p>
              <p className="mt-1 text-xs leading-5 text-amber-900/80 dark:text-amber-200/80">
                Your hospital account will require administrator verification
                before you can post blood requests.
              </p>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="h-12 w-full rounded-xl bg-gradient-to-r from-red-700 to-rose-600 font-semibold text-white shadow-md shadow-rose-600/15 transition-all hover:from-red-800 hover:to-rose-700"
          disabled={registerHospital.isPending}
        >
          {registerHospital.isPending ? (
            "Creating account..."
          ) : (
            <>
              Create hospital account
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
