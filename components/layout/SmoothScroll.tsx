"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { ensureGsap, gsap, ScrollTrigger } from "@/lib/utils/motion";
import { getLenis, setLenis } from "@/lib/utils/smooth-scroll";
import { usePrefersReducedMotion } from "@/lib/utils/hooks";

/**
 * SmoothScroll
 * Single owner of smooth scrolling. Lenis drives the RAF loop, GSAP's ticker
 * is bound to it, and ScrollTrigger updates from Lenis' scroll event — the
 * standard, stable wiring. Disabled entirely when the user prefers reduced
 * motion, in which case native scrolling takes over.
 */
export default function SmoothScroll() {
  const reduced = usePrefersReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    ensureGsap();

    if (reduced) {
      setLenis(null);
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      // Exponential ease-out: physical deceleration, no overshoot.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.7,
    });

    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Trigger positions depend on final font metrics.
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) void document.fonts.ready.then(refresh).catch(() => {});
    const settle = window.setTimeout(refresh, 500);

    return () => {
      window.clearTimeout(settle);
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, [reduced]);

  // Route change: return to the top and drop stale trigger positions.
  useEffect(() => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
    ScrollTrigger.getAll().forEach((st) => st.refresh());
  }, [pathname]);

  return null;
}