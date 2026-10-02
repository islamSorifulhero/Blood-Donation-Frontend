"use client";

import { LayoutDashboard, Users, Hospital, Droplet, ScrollText } from "lucide-react";
import { DashboardShell, type NavItem } from "@/components/layout/dashboard-shell";

const navItems: NavItem[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Hospitals", href: "/admin/hospitals", icon: Hospital },
  { label: "Blood Requests", href: "/admin/requests", icon: Droplet },
  { label: "Audit Logs", href: "/admin/audit-logs", icon: ScrollText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell navItems={navItems} roleLabel="Admin">
      {children}
    </DashboardShell>
  );
}
