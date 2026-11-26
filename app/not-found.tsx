import { Blob, Cta } from "@/components/ui/Bits";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section
      data-parallax-scope
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-cream pb-20 pt-36"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div data-parallax="-0.3" className="absolute -right-[10%] -top-[20%] w-[60vw] max-w-[820px]">
          <Blob variant="b" fill="var(--color-orange)" className="w-full" />
        </div>
        <div
          data-parallax="0.3"
          className="font-display outline-text absolute -bottom-[8%] left-[2%] text-[clamp(12rem,40vw,40rem)] leading-none opacity-[0.15]"
        >
          404
        </div>
      </div>

      <div className="shell">
        <p className="label flex items-center gap-3">
          <span className="bg-ink px-2 py-1 text-cream">404</span>
          Not built yet
        </p>
        <h1 className="display mt-8" data-split>
          This page
          <br />
          isn&apos;t built<span className="text-orange">.</span>
        </h1>
        <p className="lead mt-8 max-w-[44ch]" data-reveal data-delay="300">
          The address you followed does not exist on this site. It may have been renamed, or the
          link may be incomplete.
        </p>
        <div className="mt-10 flex flex-wrap gap-4" data-reveal data-delay="450">
          <Cta href="/">Back home</Cta>
          <Cta href="/services" variant="paper">
            Browse services
          </Cta>
        </div>
      </div>
    </section>
  );
}
