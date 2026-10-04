"use client";

import { useRef } from "react";
import Link from "next/link";
import SmartImage from "@/components/ui/SmartImage";
import { services } from "@/lib/data/services";
import { useGsap } from "@/lib/utils/motion";
import { usePrefersReducedMotion, useIsomorphicLayoutEffect } from "@/lib/utils/hooks";
import { buttonGhost, buttonSolid } from "@/components/animations/MagneticButton";
import { scrollToId } from "@/lib/utils/smooth-scroll";

/**
 * Hero
 * Desktop: an asymmetrical composition — type set hard against the left
 * margin, a full-height axonometric drawing bleeding off the right edge, and
 * the trade index running along the baseline.
 * Below 1024px the drawing becomes a sheet in the flow, so the type is never
 * fighting a background.
 *
 * Entrances are choreographed so nothing arrives at the same moment.
 */
export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  const gsap = useGsap();
  const reduced = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el || !ready || reduced || !gsap) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

        tl.fromTo("[data-hero-frame]", { opacity: 0 }, { opacity: 1, duration: 0.7 }, 0)
          // The sheet draws open from its top edge.
          .fromTo(
            "[data-hero-plate]",
            { clipPath: "inset(0% 0% 100% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" },
            0.05,
          )
          .fromTo(
            "[data-hero-plate-inner]",
            { scale: 1.16 },
            { scale: 1, duration: 1.9, ease: "expo.out" },
            0.05,
          )
          // Metadata leads, so the eye is directed before the type lands.
          .fromTo(
            "[data-hero-meta]",
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.9, stagger: 0.08 },
            0.3,
          )
          .fromTo(
            "[data-hero-word]",
            { yPercent: 116 },
            { yPercent: 0, duration: 1.25, stagger: 0.075 },
            0.42,
          )
          .fromTo(
            "[data-hero-fade]",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1.1, stagger: 0.09 },
            0.95,
          )
          .fromTo(
            "[data-hero-rule]",
            { scaleX: 0 },
            { scaleX: 1, duration: 1.2, ease: "expo.inOut", stagger: 0.06 },
            1.05,
          )
          .fromTo("[data-hero-scroll]", { opacity: 0 }, { opacity: 1, duration: 0.8 }, 1.4);

        return () => ctx.revert();
      }, el);
      return () => ctx.revert();
    });

    mm.add("(max-width: 1023px)", () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.fromTo("[data-hero-frame]", { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0)
          .fromTo(
            "[data-hero-meta]",
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 },
            0,
          )
          .fromTo(
            "[data-hero-word]",
            { yPercent: 116 },
            { yPercent: 0, duration: 1.1, stagger: 0.07 },
            0.12,
          )
          .fromTo(
            "[data-hero-plate]",
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.inOut" },
            0.2,
          )
          .fromTo(
            "[data-hero-fade]",
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 1, stagger: 0.08 },
            0.7,
          )
          .fromTo(
            "[data-hero-rule]",
            { scaleX: 0 },
            { scaleX: 1, duration: 1.1, ease: "expo.inOut" },
            0.85,
          );
        return () => ctx.revert();
      }, el);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [gsap, reduced, ready]);

  /* Scroll indicator: a marker travelling the rule. */
  useIsomorphicLayoutEffect(() => {
    if (!ready || reduced || !gsap) return;
    const el = root.current?.querySelector("[data-scroll-runner]");
    if (!el) return;
    const tw = gsap.to(el, {
      yPercent: 260,
      duration: 1.6,
      ease: "power2.inOut",
      repeat: -1,
      repeatDelay: 0.35,
    });
    return () => {
      tw.kill();
      gsap.set(el, { yPercent: 0 });
    };
  }, [gsap, reduced, ready]);

  return (
    <section
      ref={root}
      data-surface="light"
      className="grain relative isolate flex min-h-[100svh] flex-col overflow-hidden pb-10 pt-[86px] lg:min-h-[calc(100svh_-_2px)] lg:pb-12 lg:pt-[104px]"
      aria-labelledby="hero-title"
    >
      {/* Set-out guides */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
        <div className="shell h-full">
          <div className="relative h-full">
            <div className="absolute inset-y-0 left-0 w-px bg-ink-06" />
            <div className="absolute inset-y-0 right-0 w-px bg-ink-06" />
          </div>
        </div>
      </div>

      {/* Metadata + headline */}
      <div className="shell relative z-10">
        <div className="grid grid-cols-12 gap-x-5 lg:gap-x-8">
          <div className="col-span-12 lg:col-span-9">
            <div className="flex items-center gap-4">
              <span data-hero-meta className="meta text-oxide">
                § 01
              </span>
              <span data-hero-meta aria-hidden className="h-px w-8 bg-ink-22" />
              <span data-hero-meta className="meta text-ink-45">
                Shreekumar Builders
              </span>
            </div>
          </div>

          <h1 id="hero-title" className="col-span-12 mt-6 sm:mt-8 lg:mt-10">
            <span className="block overflow-hidden pb-[0.06em] [clip-path:inset(-0.24em_0_-0.02em_0)]">
              <span data-hero-word className="display block will-change-transform">
                Built
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.06em] [clip-path:inset(-0.24em_0_-0.02em_0)] lg:pl-[8.3%]">
              <span data-hero-word className="display block will-change-transform">
                With
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.1em] [clip-path:inset(-0.3em_0_-0.02em_0)] lg:pl-[16.6%]">
              <span
                data-hero-word
                className="serif display block font-normal italic will-change-transform"
              >
                Precision
                <span className="text-oxide">.</span>
              </span>
            </span>
          </h1>
        </div>
      </div>

      {/* Drawing — a sheet in flow below 1024px, a bleed above it */}
      <div
        data-hero-frame
        aria-hidden
        className="pointer-events-none relative my-9 w-full shrink-0 overflow-hidden lg:absolute lg:inset-y-0 lg:right-0 lg:my-0 lg:w-[55%] xl:w-[52%]"
      >
        <div data-hero-plate className="relative aspect-[16/11] w-full lg:absolute lg:inset-0 lg:aspect-auto">
          <div
            data-hero-plate-inner
            className="absolute inset-0 origin-center will-change-transform"
          >
            <SmartImage
              src="hero-construction.webp"
              alt="Shreekumar Builders — construction, electrical, plumbing and tiling works"
              plate="frame"
              fit="cover"
              bare
              className="h-full w-full"
              sizes="(max-width: 1023px) 100vw, 52vw"
              priority
            />
          </div>
        </div>
        {/* Dissolve the type into the sheet instead of cutting it */}
        <div className="absolute inset-y-0 left-0 hidden w-28 bg-gradient-to-r from-bone to-transparent lg:block" />
        <div className="absolute inset-x-0 bottom-0 hidden h-40 bg-gradient-to-t from-bone to-transparent lg:block" />
      </div>

      {/* Supporting column + trade index */}
      <div className="shell relative z-10 mt-auto pt-10">
        <div className="grid grid-cols-12 items-end gap-x-5 gap-y-8 lg:gap-x-8">
          <div className="col-span-12 md:col-span-7 lg:col-span-4 lg:col-start-1">
            <p data-hero-fade className="body-copy measure text-ink-70 lg:text-[0.98rem]">
              Structure, services and finishes are planned on the same drawing and
              executed by the same team. Set out first. Built to dimension. Finished
              so it reads as one continuous job.
            </p>

            <div data-hero-fade className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => scrollToId("contact")}
                className={buttonSolid}
                data-cursor="Talk"
              >
                Start a project
                <span className="arrow-shift" aria-hidden>
                  →
                </span>
              </button>
              <Link href="/projects" className={buttonGhost} data-cursor="See">
                View our work
              </Link>
            </div>
          </div>

          {/* Trade index — real, verifiable content, standing in for the
              invented statistics this site deliberately does not carry. */}
          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <div data-hero-rule className="h-px w-full origin-left bg-ink-12" />
            <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
              {services.map((s) => (
                <li key={s.slug} data-hero-fade className="flex items-baseline gap-2">
                  <span className="meta-sm text-ink-25">{s.index}</span>
                  <Link
                    href={`/services/${s.slug}`}
                    className="meta text-ink-60 transition-colors duration-300 hover:text-oxide"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        data-hero-scroll
        className="pointer-events-none absolute bottom-8 right-[var(--spacing-gutter)] hidden flex-col items-center gap-3 lg:flex"
      >
        <span className="meta-sm [writing-mode:vertical-rl] text-ink-45">Scroll</span>
        <span className="relative block h-16 w-px overflow-hidden bg-ink-12">
          <span
            data-scroll-runner
            className="absolute left-0 top-0 block h-1/3 w-px bg-oxide"
          />
        </span>
      </div>
    </section>
  );
}