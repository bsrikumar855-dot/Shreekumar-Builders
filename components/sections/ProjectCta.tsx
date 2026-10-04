import Link from "next/link";
import Reveal from "@/components/animations/Reveal";
import RevealText from "@/components/animations/RevealText";
import { SectionMark, TickChain } from "@/components/ui/Drafting";
import {
  buttonGhost,
  buttonSolid,
} from "@/components/animations/MagneticButton";
import ScrollToButton from "@/components/ui/ScrollToButton";

/**
 * ProjectCta
 * The hinge before contact. Enormous, quiet, and difficult to miss.
 */
export default function ProjectCta() {
  return (
    <section
      data-surface="light"
      aria-labelledby="cta-title"
      className="grain relative overflow-hidden border-t border-ink-12 bg-bone py-[clamp(4.5rem,9vw,9rem)]"
    >
      {/* Framing marks */}
      <div aria-hidden className="pointer-events-none absolute inset-6 hidden border border-ink-12 lg:block" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-ink-12"
      />

      <div className="shell relative">
        <Reveal>
          <SectionMark index="10" label="Next step" />
        </Reveal>

        <h2 id="cta-title" className="mt-8 lg:mt-12">
          <RevealText
            text="Let's build it right."
            className="display block text-ink"
            start="top 92%"
          />
        </h2>

        <div className="mt-9 grid grid-cols-12 items-end gap-x-5 gap-y-8 lg:mt-14 lg:gap-x-8">
          <Reveal y={22} className="col-span-12 lg:col-span-5">
            <p className="body-copy measure-wide text-ink-70">
              Send the location, the drawings if you have them, and what the space
              has to do. We will tell you what is possible, what it needs, and in
              what order it should be built.
            </p>
          </Reveal>

          <Reveal y={22} delay={0.1} className="col-span-12 lg:col-span-4 lg:col-start-9 lg:justify-self-end">
            <div className="flex flex-wrap gap-3">
              <ScrollToButton
                target="contact"
                className={buttonSolid}
                cursorLabel="Talk"
              >
                Start a project
                <span className="arrow-shift" aria-hidden>
                  →
                </span>
              </ScrollToButton>
              <Link href="/projects" className={buttonGhost} data-cursor="See">
                View our work
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 lg:mt-16">
          <TickChain />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="meta-sm text-ink-35">
              Building · Civil · Electrical · Plumbing · Tiling
            </p>
            <p className="meta-sm text-ink-35">Residential · Commercial</p>
          </div>
        </div>
      </div>
    </section>
  );
}