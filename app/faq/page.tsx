import type { Metadata } from "next";
import { PublicNav } from "@/components/layout/public-nav";
import { PublicFooter } from "@/components/layout/public-footer";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Common questions about donating, hospital verification, and how matching works.",
};

const faqs = [
  {
    q: "How often can I donate blood?",
    a: "We enforce a minimum 90-day gap between donations before you're eligible to be matched again — this is the standard interval for whole-blood donation and it's checked automatically by the matching engine, not left to the honor system.",
  },
  {
    q: "Why didn't I get matched to a nearby request?",
    a: "A few possible reasons: your blood group isn't compatible with that specific request (compatibility isn't symmetric — check the FAQ item below), you're marked unavailable, you donated within the last 90 days, or the request's urgency level set a search radius that didn't reach you.",
  },
  {
    q: "Does my blood group need to exactly match the request?",
    a: "No — compatibility, not an exact match. O-negative donors are compatible with every blood group (the \"universal donor\"), and AB-positive patients can receive from every blood group. Every other combination follows standard transfusion compatibility rules.",
  },
  {
    q: "How do hospitals get verified?",
    a: "Every hospital account starts unverified after registration. An admin manually reviews the registration details before the hospital can post any blood request — this step can't be skipped or paid around.",
  },
  {
    q: "What are the payment fees for?",
    a: "They're optional processing fees (hospital verification fee, or a per-request priority fee) — they fund the platform but don't change how matching or verification actually works. Verification and matching run the same way regardless of payment.",
  },
  {
    q: "Can I decline a match without any penalty?",
    a: "Yes. Accepting or declining a match is always your choice, and declining doesn't affect your eligibility for future matches.",
  },
  {
    q: "What happens after I accept a match?",
    a: "You'll schedule a donation date, time, and location. Once the hospital confirms the donation actually happened, your donation count and last-donation date update, and that's what starts your next 90-day eligibility window.",
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen">
      <PublicNav />
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-4xl font-medium">Frequently asked questions</h1>

        <dl className="mt-12 divide-y divide-border">
          {faqs.map((item) => (
            <div key={item.q} className="py-6">
              <dt className="font-medium">{item.q}</dt>
              <dd className="mt-2 text-sm text-muted-foreground">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>
      <PublicFooter />
    </div>
  );
}
