
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut,
  Menu,
  X,
  type LucideIcon,
  LayoutDashboard,
  Heart,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { NotificationBell } from "@/components/shared/notification-bell";

import { useAuthStore } from "@/store/auth-store";
import { useLogout } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

function NavLinks({
  navItems,
  onNavigate,
}: {
  navItems: NavItem[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
      <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
        Workspace
      </p>

      {navItems.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(`${item.href}/`));

        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <Icon
              className={cn(
                "size-[18px] shrink-0 transition-transform duration-200",
                !active && "group-hover:scale-110"
              )}
            />

            <span className="flex-1">{item.label}</span>

            {active && (
              <ChevronRight className="size-4 opacity-80" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="group flex items-center gap-3"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600 transition-transform group-hover:scale-105">
        <Heart className="size-5 fill-current" />
      </div>

      <div>
        <p className="font-display text-xl font-semibold leading-tight tracking-tight text-foreground">
          Rakto<span className="text-red-600">Sheba</span>
        </p>
        <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.13em] text-muted-foreground">
          Blood Donation Platform
        </p>
      </div>
    </Link>
  );
}

function UserInfo({
  user,
}: {
  user: { name: string; email?: string } | null | undefined;
}) {
  if (!user) return null;

  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl bg-muted/60 p-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-semibold text-red-700">
        {initials || "U"}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">
          {user.name}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {user.email ?? "RaktoSheba member"}
        </p>
      </div>

      <ShieldCheck className="size-4 shrink-0 text-emerald-600" />
    </div>
  );
}

export function DashboardShell({
  navItems,
  roleLabel,
  children,
}: {
  navItems: NavItem[];
  roleLabel: string;
  children: React.ReactNode;
}) {
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);

  const logout = useLogout();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  function handleLogout() {
    logout.mutate();
  }

  return (
    <div className="min-h-screen bg-muted/30 lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-border bg-card lg:flex">
        {/* Brand */}
        <div className="border-b border-border px-6 py-5">
          <Brand />
        </div>

        {/* Navigation */}
        <NavLinks navItems={navItems} />

        {/* User & Logout */}
        <div className="space-y-3 border-t border-border p-4">
          {!hasHydrated ? (
            <Skeleton className="h-16 w-full rounded-xl" />
          ) : (
            <UserInfo user={user} />
          )}

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 rounded-xl text-muted-foreground hover:bg-red-50 hover:text-red-600"
            onClick={handleLogout}
            loading={logout.isPending}
            disabled={logout.isPending}
          >
            <LogOut className="size-4" />
            Log out
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]"
            onClick={() => setMobileNavOpen(false)}
          />

          <aside className="relative flex h-full w-[280px] max-w-[85vw] flex-col border-r border-border bg-card shadow-2xl">
            {/* Mobile Brand */}
            <div className="flex items-center justify-between border-b border-border px-5 py-5">
              <Brand onClick={() => setMobileNavOpen(false)} />

              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <NavLinks
              navItems={navItems}
              onNavigate={() => setMobileNavOpen(false)}
            />

            {/* Mobile User & Logout */}
            <div className="space-y-3 border-t border-border p-4">
              {!hasHydrated ? (
                <Skeleton className="h-16 w-full rounded-xl" />
              ) : (
                <UserInfo user={user} />
              )}

              <Button
                variant="ghost"
                className="w-full justify-start gap-3 rounded-xl text-muted-foreground hover:bg-red-50 hover:text-red-600"
                onClick={handleLogout}
                loading={logout.isPending}
                disabled={logout.isPending}
              >
                <LogOut className="size-4" />
                Log out
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Column */}
      <div className="flex min-h-screen min-w-0 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>

            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Dashboard
              </span>

              <Badge
                variant="outline"
                className="w-fit max-w-full truncate border-red-200 bg-red-50 text-red-700"
              >
                {roleLabel}
              </Badge>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <NotificationBell />

            <div className="hidden h-8 w-px bg-border sm:block" />

            {!hasHydrated || !user ? (
              <Skeleton className="h-9 w-28 rounded-lg" />
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="hidden text-right sm:block">
                  <p className="max-w-[150px] truncate text-sm font-semibold text-foreground">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {roleLabel}
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-sm font-semibold text-red-700">
                  {user.name
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("")
                    .toUpperCase() || "U"}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="w-full flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1600px]">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-card px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-1 text-center text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <p>
              © {new Date().getFullYear()} RaktoSheba. All rights reserved.
            </p>
            <p>Donate blood. Save lives.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
