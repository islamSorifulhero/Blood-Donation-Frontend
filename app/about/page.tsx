
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  HeartPulse,
  Target,
  ShieldCheck,
  MapPin,
  Droplet,
  Hospital,
  CheckCircle2,
  Code2,
  HeartHandshake,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PublicNav } from "@/components/layout/public-nav";
import { PublicFooter } from "@/components/layout/public-footer";

export const metadata: Metadata = {
  title: "About RaktoSheba",
  description:
    "Learn about RaktoSheba, our mission to simplify emergency blood donation matching, and our verification-first approach.",
};

const principles = [
  {
    icon: Droplet,
    title: "Compatible blood groups",
    description:
      "Matching considers blood-group compatibility rather than relying on identical blood-group labels alone.",
  },
  {
    icon: HeartPulse,
    title: "Donation eligibility",
    description:
      "Donation history and eligibility rules help identify donors who may be ready to donate again.",
  },
  {
    icon: MapPin,
    title: "Location-aware matching",
    description:
      "Nearby eligible donors can be prioritized, with the search radius adjusted according to request urgency.",
  },
];

const workflow = [
  {
    number: "01",
    title: "Hospital verification",
    description:
      "Hospital accounts are reviewed by an administrator before they can submit blood requests.",
  },
  {
    number: "02",
    title: "Request review",
    description:
      "Blood requests go through an administrative review before donor matching begins.",
  },
  {
    number: "03",
    title: "Donor matching",
    description:
      "Eligible donors with compatible blood groups are identified using the platform's matching criteria.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <PublicNav />

      {/* Hero */}
      <section className="relative isolate border-b border-border/70">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-32 top-0 size-80 rounded-full bg-red-500/10 blur-3xl" />
          <div className="absolute right-0 top-10 size-96 rounded-full bg-rose-400/10 blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 md:py-24 lg:grid-cols-2 lg:px-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
              <HeartPulse className="size-4" />
              About RaktoSheba
            </div>

            <h1 className="mt-6 font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Connecting people.
              <span className="mt-1 block bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">
                Supporting lives.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
              Willing blood donors and people who need blood often struggle
              to find each other at the right time. RaktoSheba aims to bridge
              that coordination gap through a structured, verification-first
              blood donation platform.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                asChild
                className="h-12 rounded-xl bg-red-600 px-6 text-white hover:bg-red-700"
              >
                <Link href="/register">
                  Join our community
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-12 rounded-xl"
              >
                <Link href="/how-it-works">How it works</Link>
              </Button>
            </div>
          </div>

          {/* Mission Card */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-red-500/20 to-rose-400/10 blur-2xl" />

            <div className="rounded-3xl border border-border bg-card p-6 shadow-xl sm:p-9">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/50">
                <Target className="size-7" />
              </div>

              <p className="mt-7 text-sm font-semibold uppercase tracking-[0.18em] text-red-600">
                Our mission
              </p>

              <h2 className="mt-3 font-display text-2xl font-bold leading-snug text-foreground sm:text-3xl">
                Make finding compatible blood donors more organized and accessible.
              </h2>

              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                By bringing hospitals, donors, and administrators into one
                coordinated system, we aim to reduce the friction involved
                in responding to urgent blood requests.
              </p>

              <div className="mt-7 space-y-4 border-t border-border pt-6">
                <MissionPoint text="A structured request and review process" />
                <MissionPoint text="Compatibility and eligibility considerations" />
                <MissionPoint text="A coordinated connection between hospitals and donors" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-24 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
            Why RaktoSheba?
          </span>

          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            The challenge is coordination
          </h2>

          <p className="mt-5 text-base leading-8 text-muted-foreground">
            In an urgent situation, finding a suitable blood donor can
            involve repeated calls, scattered social media posts, and
            time-consuming coordination. RaktoSheba explores how software
            can bring these steps into a more organized workflow.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <PrincipleCard
            icon={<HeartHandshake className="size-6" />}
            title="Bring people together"
            description="Help hospitals and eligible donors discover relevant blood requests through a shared platform."
          />

          <PrincipleCard
            icon={<ShieldCheck className="size-6" />}
            title="Build trust into the process"
            description="Use hospital verification and request review to help limit unverified requests."
          />

          <PrincipleCard
            icon={<MapPin className="size-6" />}
            title="Focus on relevance"
            description="Consider blood compatibility, donation eligibility, and location when identifying potential donors."
          />
        </div>
      </section>

      {/* Matching Principles */}
      <section className="border-y border-border/70 bg-muted/30">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-24 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div>
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
                Our approach
              </span>

              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Matching is about more than blood type.
              </h2>

              <p className="mt-5 leading-8 text-muted-foreground">
                Finding a potential donor involves several considerations.
                RaktoSheba is designed around matching criteria that help
                make the process more relevant and organized.
              </p>

              <div className="mt-7 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
                <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-600" />
                <p className="text-sm leading-6 text-amber-900 dark:text-amber-200">
                  Blood compatibility and donor eligibility must be confirmed
                  using appropriate medical guidance. Software matching does
                  not replace professional medical assessment.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {principles.map((principle) => {
                const Icon = principle.icon;

                return (
                  <div
                    key={principle.title}
                    className="flex gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-red-200 dark:hover:border-red-900 sm:p-6"
                  >
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/50">
                      <Icon className="size-6" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground">
                        {principle.title}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">
                        {principle.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Verification Workflow */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 md:py-24 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
            Trust through process
          </span>

          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            A structured path to donor matching
          </h2>

          <p className="mt-4 leading-7 text-muted-foreground">
            The platform follows a defined workflow before connecting
            requests with potential donors.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {workflow.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="font-display text-4xl font-bold text-red-600/25">
                {step.number}
              </span>

              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Project Disclaimer */}
      <section className="border-t border-border/70 bg-muted/30">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20 lg:px-10">
          <div className="flex flex-col gap-6 rounded-3xl border border-border bg-card p-6 sm:p-9 md:flex-row md:items-start md:gap-8">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-foreground">
              <Code2 className="size-7" />
            </div>

            <div className="max-w-3xl">
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">
                About this project
              </span>

              <h2 className="mt-3 font-display text-2xl font-bold text-foreground sm:text-3xl">
                Technology with a purpose
              </h2>

              <p className="mt-4 leading-8 text-muted-foreground">
                RaktoSheba is a student-developed project built to
                demonstrate how a backend-driven platform and a modern
                Next.js frontend can support a more organized blood
                donation workflow. It explores authentication, role-based
                access, hospital verification, request management, and
                donor matching.
              </p>

              <p className="mt-3 leading-8 text-muted-foreground">
                This project is a technical demonstration, not a substitute
                for a hospital, blood bank, emergency service, or medical
                professional. Its actual capabilities depend on the
                implemented and verified system features.
              </p>

              <div className="mt-6">
                <Link
                  href="/how-it-works"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 transition-colors hover:text-red-700"
                >
                  Explore how it works
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 py-16 sm:px-8 md:py-20 lg:px-10">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-red-700 via-red-600 to-rose-600 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-white/15">
            <HeartPulse className="size-7" />
          </div>

          <h2 className="mx-auto mt-6 max-w-2xl font-display text-3xl font-bold sm:text-4xl">
            Be part of a more connected blood donation community.
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-white/85">
            Discover RaktoSheba and learn how donors and hospitals can
            work together through a coordinated platform.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="h-12 rounded-xl bg-white px-6 text-red-700 hover:bg-red-50"
            >
              <Link href="/register">
                Get started
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-12 rounded-xl border-white/40 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}

function MissionPoint({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
      <p className="text-sm leading-6 text-muted-foreground">{text}</p>
    </div>
  );
}

function PrincipleCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg dark:hover:border-red-900">
      <div className="flex size-12 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/50">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-semibold text-foreground">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
