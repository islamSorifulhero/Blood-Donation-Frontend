
import Link from "next/link";
import {
  ArrowRight,
  HeartPulse,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";

const footerLinks = [
  { href: "/about", label: "About us" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/faq", label: "FAQs" },
  { href: "/contact", label: "Contact us" },
];

const accountLinks = [
  { href: "/register", label: "Become a donor" },
  { href: "/register", label: "Join as a hospital" },
  { href: "/login", label: "Sign in" },
];

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-14 sm:px-8 sm:pt-16 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              aria-label="RaktoSheba home"
              className="inline-flex items-center gap-3"
            >
              <img
                src="/Raktaseba-logo.jpg"
                alt="RaktoSheba"
                className="h-12 w-auto object-contain"
              />

              <div>
                <span className="block font-display text-xl font-bold tracking-tight text-foreground">
                  Rakto<span className="text-red-600">Sheba</span>
                </span>
                <span className="text-[10px] font-medium tracking-[0.16em] text-muted-foreground">
                  GIFT BLOOD. SAVE LIVES.
                </span>
              </div>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
              RaktoSheba brings blood donors and verified hospitals
              together to make emergency blood requests easier to manage.
              Every connection is an opportunity to make a difference.
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400">
              <ShieldCheck className="size-4" />
              Built around verified requests
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground">
              Explore
            </h3>

            <ul className="mt-5 space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-red-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h3 className="font-semibold text-foreground">
              Get involved
            </h3>

            <ul className="mt-5 space-y-3">
              {accountLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-red-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-12 flex flex-col gap-5 rounded-2xl border border-red-100 bg-red-50/70 p-6 dark:border-red-900/50 dark:bg-red-950/20 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300">
              <HeartPulse className="size-6" />
            </div>

            <div>
              <h3 className="font-semibold text-foreground">
                Your next donation could save a life.
              </h3>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Join the RaktoSheba community and be ready to help.
              </p>
            </div>
          </div>

          <Link
            href="/register"
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 sm:self-center"
          >
            Become a donor
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {/* Contact Information */}
        <div className="mt-10 flex flex-col gap-4 border-b border-border pb-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-red-600"
          >
            <Mail className="size-4" />
            Contact our team
          </Link>

          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4" />
            Bangladesh
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col gap-4 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} RaktoSheba. All rights reserved.
          </p>

          <p className="flex items-center gap-2 text-muted-foreground">
            Made with
            <HeartPulse className="size-4 fill-red-600 text-red-600" />
            for a lifesaving mission
          </p>
        </div>
      </div>
    </footer>
  );
}
