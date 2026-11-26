import Link from "next/link";
import SmartImage from "@/components/ui/SmartImage";
import { Cta, SectionLabel } from "@/components/ui/Bits";
import { services } from "@/lib/data/services";

const TONES = ["orange", "cream", "ink", "rust", "orange", "cream"] as const;
/** Each column drifts at a different speed — the grid breathes as you scroll. */
const COLUMN_SPEED = [-0.05, 0.14, -0.05];

export default function ServicesGrid({ heading = true }: { heading?: boolean }) {
  return (
    <section
      className="relative overflow-hidden bg-sand py-[var(--spacing-section)]"
      aria-labelledby="services-title"
    >
      <div className="shell">
        {heading && (
          <div className="mb-14 flex flex-wrap items-end justify-between gap-8 lg:mb-20">
            <div>
              <SectionLabel n="03">What we do</SectionLabel>
              <h2 id="services-title" className="h2 mt-6" data-split>
                Six trades.
                <br />
                One drawing.
              </h2>
            </div>
            <div data-reveal>
              <Cta href="/services" variant="ink">
                All services
              </Cta>
            </div>
          </div>
        )}

        <ul className="grid grid-cols-1 gap-x-8 gap-y-12 pb-0 md:grid-cols-2 lg:grid-cols-3 lg:pb-24">
          {services.map((s, i) => (
            <li key={s.slug} data-parallax-scope>
              <div className="h-full" data-parallax={COLUMN_SPEED[i % 3]}>
                <div className="h-full" data-reveal data-delay={String((i % 3) * 120)}>
                  <Link href={`/services/${s.slug}`} data-tilt data-cursor="Open"
                    className="card group flex h-full flex-col">
                    <div className="relative overflow-hidden border-b-2 border-ink">
                      <SmartImage
                        src={s.image}
                        alt={`${s.title} — illustration`}
                        plate={s.plate}
                        tone={TONES[i]}
                        parallax={-0.1}
                        className="aspect-[4/3] w-full transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]"
                      />
                      <span className="font-display absolute left-3 top-3 bg-ink px-3 py-1 text-xl leading-none text-cream">
                        {s.index}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col gap-4 p-6">
                      <h3 className="h3">{s.title}</h3>
                      <p className="text-ink-70">{s.summary}</p>
                      <span className="label mt-auto pt-3">
                        View scope <span className="arr inline-block">→</span>
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
