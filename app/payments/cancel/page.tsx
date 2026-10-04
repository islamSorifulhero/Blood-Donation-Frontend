"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SimpleTopbar } from "@/components/layout/simple-topbar";

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<Skeleton className="h-96" />}>
      <PaymentCancelContent />
    </Suspense>
  );
}

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("transactionId");

  return (
    <div className="min-h-screen">
      <SimpleTopbar />
      <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <XCircle className="size-12 text-muted-foreground" />
        <h1 className="mt-4 font-display text-2xl font-medium">Payment cancelled</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          No charge was made. You can try again anytime from your payment history.
        </p>
        {transactionId && (
          <p className="mt-2 font-mono text-xs text-muted-foreground">Ref: {transactionId}</p>
        )}
        <Button className="mt-6" variant="outline" asChild>
          <Link href="/payments">Back to payments</Link>
        </Button>
      </div>
    </div>
  );
}
