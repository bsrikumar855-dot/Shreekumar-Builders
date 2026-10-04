"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import SmartImage from "@/components/ui/SmartImage";
import Reveal from "@/components/animations/Reveal";
import { SectionMark, TickChain } from "@/components/ui/Drafting";
import { process } from "@/lib/data/process";
import { useGsap, ScrollTrigger } from "@/lib/utils/motion";
import { usePrefersReducedMotion, useIsomorphicLayoutEffect, useMediaQuery } from "@/lib/utils/hooks";
import { buttonGhostDark } from "@/components/animations/MagneticButton";

/**
 * ProcessTimeline — Act 03
 * A drawing that builds itself as it is read. On desktop a pinned plate and
 * a running stage number track the reader down the sequence; on mobile each
 * stage carries its own drawing.
 */
export default function ProcessTimeline() {
  const section = useRef<HTMLElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const stageRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const gsap = useGsap();
  const reduced = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useIsomorphicLayoutEffect(() => {
    if (!gsap || reduced) return;
    const ST = ScrollTrigger;

    const ctx = gsap.context(() => {
      // Rail fills with the reading position.
      gsap.fromTo(
        rail.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top 62%",
            end: "bottom 78%",
            scrub: 0.4,
          },
        },
      );

      // Active stage follows the viewport centre.
      stageRefs.current.forEach((el, i) => {
        if (!el) return;
        ST.create({
          trigger: el,
          start: "top 58%",
          end: "bottom 42%",
          onToggle: (self) => {
            if (self.isActive) setActive(i);
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, [gsap, reduced]);

  return (
    <section
      ref={section}
      data-surface="ink"
      className="surface-ink grain relative overflow-clip py-[var(--spacing-section)] text-bone"
      aria-labelledby="process-title"
    >
      <div className="shell relative">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionMark index="05" label="Process" tone="dark" />
            <h2 id="process-title" className="heading mt-7 max-w-[15ch] text-bone">
              <span className="block">The sequence,</span>
              <span className="serif block font-normal italic text-bone-60">drawn in order.</span>
            </h2>
          </div>
          <p className="meta max-w-[26ch] text-bone-45">
            Consult · Plan · Prepare · Build · Install · Finish · Handover
          </p>
        </div>

        <div className="mt-14 lg:mt-20">
          <div className="grid grid-cols-12 gap-x-5 lg:gap-x-8">
            {/* Pinned drawing + running number */}
            <div className="col-span-12 hidden lg:col-span-5 lg:block">
              <div className="sticky top-32">
                {/* Only the active sheet and its neighbours are mounted —
                    a full stack of seven drawings is a lot of SVG to carry. */}
                <div className="relative aspect-[4/3] overflow-hidden bg-ink">
                  {process.map(
                    (s, i) =>
                      Math.abs(i - active) <= 1 && (
                        <div
                          key={s.index}
                          aria-hidden={active !== i}
                          className={`absolute inset-0 transition-opacity duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            active === i ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          <SmartImage
                            src={`process-${s.index}.webp`}
                            alt={`${s.title} — stage ${s.index}`}
                            plate={s.plate}
                            tone="dark"
                            className="h-full w-full"
                            sizes="32rem"
                          />
                        </div>
                      ),
                  )}
                </div>

                {/* Stage number — layered so it transitions rather than swaps */}
                <div className="mt-6 flex items-end gap-6">
                  <div className="relative h-[0.78em] w-[2.2ch] overflow-hidden text-[clamp(3.4rem,6vw,5.6rem)] leading-[0.78] tracking-[-0.05em]">
                    {process.map((s, i) => (
                      <span
                        key={s.index}
                        aria-hidden={active !== i}
                        className={`absolute left-0 top-0 tabular-nums transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          active === i
                            ? "translate-y-0 text-oxide-tint opacity-100"
                            : "translate-y-[0.7em] text-bone opacity-0"
                        }`}
                      >
                        {s.index}
                      </span>
                    ))}
                  </div>
                  <div className="pb-2">
                    <p className="meta text-bone">{process[active].title}</p>
                    <p className="meta-sm mt-1.5 text-bone-35">{process[active].kicker}</p>
                  </div>
                </div>

                <div className="mt-7 h-px w-full bg-bone-14">
                  <div
                    ref={rail}
                    className="h-px w-full origin-top bg-oxide"
                    style={{ transform: "scaleY(0)" }}
                  />
                </div>
                <p className="meta-sm mt-3 text-bone-35">
                  Stage {process[active].index} of {String(process.length).padStart(2, "0")}
                </p>
              </div>
            </div>

            {/* Stages */}
            <ol className="col-span-12 lg:col-span-6 lg:col-start-7">
              {process.map((s, i) => (
                <li
                  key={s.index}
                  ref={(el) => {
                    stageRefs.current[i] = el;
                  }}
                  className="border-t border-bone-14 py-8 first:border-t-0 lg:min-h-[58vh] lg:py-14"
                >
                  {/* Drawing — only mounted where it is actually seen */}
                  {!isDesktop && (
                    <div className="mb-6 aspect-[4/3] overflow-hidden bg-ink lg:hidden">
                      <SmartImage
                        src={`process-${s.index}.webp`}
                        alt={`${s.title} — stage ${s.index}`}
                        plate={s.plate}
                        tone="dark"
                        className="h-full w-full"
                        sizes="100vw"
                      />
                    </div>
                  )}

                  <div className="flex items-baseline gap-5">
                    <span
                      className={`meta-sm shrink-0 transition-colors duration-500 ${
                        active === i ? "text-oxide-tint" : "text-bone-35"
                      }`}
                    >
                      {s.index}
                    </span>
                    <h3 className="text-[clamp(1.6rem,3vw,2.6rem)] leading-none tracking-[-0.035em] text-bone">
                      {s.title}
                    </h3>
                    <span className="meta-sm ml-auto hidden text-bone-25 lg:block">
                      {s.kicker}
                    </span>
                  </div>

                  <p className="body-copy mt-4 max-w-[52ch] pl-9 text-bone-60 lg:pl-12">
                    {s.body}
                  </p>

                  <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 pl-9 lg:pl-12">
                    {s.outputs.map((o) => (
                      <li key={o} className="meta-sm text-bone-35">
                        <span className="mr-2 text-oxide">/</span>
                        {o}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}

              <li className="border-t border-bone-14 pt-8 lg:pt-12">
                <Link href="/process" className={buttonGhostDark} data-cursor="Open">
                  Full process on one page
                  <span className="arrow-shift" aria-hidden>
                    →
                  </span>
                </Link>
              </li>
            </ol>
          </div>
        </div>
      </div>

      <div className="shell relative mt-16">
        <TickChain tone="dark" className="opacity-60" />
        <Reveal>
          <p className="meta-sm mt-4 text-bone-35">
            Adjustments to this sequence to match how the company actually works.
          </p>
        </Reveal>
      </div>
    </section>
  );
}