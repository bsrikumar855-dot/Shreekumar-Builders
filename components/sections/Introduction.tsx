import Reveal from "@/components/animations/Reveal";
import RevealText from "@/components/animations/RevealText";
import { SectionMark, ColumnRule, TickChain } from "@/components/ui/Drafting";

/**
 * Introduction — Act 01
 * An editorial statement, not a marketing paragraph. Sets the point of view
 * before anything is sold.
 */
export default function Introduction() {
  return (
    <section
      data-surface="light"
      aria-labelledby="intro-title"
      className="grain relative border-t border-ink-12 py-[var(--spacing-section)]"
    >
      <div className="shell">
        <Reveal>
          <SectionMark index="02" label="Position" />
        </Reveal>

        <div className="mt-10 grid grid-cols-12 gap-x-5 gap-y-8 lg:mt-14 lg:gap-x-8">
          <div className="col-span-12 lg:col-span-9">
            <h2 id="intro-title">
              <RevealText
                text="We don't just build structures."
                className="display-2 block text-ink"
              />
              <RevealText
                text="We build the systems that make them work."
                className="serif display-2 mt-1 block font-normal italic text-ink"
                delay={0.1}
              />
            </h2>
          </div>

          <div className="col-span-12 flex flex-col gap-8 lg:col-span-3 lg:col-start-10 lg:pt-4">
            <Reveal y={20}>
              <p className="body-copy text-ink-70">
                A building is not only walls and finishes. It is structure,
                electrical, plumbing, surfaces, materials, detailing,
                coordination — and the execution that holds all of it together.
              </p>
            </Reveal>
            <Reveal y={20} delay={0.1}>
              <p className="body-copy text-ink-70">
                Shreekumar Builders works across those trades as one scope, so the
                services are planned with the structure instead of chased into it
                afterwards.
              </p>
            </Reveal>
            <Reveal y={16} delay={0.16}>
              <p className="meta text-ink-45">
                Shreekumar Electrical &amp; Plumbing Works
              </p>
            </Reveal>
          </div>
        </div>

        {/* The seven things a building is made of — set as a drawn list */}
        <div className="mt-14 lg:mt-20">
          <Reveal>
            <TickChain />
          </Reveal>
          <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-px bg-ink-12 sm:grid-cols-3 lg:grid-cols-7">
            {[
              "Structure",
              "Electrical",
              "Plumbing",
              "Surfaces",
              "Materials",
              "Detailing",
              "Coordination",
            ].map((word, i) => (
              <li key={word}>
                <Reveal y={18} delay={i * 0.04} className="h-full">
                  <div className="flex h-full flex-col gap-6 bg-bone p-5 lg:p-6">
                    <span className="meta-sm text-ink-25">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="meta text-ink-70 lg:text-[0.68rem]">{word}</span>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="shell mt-14 lg:mt-20">
        <div className="grid grid-cols-12 gap-x-5 lg:gap-x-8">
          <ColumnRule className="col-span-1 hidden lg:block" />
          <Reveal y={16} className="col-span-12 lg:col-span-6 lg:col-start-4">
            <p className="meta text-ink-45">
              Executed as one scope · Building · Civil · Electrical · Plumbing · Tiling
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}