"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  HeartPulse,
  ShieldCheck,
  Hospital,
  Droplet,
  HeartHandshake,
  LockKeyhole,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useLogin } from "@/hooks/use-auth";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { DEMO_ACCOUNTS } from "@/lib/constants";

const demoOptions = [
  {
    role: "ADMIN" as const,
    label: "Admin",
    description: "Manage the platform",
    icon: ShieldCheck,
  },
  {
    role: "DONOR" as const,
    label: "Donor",
    description: "Help save lives",
    icon: Droplet,
  },
  {
    role: "HOSPITAL" as const,
    label: "Hospital",
    description: "Manage blood requests",
    icon: Hospital,
  },
];

export default function LoginPage() {
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginInput) {
    login.mutate(values);
  }

  function demoLogin(role: keyof typeof DEMO_ACCOUNTS) {
    login.mutate(DEMO_ACCOUNTS[role]);
  }

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-2">
      {/* Brand panel */}
      <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-gradient-to-br from-red-800 via-red-700 to-rose-600 p-10 text-white lg:flex xl:p-14">
        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full border border-white/10" />
        <div className="absolute -right-16 top-36 h-64 w-64 rounded-full border border-white/10" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-rose-400/15 blur-3xl" />

        <Link
          href="/"
          className="relative inline-flex w-fit items-center gap-3"
        >
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
            Connecting people. Saving lives.
          </div>

          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
            One connection can make{" "}
            <span className="text-rose-200">all the difference.</span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-8 text-white/80">
            Sign in to RaktoSheba to manage your account, connect with potential
            blood donors, and support emergency blood coordination.
          </p>

          <div className="mt-10 space-y-4">
            {[
              "Connect donors with potential blood requests",
              "Support hospital request coordination",
              "Keep your account and activity organized",
            ].map((text) => (
              <div key={text} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <ShieldCheck className="h-4 w-4 text-rose-100" />
                </span>
                <span className="text-sm text-white/90">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs leading-5 text-white/60">
          Blood Donation &amp; Emergency Assistance Platform
          <span className="mt-1 block">
            Made to bring people together when it matters.
          </span>
        </p>
      </section>

      {/* Login form panel */}
      <section className="flex min-h-screen flex-col px-5 py-6 sm:px-10 lg:justify-center lg:px-12 xl:px-20">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center lg:flex-none">
          <Link
            href="/"
            className="mb-10 inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="mb-8 lg:hidden">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-700 to-rose-500 text-white">
                <HeartPulse className="h-5 w-5" />
              </div>
              <span className="font-display text-xl font-semibold">
                RaktoSheba
              </span>
            </Link>
          </div>

          <div>
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
              <LockKeyhole className="h-6 w-6" />
            </div>

            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Welcome back
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Sign in to continue to your RaktoSheba account.
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-8 space-y-5"
            >
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
                        className="h-12 rounded-xl"
                        {...field}
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
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          className="h-12 rounded-xl pr-12"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword((previous) => !previous)
                          }
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
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

              <Button
                type="submit"
                className="h-12 w-full rounded-xl bg-gradient-to-r from-red-700 to-rose-600 font-semibold text-white shadow-md shadow-rose-600/15 transition-all hover:from-red-800 hover:to-rose-700"
                loading={login.isPending}
                disabled={login.isPending}
              >
                Sign in
                {!login.isPending && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          </Form>

          {/* Demo accounts */}
          <div className="my-7 flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="shrink-0 text-xs text-muted-foreground">
              Explore with a demo account
            </span>
            <Separator className="flex-1" />
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {demoOptions.map((option) => {
              const Icon = option.icon;

              return (
                <button
                  key={option.role}
                  type="button"
                  onClick={() => demoLogin(option.role)}
                  disabled={login.isPending}
                  className="group flex min-w-0 flex-col items-center rounded-2xl border border-border bg-card px-2 py-4 text-center transition-all hover:-translate-y-0.5 hover:border-rose-200 hover:bg-rose-50/50 hover:shadow-sm disabled:pointer-events-none disabled:opacity-50 dark:hover:border-rose-900 dark:hover:bg-rose-950/20 sm:px-3"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors group-hover:bg-rose-100 group-hover:text-rose-600 dark:group-hover:bg-rose-950 dark:group-hover:text-rose-400">
                    <Icon className="h-5 w-5" />
                  </span>

                  <span className="mt-2.5 text-sm font-semibold">
                    {option.label}
                  </span>

                  <span className="mt-1 text-[10px] leading-4 text-muted-foreground sm:text-xs">
                    {option.description}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-rose-600 transition-colors hover:text-rose-700 hover:underline dark:text-rose-400"
            >
              Create an account
            </Link>
          </p>
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          By signing in, you agree to use RaktoSheba responsibly.
        </p>
      </section>
    </main>
  );
}
