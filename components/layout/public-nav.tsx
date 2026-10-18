
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ArrowRight,
  HeartPulse,
  LogIn,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function PublicNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
        {/* Logo */}
        <Link
          href="/"
          aria-label="RaktoSheba home"
          className="flex shrink-0 items-center gap-2.5"
          onClick={() => setMobileMenuOpen(false)}
        >
          <img
            src="/Raktaseba-logo.jpg"
            alt="RaktoSheba Logo"
            className="h-10 w-auto object-contain"
          />

          <div className="hidden sm:block">
            <span className="block font-display text-xl font-bold tracking-tight text-foreground">
              Rakto<span className="text-red-600">Sheba</span>
            </span>
            <span className="block text-[10px] font-medium tracking-[0.16em] text-muted-foreground">
              GIFT BLOOD. SAVE LIVES.
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 lg:flex"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${isActive(link.href)
                  ? "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 sm:flex">
          <Button variant="ghost" asChild className="rounded-xl">
            <Link href="/login">
              <LogIn className="mr-2 size-4" />
              Log in
            </Link>
          </Button>

          <Button
            asChild
            className="rounded-xl bg-red-600 px-5 text-white shadow-sm shadow-red-600/20 hover:bg-red-700"
          >
            <Link href="/register">
              Join RaktoSheba
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="flex size-10 items-center justify-center rounded-xl border border-border text-foreground transition-colors hover:bg-muted sm:hidden"
        >
          {mobileMenuOpen ? (
            <X className="size-5" />
          ) : (
            <Menu className="size-5" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-border/70 bg-background px-5 pb-5 pt-3 shadow-lg sm:hidden"
        >
          <nav
            aria-label="Mobile navigation"
            className="flex flex-col gap-1"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${isActive(link.href)
                    ? "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4">
            <Button variant="outline" asChild className="rounded-xl">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
              >
                Log in
              </Link>
            </Button>

            <Button
              asChild
              className="rounded-xl bg-red-600 text-white hover:bg-red-700"
            >
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
              >
                <HeartPulse className="mr-2 size-4" />
                Register
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}