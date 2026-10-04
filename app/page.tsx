import Link from "next/link";
import { ArrowRight, Hospital, Droplet, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicNav } from "@/components/layout/public-nav";
import { PublicFooter } from "@/components/layout/public-footer";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <PublicNav />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          <h1 className="font-display text-5xl font-medium leading-[1.1] text-balance">
            When blood is needed urgently, finding the right donor shouldn&rsquo;t take hours.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            RaktoSheba is how verified hospitals reach compatible, nearby donors the moment
            an emergency request is approved — matched by blood group, donation eligibility,
            and distance, automatically.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link href="/register">
                Report an emergency <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/register">Become a donor</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it works — a genuine sequence, numbering earned */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-display text-2xl font-medium">How a request gets fulfilled</h2>
          <ol className="mt-10 grid gap-10 md:grid-cols-4">
            {[
              {
                n: "01",
                title: "Hospital submits a request",
                body: "A verified hospital posts the patient's blood group, units needed, and urgency.",
              },
              {
                n: "02",
                title: "Admin verifies it",
                body: "Every request is checked before it goes live — no unverified requests reach donors.",
              },
              {
                n: "03",
                title: "Compatible donors are matched",
                body: "We find eligible, nearby donors by blood-group compatibility and a radius scaled to urgency.",
              },
              {
                n: "04",
                title: "A donor accepts & donates",
                body: "The donor schedules a time; once confirmed, the request's fulfillment updates automatically.",
              },
            ].map((step) => (
              <li key={step.n}>
                <span className="font-display text-sm text-primary">{step.n}</span>
                <h3 className="mt-2 font-medium">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Three roles */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-display text-2xl font-medium">Built for three roles</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <RoleCard
            icon={<Droplet className="size-5" />}
            title="Donors"
            body="Set your availability, get matched to compatible requests nearby, and track your donation history."
          />
          <RoleCard
            icon={<Hospital className="size-5" />}
            title="Hospitals"
            body="Post verified emergency requests, track fulfillment in real time, and reach donors instantly."
          />
          <RoleCard
            icon={<ShieldCheck className="size-5" />}
            title="Admins"
            body="Verify hospitals and requests, monitor the platform, and review a full audit trail of every action."
          />
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

function RoleCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-lg border border-border p-6">
      <div className="flex size-10 items-center justify-center rounded-full bg-secondary text-foreground">{icon}</div>
      <h3 className="mt-4 font-medium">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
