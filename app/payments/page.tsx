"use client";

import { Suspense, useState } from "react";
import { Receipt, HeartHandshake } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { SimpleTopbar } from "@/components/layout/simple-topbar";
import { usePayments, useInitiatePayment } from "@/hooks/use-payments";
import { PAYMENT_PROVIDER_OPTIONS, PAYMENT_STATUS_VARIANT, PAYMENT_PURPOSE_LABELS } from "@/lib/constants";
import type { PaymentProvider } from "@/types";

export default function PaymentsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <PaymentsContent />
    </Suspense>
  );
}

function PaymentsContent() {
  const { data, isLoading, isError, refetch } = usePayments({ page: 1, limit: 20 });

  return (
    <div className="min-h-screen">
      <SimpleTopbar />
      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="font-display text-2xl font-medium">Payments</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your payment history and ways to support the platform.</p>

        <DonateCard />

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-base">Payment history</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading && (
              <div className="space-y-2 p-6">
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
              </div>
            )}
            {isError && <div className="p-6"><ErrorState message="Couldn't load payment history." onRetry={() => refetch()} /></div>}
            {data && data.items.length === 0 && (
              <div className="p-6"><EmptyState icon={Receipt} title="No payments yet" /></div>
            )}
            {data && data.items.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.items.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{PAYMENT_PURPOSE_LABELS[p.purpose] ?? p.purpose}</TableCell>
                      <TableCell className="text-muted-foreground">{p.provider}</TableCell>
                      <TableCell>{p.amount} {p.currency}</TableCell>
                      <TableCell>
                        <Badge variant={PAYMENT_STATUS_VARIANT[p.status] ?? "default"}>{p.status}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DonateCard() {
  const [amount, setAmount] = useState("200");
  const [provider, setProvider] = useState<PaymentProvider>("STRIPE");
  const initiatePayment = useInitiatePayment();

  return (
    <Card className="mt-6 border-primary/30">
      <CardHeader>
        <div className="flex items-center gap-2">
          <HeartHandshake className="size-5 text-primary" />
          <CardTitle className="text-base">Support the platform</CardTitle>
        </div>
        <CardDescription>A direct donation helps cover platform costs — not tied to any specific request.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-2">
            <Label>Amount (BDT)</Label>
            <Input type="number" min={50} value={amount} onChange={(e) => setAmount(e.target.value)} className="w-32" />
          </div>
          <div className="space-y-2">
            <Label>Payment method</Label>
            <Select value={provider} onValueChange={(v) => setProvider(v as PaymentProvider)}>
              <SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {PAYMENT_PROVIDER_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button
            loading={initiatePayment.isPending}
            disabled={Number(amount) < 50}
            onClick={() => initiatePayment.mutate({ purpose: "PLATFORM_DONATION", provider, amount: Number(amount) })}
          >
            Donate {amount || 0} BDT
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Minimum 50 BDT.</p>
      </CardContent>
    </Card>
  );
}
