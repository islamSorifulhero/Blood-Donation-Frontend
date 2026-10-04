"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X, type LucideIcon } from "lucide-react";
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

function NavLinks({ navItems, onNavigate }: { navItems: NavItem[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 space-y-1 px-3">
      {navItems.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
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

  return (
    <div className="grid min-h-screen lg:grid-cols-[240px_1fr]">
      {/* Desktop sidebar */}
      <aside className="hidden flex-col border-r border-border bg-card lg:flex">
        <div className="px-6 py-5">
          <Link href="/" className="font-display text-xl">
            RaktoSheba
          </Link>
        </div>
        <NavLinks navItems={navItems} />
        <div className="border-t border-border p-4">
          <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => logout.mutate()} loading={logout.isPending}>
            <LogOut className="size-4" /> Log out
          </Button>
        </div>
      </aside>

      {/* Mobile slide-out nav */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setMobileNavOpen(false)} />
          <aside className="relative flex h-full w-64 flex-col bg-card">
            <div className="flex items-center justify-between px-6 py-5">
              <Link href="/" className="font-display text-xl" onClick={() => setMobileNavOpen(false)}>
                RaktoSheba
              </Link>
              <button onClick={() => setMobileNavOpen(false)} aria-label="Close menu">
                <X className="size-5" />
              </button>
            </div>
            <NavLinks navItems={navItems} onNavigate={() => setMobileNavOpen(false)} />
            <div className="border-t border-border p-4">
              <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => logout.mutate()} loading={logout.isPending}>
                <LogOut className="size-4" /> Log out
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex flex-col">
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              className="text-muted-foreground lg:hidden"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
            <Badge variant="outline">{roleLabel}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
            {!hasHydrated || !user ? (
              <Skeleton className="h-6 w-24" />
            ) : (
              <span className="hidden text-sm font-medium sm:inline">{user.name}</span>
            )}
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
