import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  CircleHelp,
  HeartPulse,
  Hospital,
  Search,
  ShieldCheck,
} from "lucide-react";
import { PublicNav } from "@/components/layout/public-nav";
import { PublicFooter } from "@/components/layout/public-footer";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | RaktoSheba",
  description:
    "Find answers about blood donation, donor matching, hospital verification, and how RaktoSheba works.",
};

const faqs = [
  {
    category: "Donation",
    q: "How often can I donate blood?",
    a: "The appropriate interval depends on the type of donation and your health. For whole-blood donation, a gap of around 90 days is commonly used in many settings, but local medical guidance may differ. Always follow the advice of qualified medical professionals and confirm your eligibility before donating.",
  },
  {
    category: "Matching",
    q: "Why wasn't I matched with a nearby blood request?",
    a: "Matching may depend on your blood group compatibility, availability, donation history, location, and the request's search criteria. Make sure your donor profile is complete and your availability status is up to date. A nearby request does not always mean you are eligible for that donation.",
  },
  {
    category: "Matching",
    q: "Does my blood group need to exactly match the patient's blood group?",
    a: "Not always. Blood compatibility depends on the blood components involved, ABO and Rh blood groups, and clinical requirements. For example, O-negative red blood cells are often described as universally compatible for emergency red-cell transfusions, but this does not apply to every blood product or situation. The hospital and transfusion professionals must confirm compatibility.",
  },
  {
    category: "Hospitals",
    q: "How are hospitals verified?",
    a: "Hospital accounts may require administrative review before they can access request-posting features. Verification helps establish trust and reduce misuse. The exact requirements and approval status depend on the platform's implemented verification workflow.",
  },
  {
    category: "Payments",
    q: "What are the platform's payment fees for?",
    a: "If payment features are enabled, fees may relate to specific platform services, such as verification or request priority. Check the displayed fee details before paying. Payment should not be assumed to guarantee a donor match, a hospital approval, or a successful donation.",
  },
  {
    category: "Donation",
    q: "Can I decline a match?",
    a: "Yes. Donating blood is voluntary. You can decline a match if you are unavailable or do not wish to donate. If you have questions about how a particular response affects your account, check the platform's current policies.",
  },
  {
    category: "Donation",
    q: "What happens after I accept a match?",
    a: "Follow the instructions provided for scheduling and confirming the donation. Coordinate with the hospital or responsible medical team about the date, time, and location. A donation should only be recorded as completed after it has actually taken place and been confirmed through the platform's workflow.",
  },
  {
    category: "Account",
    q: "How can I keep my donor profile up to date?",
    a: "Keep your contact details, blood group, location, and availability accurate. Update your donation history when appropriate and follow any verification steps shown in your account. Accurate information helps the platform assess potential matches more effectively.",
  },
];

const categories = [
  { label: "All questions", icon: CircleHelp },
  { label: "Donation", icon: HeartPulse },
  { label: "Matching", icon: Search },
  { label: "Hospitals", icon: Hospital },
  { label: "Payments", icon: ShieldCheck },
  { label: "Account", icon: CircleHelp },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-background">
      <PublicNav />

      <main>
        {/* Hero */}
        <section className="relative border-b border-border bg-gradient-to-b from-rose-50/70 to-background dark:from-rose-950/20 dark:to-background">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                <CircleHelp className="h-7 w-7" />
              </div>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600 dark:text-rose-400">
                Help Center
              </p>

              <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Frequently asked{" "}
                <span className="bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">
                  questions
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Everything you need to know about blood donation, finding
                potential donors, and using RaktoSheba.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ list */}
        <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="mb-10">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Got questions?
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
              Browse the answers below to learn more about the platform.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((item, index) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-border bg-card transition-colors open:border-rose-200 open:bg-rose-50/30 dark:open:border-rose-900 dark:open:bg-rose-950/10"
              >
                <summary className="flex cursor-pointer list-none items-center gap-4 p-5 sm:p-6 [&::-webkit-details-marker]:hidden">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-sm font-semibold text-muted-foreground transition-colors group-open:bg-rose-100 group-open:text-rose-700 dark:group-open:bg-rose-950 dark:group-open:text-rose-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="flex-1 text-sm font-semibold leading-6 sm:text-base">
                    {item.q}
                  </span>

                  <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                </summary>

                <div className="px-5 pb-5 pl-[4.5rem] sm:px-6 sm:pb-6 sm:pl-[5.25rem]">
                  <p className="text-sm leading-7 text-muted-foreground sm:text-base">
                    {item.a}
                  </p>
                  <span className="mt-4 inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    {item.category}
                  </span>
                </div>
              </details>
            ))}
          </div>

          {/* Medical note */}
          <div className="mt-10 flex gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/60 dark:bg-amber-950/20 sm:p-6">
            <HeartPulse className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400" />
            <div>
              <h3 className="font-semibold text-amber-950 dark:text-amber-200">
                A note about medical eligibility
              </h3>
              <p className="mt-2 text-sm leading-6 text-amber-900/80 dark:text-amber-200/80">
                RaktoSheba helps connect people with potential donors. It does
                not replace medical screening or professional advice. The
                hospital or qualified medical team must confirm donor
                eligibility and blood compatibility before transfusion.
              </p>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="mt-12 rounded-3xl bg-gradient-to-br from-red-700 via-red-600 to-rose-600 p-7 text-white sm:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Still have questions?
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-white/80 sm:text-base">
                  Visit our contact page to find out how to get in touch with
                  the RaktoSheba team.
                </p>
              </div>

              <Link
                href="/contact"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-red-700 transition-colors hover:bg-rose-50"
              >
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
