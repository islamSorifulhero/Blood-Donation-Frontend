
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: {
    default: "RaktoSheba — Blood Donation & Emergency Assistance",
    template: "%s — RaktoSheba",
  },
  description:
    "Connecting verified hospitals with compatible, nearby blood donors for urgent requests.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
