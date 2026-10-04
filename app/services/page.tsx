import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import SmartImage from "@/components/ui/SmartImage";
import Reveal from "@/components/animations/Reveal";
import RevealText from "@/components/animations/RevealText";
import PendingNote from "@/components/ui/PendingNote";
import { services } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Building and civil works, electrical, plumbing, tile laying, renovation and finishing — delivered by Shreekumar Builders as one coordinated scope.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        index="01"
        label="Services"
        lines={["Six trades,", "one scope of work."]}
        serifLine="Nothing handed between contractors."
        lead="Structure, services and finishes are planned together and executed by the same team. Open a trade to see exactly what is included."
        meta={[
          { k: "Trades", v: "06" },
          { k: "Works", v: "Residential · Commercial" },
        ]}
      />

      <div className="grain border-t border-ink-12 py-[var(--spacing-section)]">
        <div className="shell">
          <ul className="border-t border-ink-12">
            {services.map((s) => (
              <li key={s.slug}>
                <Reveal y={26}>
                  <Link
                    href={`/services/${s.slug}`}
                    data-cursor="Open"
                    className="group relative block border-b border-ink-12 py-9 lg:py-14"
                  >
                    <div className="grid grid-cols-12 items-start gap-x-5 gap-y-6 lg:gap-x-8">
                      <div className="col-span-3 lg:col-span-1">
                        <span className="meta text-ink-35 transition-colors duration-500 group-hover:text-oxide">
                          {s.index}
                        </span>
                      </div>

                      <div className="col-span-9 lg:col-span-4">
                        <RevealText
                          as="h2"
                          text={s.title}
                          className="display-2 text-ink transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2"
                        />
                        <p className="meta-sm mt-3 text-ink-35">{s.scope.length} activities</p>
                      </div>

                      <div className="col-span-12 lg:col-span-4">
                        <p className="body-copy max-w-[46ch] text-ink-70">{s.summary}</p>
                        <ul className="mt-5 flex flex-wrap gap-2">
                          {s.scope.slice(0, 4).map((item) => (
                            <li key={item} className="meta-sm border border-ink-12 px-2 py-1 text-ink-45">
                              {item}
                            </li>
                          ))}
                          {s.scope.length > 4 && (
                            <li className="meta-sm px-2 py-1 text-ink-35">
                              +{s.scope.length - 4}
                            </li>
                          )}
                        </ul>
                      </div>

                      <div className="col-span-12 lg:col-span-2">
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-limestone">
                          <div className="absolute inset-0 transition-transform duration-[1.3s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105">
                            <SmartImage
                              src={s.image}
                              alt={`${s.title} — Shreekumar Builders`}
                              plate={s.plate}
                              className="h-full w-full"
                              sizes="(max-width: 1023px) 100vw, 22rem"
                            />
                          </div>
                        </div>
                        <span className="meta-sm mt-3 block text-ink-35">
                          Open trade <span className="arrow-shift">→</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>

          <div className="mt-12">
            <PendingNote>
              Service scope wording to be confirmed against how the company is
              actually contracted
            </PendingNote>
          </div>
        </div>
      </div>
    </>
  );
}