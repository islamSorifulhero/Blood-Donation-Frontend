"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/auth-store";
import { useLogout } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
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
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const logout = useLogout();

  return (
    <div className="grid min-h-screen lg:grid-cols-[240px_1fr]">
      {/* Sidebar */}
      <aside className="hidden flex-col border-r border-border bg-card lg:flex">
        <div className="px-6 py-5">
          <Link href="/" className="font-display text-xl">
            RaktoSheba
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
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
        <div className="border-t border-border p-4">
          <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => logout.mutate()} loading={logout.isPending}>
            <LogOut className="size-4" /> Log out
          </Button>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex flex-col">
        <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
          <Badge variant="outline">{roleLabel}</Badge>
          {!hasHydrated || !user ? (
            <Skeleton className="h-6 w-32" />
          ) : (
            <span className="text-sm font-medium">{user.name}</span>
          )}
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
