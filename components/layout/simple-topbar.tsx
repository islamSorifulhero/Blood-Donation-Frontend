"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export function SimpleTopbar() {
  const user = useAuthStore((s) => s.user);
  const backHref = user ? `/${user.role.toLowerCase()}` : "/";

  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4">
      <Link href="/" className="font-display text-xl">
        RaktoSheba
      </Link>
      <Link href={backHref} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to dashboard
      </Link>
    </header>
  );
}
