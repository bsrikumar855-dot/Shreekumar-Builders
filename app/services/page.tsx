import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import SmartImage from "@/components/ui/SmartImage";
import CtaBand from "@/components/sections/CtaBand";
import { services } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Building, electrical, plumbing, tile laying, renovation and finishing — delivered by Shreekumar Builders as one coordinated scope.",
  alternates: { canonical: "/services" },
};

const TONES = ["orange", "cream", "ink", "rust", "orange", "cream"] as const;

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        index="03"
        label="Services"
        lines={["Six trades.", "One scope"]}
        lead="Structure, services and finishes are planned on the same drawing and delivered by one team — so nothing is chased into a finished wall."
        meta={[{ k: "Trades", v: "06" }]}
      />

      <section className="bg-sand py-[var(--spacing-section)]" aria-label="All services">
        <div className="shell space-y-16 lg:space-y-28">
          {services.map((s, i) => (
            <article
              key={s.slug}
              data-parallax-scope
              className="grid grid-cols-12 items-center gap-x-8 gap-y-8"
            >
              <div
                className={`col-span-12 lg:col-span-6 ${i % 2 ? "lg:order-2" : ""}`}
                data-parallax="0.08"
              >
                <div data-reveal={i % 2 ? "right" : "left"}>
                  <Link href={`/services/${s.slug}`} data-tilt data-cursor="Open" className="card group block overflow-hidden" aria-label={`${s.title} — view scope`}>
                    <SmartImage
                      src={s.image}
                      alt={`${s.title} — illustration`}
                      plate={s.plate}
                      tone={TONES[i]}
                      parallax={-0.12}
                      className="aspect-[4/3] w-full"
                    />
                  </Link>
                </div>
              </div>

              <div className={`col-span-12 lg:col-span-6 ${i % 2 ? "lg:order-1" : ""}`}>
                <p className="font-display text-[clamp(4rem,9vw,8rem)] leading-none text-rust" data-reveal>
                  {s.index}
                </p>
                <h2 className="display-2 mt-2" data-split>
                  {s.title}
                </h2>
                <p className="lead mt-6 max-w-[44ch]" data-reveal data-delay="150">
                  {s.summary}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2" data-reveal data-delay="250">
                  {s.scope.slice(0, 3).map((x) => (
                    <li key={x} className="label border-2 border-ink bg-cream px-3 py-2">
                      {x}
                    </li>
                  ))}
                </ul>
                <div className="mt-8" data-reveal data-delay="300">
                  <Link href={`/services/${s.slug}`} className="btn btn-ink">
                    View scope <span className="arr" aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
