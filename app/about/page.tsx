import type { Metadata } from "next";
import { PublicNav } from "@/components/layout/public-nav";
import { PublicFooter } from "@/components/layout/public-footer";

export const metadata: Metadata = {
  title: "About",
  description: "Why RaktoSheba exists and how it approaches emergency blood matching.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <PublicNav />
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-4xl font-medium">About RaktoSheba</h1>
        <div className="prose-sm mt-8 space-y-6 text-muted-foreground">
          <p>
            Bangladesh doesn&rsquo;t have a shortage of willing blood donors — it has a
            <em> coordination</em> problem. When a hospital needs O-negative blood at 2am,
            the donors who could help are rarely the ones who hear about it in time.
            RaktoSheba exists to close that gap with software rather than phone trees and
            Facebook posts.
          </p>
          <h2 className="font-display text-xl text-foreground">How we think about the problem</h2>
          <p>
            Every emergency request on the platform goes through the same three checks before
            a single donor is notified: is the blood group actually compatible (not just
            matching — compatible, using real transfusion rules), is the donor medically
            eligible to donate again (a minimum 90-day gap since their last donation), and
            are they close enough to realistically make it in time, with that distance
            threshold widening automatically as urgency increases.
          </p>
          <p>
            We also don&rsquo;t let any hospital account post requests the moment it signs up.
            An admin verifies every hospital first, and every request is reviewed before
            donors are ever notified — matching only begins after that review. It&rsquo;s a
            small amount of friction in exchange for donors being able to trust that what
            lands in their notifications is real.
          </p>
          <h2 className="font-display text-xl text-foreground">What this project is</h2>
          <p>
            RaktoSheba is a student project — a
            backend-first build with a Next.js frontend layered on top of it. It&rsquo;s a
            working demonstration of the matching logic above, not a production medical
            service.
          </p>
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}