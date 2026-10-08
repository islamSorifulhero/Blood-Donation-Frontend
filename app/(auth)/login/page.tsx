"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ShieldCheck, Hospital, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useLogin } from "@/hooks/use-auth";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { DEMO_ACCOUNTS } from "@/lib/constants";

export default function LoginPage() {
  const login = useLogin();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: LoginInput) {
    login.mutate(values);
  }

  function demoLogin(role: keyof typeof DEMO_ACCOUNTS) {
    login.mutate(DEMO_ACCOUNTS[role]);
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left — brand panel */}
      <div className="hidden flex-col justify-between bg-foreground p-10 text-background lg:flex">
        <Link href="/" className="font-display text-2xl">
          RaktoSheba
        </Link>
        <div className="max-w-sm space-y-4">
          <p className="font-display text-3xl italic leading-snug">
            &ldquo;Every donation is someone&rsquo;s second chance.&rdquo;
          </p>
          <p className="text-sm text-background/70">
            RaktoSheba connects verified hospitals with compatible, nearby donors the
            moment an emergency request comes in.
          </p>
        </div>
        <p className="text-xs text-background/50">B7A7 — Blood Donation &amp; Emergency Assistance Platform</p>
      </div>

      {/* Right — form panel */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <h1 className="font-display text-3xl font-medium">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Log in to your account</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" loading={login.isPending}>
                Log in
              </Button>
            </form>
          </Form>

          <div className="my-6 flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">or quick demo login</span>
            <Separator className="flex-1" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Button variant="outline" className="flex-col h-auto gap-1.5 py-3" onClick={() => demoLogin("ADMIN")} disabled={login.isPending}>
              <ShieldCheck className="size-5" />
              <span className="text-xs">Admin</span>
            </Button>
            <Button variant="outline" className="flex-col h-auto gap-1.5 py-3" onClick={() => demoLogin("DONOR")} disabled={login.isPending}>
              <Droplet className="size-5" />
              <span className="text-xs">Donor</span>
            </Button>
            <Button variant="outline" className="flex-col h-auto gap-1.5 py-3" onClick={() => demoLogin("HOSPITAL")} disabled={login.isPending}>
              <Hospital className="size-5" />
              <span className="text-xs">Hospital</span>
            </Button>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don&rsquo;t have an account?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}