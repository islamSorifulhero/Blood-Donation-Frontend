import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PublicNav } from "@/components/layout/public-nav";
import { PublicFooter } from "@/components/layout/public-footer";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch about a hospital partnership, a donor issue, or platform feedback.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <PublicNav />
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="font-display text-4xl font-medium">Get in touch</h1>
        <p className="mt-4 text-muted-foreground">
          For hospital partnership requests, donor account issues, or general feedback on the platform.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <Mail className="size-5 text-primary" />
              <p className="mt-3 text-sm font-medium">Email</p>
              <a href="mailto:support@raktosheba.app" className="mt-1 block text-sm text-muted-foreground hover:text-foreground">
                islamsoriful.hero@gmail.com
              </a>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Phone className="size-5 text-primary" />
              <p className="mt-3 text-sm font-medium">Phone</p>
              <p className="mt-1 text-sm text-muted-foreground">+880 1770-886813</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <MapPin className="size-5 text-primary" />
              <p className="mt-3 text-sm font-medium">Based in</p>
              <p className="mt-1 text-sm text-muted-foreground">Dhaka, Bangladesh</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10">
          <Button size="lg" asChild>
            <a href="mailto:support@raktosheba.app">Email us</a>
          </Button>
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}