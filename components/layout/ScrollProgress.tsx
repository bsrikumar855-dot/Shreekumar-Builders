"use client";

import { useEffect, useRef } from "react";
import { useGsap } from "@/lib/utils/motion";
import { usePrefersReducedMotion } from "@/lib/utils/hooks";

/**
 * ScrollProgress
 * A single hairline that draws itself across the top of the viewport as the
 * page is read. The only persistent progress affordance on the site.
 */
export default function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const gsap = useGsap();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = bar.current;
    if (!el || !gsap || reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.25,
          },
        },
      );
    });
    return () => ctx.revert();
  }, [gsap, reduced]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-px bg-ink-06"
    >
      <div
        ref={bar}
        className="h-px w-full origin-left bg-oxide"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}