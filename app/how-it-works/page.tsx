
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Hospital,
  ShieldCheck,
  HeartPulse,
  BellRing,
  CalendarCheck,
  CheckCircle2,
  Droplet,
  Clock3,
  MapPin,
  ClipboardCheck,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PublicNav } from "@/components/layout/public-nav";
import { PublicFooter } from "@/components/layout/public-footer";

export const metadata: Metadata = {
  title: "How It Works | RaktoSheba",
  description:
    "Learn how RaktoSheba coordinates blood requests, hospital verification, donor matching, notifications, and donation fulfillment.",
};

const steps = [
  {
    number: "01",
    title: "A hospital submits a request",
    subtitle: "Request creation",
    icon: Hospital,
    color: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    body: "A verified hospital account submits the patient's blood group, required units, urgency level, and deadline. The request remains pending verification until an administrator reviews it.",
    points: [
      "Blood group and required units",
      "Urgency level and deadline",
      "Request awaits administrative review",
    ],
  },
  {
    number: "02",
    title: "An admin reviews the request",
    subtitle: "Verification and approval",
    icon: ShieldCheck,
    color:
      "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
    body: "An administrator reviews the request before it proceeds to donor matching. This additional step helps reduce unverified requests reaching potential donors.",
    points: [
      "Review request information",
      "Approve or reject the request",
      "Matching proceeds after approval",
    ],
  },
  {
    number: "03",
    title: "The matching engine finds eligible donors",
    subtitle: "Compatibility-based matching",
    icon: HeartPulse,
    color:
      "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
    body: "After approval, the system identifies potential donors based on blood-group compatibility, availability, donation history, and distance from the request.",
    points: [
      "Compatible blood groups",
      "Availability and donation eligibility",
      "Location and urgency-based search radius",
    ],
  },
  {
    number: "04",
    title: "Matched donors receive notifications",
    subtitle: "Donor response",
    icon: BellRing,
    color:
      "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400",
    body: "Matched donors receive request information and relevant distance details. Each donor can choose whether to accept or decline, so a match does not automatically commit anyone to donate.",
    points: [
      "Request details for matched donors",
      "Accept or decline the request",
      "Donor participation remains voluntary",
    ],
  },
  {
    number: "05",
    title: "The donor schedules a donation",
    subtitle: "Coordination",
    icon: CalendarCheck,
    color:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    body: "When a donor accepts, the donation can be coordinated by scheduling the date, time, and location according to the platform's workflow and the hospital's arrangements.",
    points: [
      "Coordinate a suitable date and time",
      "Confirm the donation location",
      "Follow the hospital's instructions",
    ],
  },
  {
    number: "06",
    title: "The hospital confirms completion",
    subtitle: "Fulfillment tracking",
    icon: ClipboardCheck,
    color:
      "bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400",
    body: "Once the donation is confirmed, the hospital records completion in the platform. The system updates relevant donation records and request fulfillment progress, according to the implemented business rules.",
    points: [
      "Record the completed donation",
      "Update donation and fulfillment information",
      "Close the request when its requirements are fulfilled",
    ],
  },
];

const highlights = [
  {
    icon: ShieldCheck,
    title: "Verification first",
    description: "Requests are reviewed before donor matching.",
  },
  {
    icon: Droplet,
    title: "Compatibility matters",
    description: "Blood-group compatibility is considered during matching.",
  },
  {
    icon: MapPin,
    title: "Location-aware",
    description: "Distance helps prioritize potential donors.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <PublicNav />

      {/* Hero */}
      <section className="relative isolate border-b border-border/70">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-32 top-0 size-80 rounded-full bg-red-500/10 blur-3xl" />
          <div className="absolute right-0 top-10 size-96 rounded-full bg-rose-400/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-5 py-16 text-center sm:px-8 md:py-24 lg:px-10">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
            <HeartPulse className="size-4" />
            The process, step by step
          </div>

          <h1 className="mx-auto mt-6 max-w-4xl font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            From blood request to{" "}
            <span className="bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">
              meaningful action.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            Discover how RaktoSheba organizes hospital requests, verifies
            information, identifies potential donors, and tracks donation
            fulfillment through one coordinated workflow.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="h-12 rounded-xl bg-red-600 px-6 text-white hover:bg-red-700"
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
              className="h-12 rounded-xl"
            >
              <Link href="/faq">Explore FAQs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="border-b border-border/70 bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:grid-cols-3 sm:px-8 lg:px-10">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-red-600">
                  <Icon className="size-5" />
                </div>

                <div>
                  <h2 className="font-semibold text-foreground">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-5xl px-5 py-20 sm:px-8 md:py-24">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
            The workflow
          </span>

          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Six steps. One coordinated process.
          </h2>

          <p className="mt-4 leading-7 text-muted-foreground">
            Each stage helps move a request from initial submission
            toward verified donor coordination and fulfillment.
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute bottom-10 left-6 top-10 hidden w-px bg-border sm:block md:left-8" />

          <div className="space-y-6">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="group relative grid gap-5 rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:border-red-200 hover:shadow-xl hover:shadow-red-950/5 dark:hover:border-red-900 sm:grid-cols-[64px_1fr] sm:gap-6 sm:p-7"
                >
                  {/* Step Icon */}
                  <div className="relative z-10 flex items-start">
                    <div
                      className={`flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 sm:size-14 ${step.color}`}
                    >
                      <Icon className="size-6" />
                    </div>
                  </div>

                  {/* Step Content */}
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-display text-sm font-bold tracking-wider text-red-600">
                        STEP {step.number}
                      </span>

                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                        {step.subtitle}
                      </span>
                    </div>

                    <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                      {step.body}
                    </p>

                    <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                      {step.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Eligibility Notice */}
      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 md:pb-20 lg:px-10">
        <div className="flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/50 dark:bg-amber-950/20 sm:flex-row sm:items-start sm:p-6">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
            <AlertCircle className="size-5" />
          </div>

          <div>
            <h2 className="font-semibold text-foreground">
              A note about medical eligibility
            </h2>

            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Platform matching is intended to identify potential donors,
              not to make a final medical decision. Donation eligibility,
              blood compatibility, and transfusion suitability must be
              confirmed by qualified healthcare professionals. Donors
              should follow the receiving hospital's instructions.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 pb-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-red-700 via-red-600 to-rose-600 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-white/15">
            <HeartPulse className="size-7" />
          </div>

          <h2 className="mx-auto mt-6 max-w-2xl font-display text-3xl font-bold sm:text-4xl">
            Ready to be part of the change?
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-white/85">
            Join RaktoSheba to explore a more organized way of connecting
            blood donation requests with potential donors.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="h-12 rounded-xl bg-white px-6 text-red-700 hover:bg-red-50"
            >
              <Link href="/register">
                Become a donor
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
