"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SimpleTopbar } from "@/components/layout/simple-topbar";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");

  return (
    <div className="min-h-screen">
      <SimpleTopbar />
      <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <CheckCircle2 className="size-12 text-success" />
        <h1 className="mt-4 font-display text-2xl font-medium">Payment received</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Thank you — we&rsquo;re confirming it with the payment provider now. This usually
          finishes within a few seconds and your payment history will update automatically.
        </p>
        {transactionId && (
          <p className="mt-2 font-mono text-xs text-muted-foreground">Ref: {transactionId}</p>
        )}
        <Button className="mt-6" asChild>
          <Link href="/payments">View payment history</Link>
        </Button>
      </div>
    </div>
  );
}
