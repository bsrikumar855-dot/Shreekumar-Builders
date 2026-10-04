"use client";

import { useEffect, useRef } from "react";
import { useGsap } from "@/lib/utils/motion";
import { usePrefersReducedMotion } from "@/lib/utils/hooks";
import { getLenis } from "@/lib/utils/smooth-scroll";

type Props = {
  onComplete: () => void;
  /**
   * `poster` renders the finished brand sheet with no JavaScript animation.
   * It is what the server sends and what paints on the first frame, so the
   * first thing a visitor sees is already composed — never a blank screen and
   * never a flash of the hero behind a curtain.
   * `live` runs the full sequence on top of that same state.
   */
  mode?: "poster" | "live";
};

/**
 * Preloader
 * A drawn entrance, not a progress counter. The sheet carries the wordmark
 * from the very first frame; then a hairline rules itself beneath it, a marker
 * travels the rule, and the sheet lifts to reveal the hero. Once per session.
 */
export default function Preloader({ onComplete, mode = "live" }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const gsap = useGsap();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (mode !== "live") return;
    const el = root.current;
    if (!el || !gsap) return;

    getLenis()?.stop();
    document.documentElement.dataset.intro = "on";

    const finish = () => {
      delete document.documentElement.dataset.intro;
      getLenis()?.start();
      onComplete();
    };

    if (reduced) {
      finish();
      return;
    }

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "expo.out" }, onComplete: finish })
        // The rule draws itself beneath the wordmark.
        .fromTo("[data-pre-mark]", { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "expo.inOut" })
        .fromTo(
          "[data-pre-runner]",
          { left: "0%" },
          { left: "100%", duration: 0.5, ease: "power2.inOut" },
          0.22,
        )
        .fromTo("[data-pre-sub]", { opacity: 0 }, { opacity: 1, duration: 0.35 }, 0.34)
        .to(el, { yPercent: -100, duration: 0.78, ease: "expo.inOut" }, 0.66);
    }, el);

    return () => {
      ctx.revert();
      delete document.documentElement.dataset.intro;
    };
  }, [gsap, reduced, onComplete, mode]);

  return (
    <div
      ref={root}
      data-intro-sheet
      className="surface-ink fixed inset-0 z-[120] flex items-center justify-center"
      role="status"
      aria-label="Loading Shreekumar Builders"
    >
      <div className="shell">
        <div className="mx-auto max-w-2xl">
          <p className="meta text-[0.7rem] tracking-[0.34em] text-bone">
            <span className="mr-4">SHREEKUMAR</span>
            <span>BUILDERS</span>
          </p>

          <div className="relative mt-5 h-px w-full overflow-hidden bg-bone-14">
            <span
              data-pre-mark
              className="absolute inset-0 origin-left bg-oxide"
              style={{ transform: "scaleX(0)" }}
            />
            <span
              data-pre-runner
              className="absolute top-1/2 h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 bg-bone"
              style={{ left: "0%" }}
            />
          </div>

          <p
            data-pre-sub
            className="meta-sm mt-3 text-bone-45"
            style={{ opacity: 0 }}
          >
            Building · Civil · Electrical · Plumbing · Tiling
          </p>
        </div>
      </div>
    </div>
  );
}