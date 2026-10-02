"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-sm text-primary">Something broke</p>
      <h1 className="mt-2 font-display text-3xl font-medium">We hit an unexpected error</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Nothing was lost — try again, and if it keeps happening, let us know.
      </p>
      <Button className="mt-6" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
