"use client";

import { useEffect } from "react";
import { Cta } from "@/components/ui/Bits";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="relative flex min-h-[100svh] items-center bg-cream pb-20 pt-36">
      <div className="shell">
        <p className="label flex items-center gap-3">
          <span className="bg-ink px-2 py-1 text-cream">Error</span>
          Something went wrong
        </p>
        <h1 className="display mt-8">
          Work stopped
          <br />
          on site<span className="text-orange">.</span>
        </h1>
        <p className="lead mt-8 max-w-[44ch]">
          This page failed to load. Try again, or head back to the home page.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <button type="button" onClick={reset} className="btn btn-orange">
            Try again
          </button>
          <Cta href="/" variant="paper">
            Back home
          </Cta>
        </div>
      </div>
    </section>
  );
}
