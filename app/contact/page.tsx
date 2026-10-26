import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
} from "lucide-react";
import { PublicNav } from "@/components/layout/public-nav";
import { PublicFooter } from "@/components/layout/public-footer";

export const metadata: Metadata = {
  title: "Contact Us | RaktoSheba",
  description:
    "Contact RaktoSheba about hospital partnerships, donor account issues, and platform feedback.",
};

const contactDetails = [
  {
    icon: Mail,
    title: "Email us",
    value: "islamsoriful.hero@gmail.com",
    description: "For questions, feedback, and partnership inquiries.",
    href: "mailto:islamsoriful.hero@gmail.com",
    action: "Send an email",
  },
  {
    icon: Phone,
    title: "Call us",
    value: "+880 1770-886813",
    description: "Get in touch about platform-related questions.",
    href: "tel:+8801770886813",
    action: "Call now",
  },
  {
    icon: MapPin,
    title: "Our location",
    value: "Dhaka, Bangladesh",
    description: "Based in Dhaka, serving the community through RaktoSheba.",
    href: "https://www.google.com/maps/search/?api=1&query=Dhaka%2C%20Bangladesh",
    action: "View location",
  },
];

const contactTopics = [
  "Hospital partnership",
  "Donor account support",
  "Platform feedback",
  "Other inquiries",
];

export default function ContactPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-background">
      <PublicNav />

      <main>
        {/* Hero */}
        <section className="relative border-b border-border bg-gradient-to-b from-rose-50/70 to-background dark:from-rose-950/20 dark:to-background">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                <MessageCircle className="h-7 w-7" />
              </div>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-600 dark:text-rose-400">
                Contact Us
              </p>

              <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                We&apos;re here to{" "}
                <span className="bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent">
                  help you
                </span>
              </h1>

              <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Have a question, need account support, or want to partner with
                RaktoSheba? We&apos;d love to hear from you.
              </p>
            </div>
          </div>
        </section>

        {/* Contact details */}
        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Get in touch
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Choose the contact method that works best for you.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {contactDetails.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-rose-200 hover:shadow-lg hover:shadow-rose-500/5 dark:hover:border-rose-900 sm:p-7"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition-colors group-hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:group-hover:bg-rose-950/70">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold">
                    {item.title}
                  </h3>

                  <a
                    href={item.href}
                    target={
                      item.title === "Our location" ? "_blank" : undefined
                    }
                    rel={
                      item.title === "Our location"
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="mt-2 break-words text-sm font-medium text-foreground transition-colors hover:text-rose-600"
                  >
                    {item.value}
                  </a>

                  <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>

                  <a
                    href={item.href}
                    target={
                      item.title === "Our location" ? "_blank" : undefined
                    }
                    rel={
                      item.title === "Our location"
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-rose-600 transition-colors hover:text-rose-700 dark:text-rose-400"
                  >
                    {item.action}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                </article>
              );
            })}
          </div>

          {/* Inquiry section */}
          <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-border bg-card p-7 sm:p-9">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
                <Send className="h-5 w-5" />
              </div>

              <h2 className="mt-5 text-2xl font-semibold tracking-tight">
                How can we help?
              </h2>

              <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                Whether you represent a hospital, need help with your donor
                account, or have an idea to improve RaktoSheba, please reach
                out by email.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {contactTopics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full border border-border bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground sm:text-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>

              <a
                href="mailto:islamsoriful.hero@gmail.com?subject=RaktoSheba%20Inquiry"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-rose-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-rose-600/15 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Mail className="h-4 w-4" />
                Send us an email
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-700 via-red-600 to-rose-600 p-7 text-white sm:p-9">
              <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full border border-white/10" />
              <div className="absolute -right-5 -top-5 h-28 w-28 rounded-full border border-white/10" />

              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <h2 className="mt-5 text-2xl font-semibold tracking-tight">
                  Building trust through connection
                </h2>

                <p className="mt-3 text-sm leading-7 text-white/80 sm:text-base">
                  RaktoSheba aims to make it easier to connect people who need
                  blood with potential donors and support hospital
                  coordination.
                </p>

                <div className="mt-7 flex items-start gap-3 rounded-2xl border border-white/15 bg-white/10 p-4">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0" />
                  <p className="text-sm leading-6 text-white/90">
                    For urgent medical emergencies, contact the hospital or
                    local emergency services directly. Do not rely on website
                    contact messages for emergency response.
                  </p>
                </div>

                <Link
                  href="/faq"
                  className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-white transition-opacity hover:opacity-80"
                >
                  Browse frequently asked questions
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
