"use client";

import { useRef } from "react";
import Link from "next/link";
import SmartImage from "@/components/ui/SmartImage";
import Reveal from "@/components/animations/Reveal";
import RevealText from "@/components/animations/RevealText";
import { SectionMark, TickChain } from "@/components/ui/Drafting";
import { projects, scopeLabel } from "@/lib/data/projects";
import { services } from "@/lib/data/services";
import { useGsap, ScrollTrigger } from "@/lib/utils/motion";
import { usePrefersReducedMotion, useIsomorphicLayoutEffect } from "@/lib/utils/hooks";

/**
 * ProjectsShowcase — Act 04
 * Desktop: the gallery is held in a sticky viewport while vertical scroll is
 * translated into a horizontal run of full-height panels, tracked by a
 * hairline progress rule.
 *
 * The hold uses `position: sticky` rather than ScrollTrigger's `pin`, which
 * rewrites layout and produced measurable cumulative layout shift. Sticky
 * moves nothing, so the only thing scroll drives is the track's transform.
 *
 * Mobile: the same panels stack — designed for the viewport, not squeezed.
 */
export default function ProjectsShowcase() {
  const spacer = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const gsap = useGsap();
  const reduced = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (!gsap || reduced || !spacer.current || !stickyRef.current || !track.current) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const rail = track.current!;
      const runway = spacer.current!;
      const stickyEl = stickyRef.current!;

      const measure = () => Math.max(0, rail.scrollWidth - window.innerWidth);

      /* The runway is a *sibling* of the sticky box inside the same wrapper.
         Neither padding on the wrapper nor `overflow` on the sticky box will do:
         in Blink a sticky element only moves if its containing block is
         taller than it is, and a clipping sticky box never sticks at all. */
      const apply = () => {
        runway.style.height = `${measure()}px`;
        gsap.set(rail, { x: 0 });
        ScrollTrigger.refresh();
      };

      apply();

      const tween = gsap.to(rail, {
        x: () => -measure(),
        ease: "none",
        scrollTrigger: {
          trigger: stickyEl,
          start: "top top",
          end: () => `+=${measure()}`,
          scrub: 0.5,
          invalidateOnRefresh: true,
          onRefresh: () => {
            runway.style.height = `${measure()}px`;
            if (progress.current) gsap.set(progress.current, { scaleX: 0 });
          },
          onUpdate: (self) => {
            if (progress.current) gsap.set(progress.current, { scaleX: self.progress });
          },
        },
      });

      window.addEventListener("resize", apply);

      return () => {
        window.removeEventListener("resize", apply);
        tween.kill();
        runway.style.height = "";
      };
    });

    return () => mm.revert();
  }, [gsap, reduced]);

  const total = projects.length;

  return (
    <section
      data-surface="light"
      aria-labelledby="projects-title"
      className="grain relative border-t border-ink-12 pt-[var(--spacing-section)]"
    >
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionMark index="04" label="Selected work" />
            <h2 id="projects-title" className="heading mt-7 max-w-[14ch] text-ink">
              <span className="block">Built work,</span>
              <span className="serif block font-normal italic">documented.</span>
            </h2>
          </div>
          <Link
            href="/projects"
            className="link-rule meta text-ink-70 transition-colors hover:text-oxide"
            data-cursor="All"
          >
            All projects ({String(total).padStart(2, "0")})
          </Link>
        </div>
      </div>

      <div className="mt-12 lg:mt-16">
        <TickChain />
      </div>

      <div className="relative mt-px">
        <div className="relative">
          {/* The sticky box must not clip and its wrapper must not be padded —
              both disable the stick in Blink. Clipping happens one level in,
              the scroll runway is a sibling below. */}
          <div ref={stickyRef} className="lg:sticky lg:top-0 lg:h-[100svh] lg:pt-14">
            <div className="lg:h-[calc(100svh_-_3.5rem)] lg:overflow-hidden">
              <div
                ref={track}
                data-gallery-track
                className="flex h-full flex-col gap-y-14 px-[var(--spacing-gutter)] lg:w-max lg:flex-row lg:gap-x-6 lg:gap-y-0 lg:pr-[calc(var(--spacing-gutter)*3)]"
              >
                {projects.map((p, i) => (
                  <ProjectPanel key={p.slug} project={p} index={i} total={total} />
                ))}
              </div>
            </div>
          </div>
          {/* Scroll runway */}
          <div ref={spacer} aria-hidden className="hidden lg:block" />
        </div>
      </div>

      <div className="shell hidden pb-20 lg:block">
        <div className="mt-8 h-px w-full bg-ink-12">
          <div
            ref={progress}
            className="h-px w-full origin-left bg-oxide"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
        <p className="meta-sm mt-3 text-ink-45">Scroll to move across the set</p>
      </div>
    </section>
  );
}

function ProjectPanel({
  project,
  index,
  total,
}: {
  project: (typeof projects)[number];
  index: number;
  total: number;
}) {
  return (
    <article className="group flex w-full shrink-0 flex-col lg:h-full lg:w-[54vw] lg:max-w-[46rem] xl:w-[48vw]">
      <Reveal y={30} className="flex min-h-0 flex-1 flex-col">
        <Link
          href={`/projects/${project.slug}`}
          data-cursor="Open"
          className="relative flex min-h-[56svh] flex-1 flex-col overflow-hidden bg-limestone"
        >
          <div className="absolute inset-0 transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.045]">
            <SmartImage
              src={project.image}
              alt={`${project.title} — Shreekumar Builders`}
              plate={project.plate}
              className="h-full w-full"
              sizes="(max-width: 1023px) 100vw, 46rem"
            />
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-5 lg:p-7">
            <span className="meta border border-ink/20 bg-bone/85 px-2.5 py-1.5 text-ink backdrop-blur-sm">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <span className="meta-sm hidden max-w-[40%] text-right text-ink-45 sm:block">
              {project.placeholder ? "Awaiting site photography" : project.category}
            </span>
          </div>
        </Link>
      </Reveal>

      <div className="mt-5 shrink-0 border-t border-ink-12 pt-5">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <RevealText
            as="h3"
            text={project.title}
            className="text-[clamp(1.5rem,2.4vw,2.3rem)] leading-none tracking-[-0.03em] text-ink"
          />
          <p className="meta-sm text-ink-45">
            {project.location} · {project.year}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {project.scope.map((s) => (
            <span key={s} className="meta-sm border border-ink-12 px-2 py-1 text-ink-45">
              {scopeLabel(s, services)}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}