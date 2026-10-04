"use client";

import { useEffect, useRef, useState } from "react";
import { ensureGsap, gsap } from "@/lib/utils/motion";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/utils/hooks";

/**
 * Cursor
 * Desktop-only. A fine ring that trails the pointer with a slight lag,
 * expands and takes a label over anything carrying `data-cursor`.
 * Never rendered on touch devices or under reduced motion.
 */
export default function Cursor() {
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const enabled = fine && !reduced;

  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const ringEl = ring.current;
    const dotEl = dot.current;
    if (!enabled || !ringEl || !dotEl) return;
    ensureGsap();
    document.documentElement.dataset.customCursor = "on";

    const xTo = gsap.quickTo(ringEl, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(ringEl, "y", { duration: 0.4, ease: "power3" });
    const dxTo = gsap.quickTo(dotEl, "x", { duration: 0.08, ease: "power2" });
    const dyTo = gsap.quickTo(dotEl, "y", { duration: 0.08, ease: "power2" });

    let visible = false;

    const move = (e: PointerEvent) => {
      if (!visible) {
        visible = true;
        gsap.to([ringEl, dotEl], { opacity: 1, duration: 0.25 });
      }
      xTo(e.clientX);
      yTo(e.clientY);
      dxTo(e.clientX);
      dyTo(e.clientY);

      const hit = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "a[href], button, [data-cursor]",
      );
      setLabel(hit ? (hit.dataset.cursor ?? "View") : null);
    };

    const leave = () => {
      visible = false;
      gsap.to([ringEl, dotEl], { opacity: 0, duration: 0.2 });
      setLabel(null);
    };

    const press = () => gsap.to(ringEl, { scale: 0.78, duration: 0.2, overwrite: "auto" });
    const release = () => gsap.to(ringEl, { scale: 1, duration: 0.4, overwrite: "auto" });

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", press);
    window.addEventListener("pointerup", release);

    return () => {
      delete document.documentElement.dataset.customCursor;
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("pointerup", release);
      gsap.killTweensOf([ringEl, dotEl]);
    };
  }, [enabled]);

  // Label state drives the expansion — a single tween, not a re-render churn.
  useEffect(() => {
    if (!enabled || !ring.current) return;
    gsap.to(ring.current, {
      scale: label ? 2.55 : 1,
      borderColor: label ? "rgba(189,91,26,0.75)" : "rgba(18,17,16,0.4)",
      duration: 0.55,
      ease: "expo.out",
      overwrite: "auto",
    });
  }, [label, enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      <div
        ref={ring}
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border border-ink/40 opacity-0 will-change-transform"
        style={{ width: 30, height: 30, marginLeft: -15, marginTop: -15 }}
      >
        <span
          className="meta-sm whitespace-nowrap text-oxide-deep transition-opacity duration-300"
          style={{ opacity: label ? 1 : 0 }}
        >
          {label}
        </span>
      </div>
      <div
        ref={dot}
        className="absolute left-0 top-0 h-[4px] w-[4px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink opacity-0 will-change-transform"
      />
    </div>
  );
}