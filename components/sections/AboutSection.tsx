import Link from "next/link";
import SmartImage from "@/components/ui/SmartImage";
import Reveal from "@/components/animations/Reveal";
import RevealText from "@/components/animations/RevealText";
import { SectionMark, TickChain } from "@/components/ui/Drafting";
import PendingNote from "@/components/ui/PendingNote";
import { site } from "@/lib/data/site";

/**
 * About — Act 05
 * A short, firm statement of what the company is and how it works.
 * No invented history: the profile note is marked as awaiting input.
 */
export default function AboutSection() {
  return (
    <section
      data-surface="light"
      aria-labelledby="about-title"
      className="grain relative border-t border-ink-12 py-[var(--spacing-section)]"
    >
      <div className="shell">
        <div className="grid grid-cols-12 gap-x-5 gap-y-10 lg:gap-x-8">
          {/* Statement */}
          <div className="col-span-12 lg:col-span-7">
            <SectionMark index="08" label="The company" />

            <h2 id="about-title" className="mt-8 lg:mt-12">
              <RevealText
                text="Building is a craft."
                className="display-2 block text-ink"
              />
              <RevealText
                text="Execution is a discipline."
                className="serif display-2 mt-1 block font-normal italic text-ink"
                delay={0.1}
              />
            </h2>

            <div className="mt-9 grid grid-cols-12 gap-x-5 lg:mt-12 lg:gap-x-8">
              <div className="col-span-12 sm:col-span-6">
                <Reveal y={20}>
                  <p className="body-copy text-ink-70">
                    {site.name} carries out building and civil work, electrical,
                    plumbing and tile laying — residential and commercial — as a
                    single coordinated scope rather than as separate jobs handed
                    between contractors.
                  </p>
                </Reveal>
              </div>
              <div className="col-span-12 mt-6 sm:col-span-6 sm:mt-0">
                <Reveal y={20} delay={0.08}>
                  <p className="body-copy text-ink-70">
                    The approach is unglamorous and deliberate: agree the
                    dimensions, set them out on site, build to them, and check the
                    result before it gets covered. Finishes are treated as part of
                    the structure, not as decoration applied at the end.
                  </p>
                </Reveal>
              </div>
            </div>

            <Reveal y={20} delay={0.14} className="mt-8">
              <PendingNote>
                Company profile, founding year and team history to be supplied
              </PendingNote>
            </Reveal>

            {/* Principles, drawn as a schedule */}
            <div className="mt-10 lg:mt-14">
              <TickChain />
              <dl className="mt-5">
                {[
                  ["Company", site.name],
                  ["Trading as", site.tradeName],
                  ["Core services", site.descriptor],
                  ["Works", "Residential · Commercial"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-baseline gap-6 border-b border-ink-12 py-3.5"
                  >
                    <dt className="meta w-32 shrink-0 text-ink-35 lg:w-40">{k}</dt>
                    <dd className="body-copy text-ink-70">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <Reveal y={18} className="mt-9">
              <Link
                href="/about"
                className="link-rule meta inline-block text-oxide"
                data-cursor="Open"
              >
                More about how we work <span className="arrow-shift ml-1">→</span>
              </Link>
            </Reveal>
          </div>

          {/* Drawing */}
          <div className="col-span-12 lg:col-span-4 lg:col-start-9">
            <Reveal y={28}>
              <SmartImage
                src="about-workshop.webp"
                alt="Shreekumar Builders — building, electrical, plumbing and tiling works"
                plate="detail"
                className="aspect-square w-full"
                caption="Drawing 02"
                reveal
                sizes="(max-width: 1023px) 100vw, 30rem"
              />
            </Reveal>

            <Reveal y={20} delay={0.1} className="mt-6 hidden lg:block">
              <p className="meta text-ink-45">
                Detail — junction of surfaces
              </p>
              <p className="body-copy mt-3 max-w-[30ch] text-ink-70">
                Where two materials meet is where workmanship is judged. It is
                also where most shortcuts are taken.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}