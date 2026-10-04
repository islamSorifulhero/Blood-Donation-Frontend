import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PublicNav } from "@/components/layout/public-nav";
import { PublicFooter } from "@/components/layout/public-footer";

export const metadata: Metadata = {
  title: "How it works",
  description: "The full request-to-donation flow, step by step.",
};

const steps = [
  {
    n: "01",
    title: "A hospital submits a request",
    body: "A verified hospital account enters the patient's blood group, units needed, urgency level, and a deadline. It starts as Pending Verification — donors never see it yet.",
  },
  {
    n: "02",
    title: "An admin reviews it",
    body: "Every request is checked by an admin before anything happens. This is what keeps the platform trustworthy for donors — nothing reaches them unverified.",
  },
  {
    n: "03",
    title: "The matching engine runs",
    body: "On approval, we find donors whose blood group is transfusion-compatible, who haven't donated in the last 90 days, who are marked available, and who fall within a search radius that scales with urgency — 15km for a low-urgency request, up to 75km for a critical one.",
  },
  {
    n: "04",
    title: "Matched donors are notified",
    body: "Each matched donor gets a notification with the request details and distance. They can accept or decline — no one is auto-committed.",
  },
  {
    n: "05",
    title: "An accepted donor schedules a donation",
    body: "Once a donor accepts, they pick a date, time, and location for the actual donation.",
  },
  {
    n: "06",
    title: "The hospital confirms completion",
    body: "After the donation happens, the hospital marks it complete. That single action updates the donor's donation count and donation date, and updates the request's fulfilled units — if enough units are now in, the request closes automatically.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen">
      <PublicNav />
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-4xl font-medium">How it works</h1>
        <p className="mt-4 text-muted-foreground">
          The complete path from a hospital&rsquo;s request to a completed donation.
        </p>

        <ol className="mt-12 space-y-10">
          {steps.map((step) => (
            <li key={step.n} className="flex gap-6">
              <span className="font-display text-2xl text-primary">{step.n}</span>
              <div>
                <h2 className="font-medium">{step.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex gap-4">
          <Button asChild><Link href="/register">Become a donor</Link></Button>
          <Button variant="outline" asChild><Link href="/faq">Read the FAQ</Link></Button>
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}
