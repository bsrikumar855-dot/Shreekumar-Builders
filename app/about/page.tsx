import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import SmartImage from "@/components/ui/SmartImage";
import WhyUs from "@/components/sections/WhyUs";
import CtaBand from "@/components/sections/CtaBand";
import { PendingNote } from "@/components/ui/Bits";
import { materials } from "@/lib/data/process";
import { services } from "@/lib/data/services";
import { site } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Shreekumar Builders — building and civil works, electrical, plumbing and tile laying, delivered as one coordinated scope.",
  alternates: { canonical: "/about" },
};

/** CSS-only material swatches in the brand palette. */
const SWATCH: Record<string, React.CSSProperties> = {
  concrete: {
    background:
      "radial-gradient(circle at 20% 30%, #0d0b0922 0 3px, transparent 4px) 0 0/22px 22px, #cfc6b8",
  },
  stone: {
    background:
      "repeating-linear-gradient(0deg, transparent 0 46px, #0d0b09 46px 49px), repeating-linear-gradient(90deg, transparent 0 78px, #0d0b09 78px 81px), #b9a58a",
  },
  ceramic: {
    background:
      "conic-gradient(from 90deg at 3px 3px, transparent 90deg, #0d0b09 0) 0 0/56px 56px, #f4620b",
  },
  steel: {
    background:
      "repeating-linear-gradient(90deg, #2c2824 0 14px, #3b3631 14px 28px), #2c2824",
  },
  timber: {
    background:
      "repeating-linear-gradient(0deg, #a34105 0 9px, #8a3604 9px 11px, #b94c0c 11px 20px)",
  },
  glass: {
    background:
      "linear-gradient(115deg, transparent 38%, #ffffff88 38% 46%, transparent 46% 58%, #ffffff55 58% 62%, transparent 62%), #9ac4c4",
  },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        index="06"
        label="About"
        lines={["Building is a craft.", "Execution is a discipline"]}
        lead={`${site.name} — ${site.tradeName} — works across building and civil, electrical, plumbing and tiling for residential and commercial projects.`}
        meta={[
          { k: "Trades", v: "06" },
          { k: "Works", v: "Residential · Commercial" },
        ]}
      />

      {/* Statement */}
      <section data-parallax-scope className="overflow-hidden bg-cream py-[var(--spacing-section)]">
        <div className="shell grid grid-cols-12 items-center gap-x-10 gap-y-14">
          <div className="col-span-12 lg:col-span-6">
            <h2 className="label">The company</h2>
            <div className="mt-8 space-y-6">
              <p className="lead" data-reveal>
                Most construction problems are not dramatic. They are small misunderstandings about
                where something goes, made expensive by the order they were made in.
              </p>
              <p className="text-[1.05rem] leading-[1.75] text-ink-70" data-reveal data-delay="100">
                Working as a single scope across the trades is how those misunderstandings are
                designed out. The set-out is agreed before the structure goes up. The services are
                drawn with the structure, not after it. The finishes are planned from the same
                set-out that set the dimensions.
              </p>
              <p className="text-[1.05rem] leading-[1.75] text-ink-70" data-reveal data-delay="200">
                That is a less dramatic way to describe quality than a promise, and it is the one
                that survives contact with a real site.
              </p>
            </div>

            <ul className="mt-9 flex flex-wrap gap-2" data-reveal>
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="label inline-block border-2 border-ink bg-paper px-3 py-2 transition-colors duration-300 hover:bg-orange"
                  >
                    {s.index} · {s.title}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-9">
              <PendingNote>Founding year, team history and company profile to be supplied</PendingNote>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6">
            <div data-parallax="0.1">
              <div data-rotate="5">
                <div className="card overflow-hidden">
                  <SmartImage
                    src="about-workshop.webp"
                    alt="Shreekumar Builders — building, electrical, plumbing and tiling works"
                    plate="plan"
                    tone="orange"
                    parallax={-0.12}
                    className="aspect-square w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhyUs id="about-why" />

      {/* Materials */}
      <section className="bg-sand py-[var(--spacing-section)]" aria-labelledby="materials-title">
        <div className="shell">
          <h2 id="materials-title" className="h2" data-split>
            Materials, and
            <br />
            how they behave
          </h2>

          <ul className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {materials.map((m, i) => (
              <li key={m.name} data-parallax-scope>
                <div data-parallax={[0.06, -0.06, 0.12][i % 3]}>
                  <div data-reveal data-delay={String((i % 3) * 100)} className="card h-full overflow-hidden bg-paper">
                    <div
                      className="relative aspect-[16/10] border-b-2 border-ink"
                      style={SWATCH[m.tone]}
                      role="img"
                      aria-label={`${m.name} swatch`}
                    >
                      <span className="font-display absolute left-3 top-3 bg-ink px-3 py-1 text-xl leading-none text-cream">
                        {m.index}
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="h3">{m.name}</h3>
                      <p className="label mt-3 text-rust">{m.note}</p>
                      <p className="mt-4 text-ink-70">{m.detail}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
