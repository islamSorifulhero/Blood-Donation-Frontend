"use client";

import { LayoutDashboard, Bell, HeartPulse, User, Receipt } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/layout/dashboard-shell";

const navItems: NavItem[] = [
  { label: "Overview", href: "/donor", icon: LayoutDashboard },
  { label: "My Matches", href: "/donor/matches", icon: Bell },
  { label: "Donation History", href: "/donor/donations", icon: HeartPulse },
  { label: "Payments", href: "/payments", icon: Receipt },
  { label: "Profile", href: "/donor/profile", icon: User },
];

export default function DonorLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell navItems={navItems} roleLabel="Donor">
      {children}
    </DashboardShell>
  );
}
