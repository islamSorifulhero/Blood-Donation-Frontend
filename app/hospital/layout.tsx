"use client";

import { LayoutDashboard, Droplet, PlusCircle, Building2 } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/layout/dashboard-shell";

const navItems: NavItem[] = [
  { label: "Overview", href: "/hospital", icon: LayoutDashboard },
  { label: "My Requests", href: "/hospital/requests", icon: Droplet },
  { label: "New Request", href: "/hospital/requests/new", icon: PlusCircle },
  { label: "Hospital Profile", href: "/hospital/profile", icon: Building2 },
];

export default function HospitalLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell navItems={navItems} roleLabel="Hospital">
      {children}
    </DashboardShell>
  );
}
