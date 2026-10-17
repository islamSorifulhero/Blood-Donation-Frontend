
import Link from "next/link";
import {
  ArrowRight,
  Hospital,
  Droplet,
  ShieldCheck,
  HeartPulse,
  MapPin,
  Users,
  CheckCircle2,
  Activity,
  Clock3,
  HeartHandshake,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PublicNav } from "@/components/layout/public-nav";
import { PublicFooter } from "@/components/layout/public-footer";

const steps = [
  {
    number: "01",
    icon: Hospital,
    title: "Request blood",
    description:
      "Verified hospitals submit blood requests with the required group, units, and urgency.",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "Verify the request",
    description:
      "Admins review requests to help ensure that only verified emergencies reach donors.",
  },
  {
    number: "03",
    icon: HeartPulse,
    title: "Find matching donors",
    description:
      "Eligible donors are identified using blood-group compatibility and location.",
  },
  {
    number: "04",
    icon: HeartHandshake,
    title: "Connect & donate",
    description:
      "Donors respond to requests and coordinate donation with the requesting hospital.",
  },
];

const roles = [
  {
    icon: Droplet,
    title: "Blood Donors",
    label: "BE SOMEONE'S HERO",
    description:
      "Manage your availability, discover compatible requests nearby, and keep track of your donation history.",
    href: "/register",
    linkText: "Become a donor",
  },
  {
    icon: Hospital,
    title: "Hospitals",
    label: "SAVE VALUABLE TIME",
    description:
      "Submit emergency requests, find compatible donors, and monitor the progress of each request.",
    href: "/register",
    linkText: "Join as a hospital",
  },
  {
    icon: ShieldCheck,
    title: "Administrators",
    label: "KEEP THE NETWORK SAFE",
    description:
      "Review hospital verification, manage requests, and monitor platform activity.",
    href: "/login",
    linkText: "Admin sign in",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <PublicNav />

      {/* Hero Section */}
      <section className="relative isolate">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-40 top-10 size-80 rounded-full bg-red-500/10 blur-3xl" />
          <div className="absolute right-0 top-0 size-96 rounded-full bg-rose-400/10 blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 md:py-24 lg:grid-cols-2 lg:gap-16 lg:px-10">
          {/* Hero Content */}
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-50" />
                <span className="relative inline-flex size-2 rounded-full bg-red-600" />
              </span>
              Every second matters in an emergency
            </div>

            <h1 className="font-display text-4xl font-bold leading-[1.15] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Connecting lives through{" "}
              <span className="bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">
                blood donation.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
              RaktoSheba connects verified hospitals with compatible,
              eligible blood donors nearby — helping communities respond
              faster when every moment counts.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                asChild
                className="h-12 rounded-xl bg-red-600 px-6 text-white shadow-lg shadow-red-600/20 hover:bg-red-700"
              >
                <Link href="/register">
                  Request blood
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-12 rounded-xl px-6"
              >
                <Link href="/register">
                  <Droplet className="mr-2 size-4 text-red-600" />
                  Become a donor
                </Link>
              </Button>
            </div>

            {/* Trust Points */}
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600" />
                Verified requests
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600" />
                Compatibility-based matching
              </span>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-red-500/20 via-rose-400/10 to-transparent blur-2xl" />

            <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card p-2 shadow-2xl shadow-red-950/10">
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src="/hero-banner.jpg"
                  alt="RaktoSheba blood donation and emergency support"
                  className="aspect-[4/3] w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                <div className="absolute bottom-5 left-5 right-5 text-white sm:bottom-7 sm:left-7">
                  <div className="flex items-center gap-2 text-sm font-medium text-white/90">
                    <HeartPulse className="size-5" />
                    One community. One mission.
                  </div>
                  <p className="mt-2 text-2xl font-semibold sm:text-3xl">
                    Be the reason someone lives.
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Card */}
            <div className="absolute -bottom-7 -left-2 flex max-w-[255px] items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-xl sm:-left-8 sm:p-5">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-950">
                <HeartHandshake className="size-6" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  Every donor matters
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Your willingness to help can make a difference.
                </p>
              </div>
            </div>

            <div className="absolute -right-2 -top-5 hidden items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 shadow-lg sm:flex">
              <ShieldCheck className="size-5 text-emerald-600" />
              <span className="text-sm font-medium text-foreground">
                Trust-first network
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="border-y border-border/70 bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:grid-cols-3 sm:px-8 lg:px-10">
          <Feature
            icon={<ShieldCheck className="size-5" />}
            title="Verified requests"
            description="Hospital and request verification"
          />
          <Feature
            icon={<MapPin className="size-5" />}
            title="Location-aware matching"
            description="Discover compatible donors nearby"
          />
          <Feature
            icon={<Clock3 className="size-5" />}
            title="Emergency-focused"
            description="Prioritize urgent blood requests"
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-24 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
            Simple process
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Help reaches the right people
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            A clear, verification-focused process helps hospitals connect
            with compatible donors when blood is needed.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="group relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl hover:shadow-red-950/5 dark:hover:border-red-900"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-red-50 text-red-600 transition-colors group-hover:bg-red-600 group-hover:text-white dark:bg-red-950/50">
                    <Icon className="size-6" />
                  </div>
                  <span className="font-display text-3xl font-bold text-muted-foreground/20">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* User Roles */}
      <section className="border-y border-border/70 bg-muted/30">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-24 lg:px-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
                Built for everyone
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                One platform, three roles
              </h2>
            </div>

            <p className="max-w-lg leading-7 text-muted-foreground">
              Bringing donors, hospitals, and administrators together in
              one trusted blood donation network.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {roles.map((role) => {
              const Icon = role.icon;

              return (
                <div
                  key={role.title}
                  className="group flex flex-col rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-xl hover:shadow-red-950/5 dark:hover:border-red-900"
                >
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/50">
                    <Icon className="size-7" />
                  </div>

                  <p className="mt-6 text-xs font-semibold tracking-[0.15em] text-red-600">
                    {role.label}
                  </p>

                  <h3 className="mt-2 text-xl font-semibold text-foreground">
                    {role.title}
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">
                    {role.description}
                  </p>

                  <Link
                    href={role.href}
                    className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-red-600"
                  >
                    {role.linkText}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 py-20 sm:px-8 md:py-24 lg:px-10">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-red-700 via-red-600 to-rose-600 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full border-[40px] border-white/10" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 size-72 rounded-full border-[45px] border-white/10" />

          <div className="relative mx-auto max-w-2xl">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-white/15">
              <HeartPulse className="size-7" />
            </div>

            <h2 className="mt-6 font-display text-3xl font-bold sm:text-4xl">
              Someone out there needs your help.
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-white/85">
              Join RaktoSheba and become part of a community working to
              make blood donation more accessible.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                asChild
                className="h-12 rounded-xl bg-white px-6 text-red-700 hover:bg-red-50"
              >
                <Link href="/register">
                  Join RaktoSheba
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-12 rounded-xl border-white/40 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/login">Sign in</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-red-600">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
