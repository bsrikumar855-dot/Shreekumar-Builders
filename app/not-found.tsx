import Link from "next/link";
import RevealText from "@/components/animations/RevealText";
import { buttonGhost } from "@/components/animations/MagneticButton";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section
      data-surface="light"
      className="grain relative flex min-h-[86svh] items-center overflow-hidden py-28"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="shell h-full">
          <div className="relative h-full">
            <div className="absolute inset-y-0 left-0 w-px bg-ink-06" />
            <div className="absolute inset-y-0 right-0 w-px bg-ink-06" />
          </div>
        </div>
      </div>

      <div className="shell relative">
        <div className="flex items-center gap-4">
          <span className="meta text-oxide">404</span>
          <span aria-hidden className="h-px w-8 bg-ink-22" />
          <span className="meta text-ink-45">Sheet not issued</span>
        </div>

        <h1 className="display mt-8 max-w-[13ch] text-ink">
          <RevealText
            as="span"
            text="This page wasn't built yet."
            className="block"
            immediate
          />
        </h1>

        <p className="lead mt-8 max-w-[46ch] text-ink-70">
          The address you followed does not exist on this site. It may have been
          renamed, or the link may be incomplete.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className={buttonGhost} data-cursor="Home">
            Back to the index
            <span className="arrow-shift" aria-hidden>
              →
            </span>
          </Link>
          <Link href="/services" className={buttonGhost} data-cursor="See">
            Browse services
          </Link>
        </div>
      </div>
    </section>
  );
}