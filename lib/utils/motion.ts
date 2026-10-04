"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState } from "react";

let registered = false;

/** Registers GSAP plugins once, on the client only. */
export function ensureGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: "expo.out", duration: 1 });
    gsap.config({ nullTargetWarn: false });
    registered = true;
  }
  return gsap;
}

/**
 * Returns the GSAP instance once mounted on the client, `null` during SSR
 * and the first client render so markup stays identical on both sides.
 */
export function useGsap() {
  const [instance, setInstance] = useState<typeof gsap | null>(null);
  useEffect(() => setInstance(ensureGsap()), []);
  return instance;
}

/** Alias kept short for component use. */
export const useGsapContext = useGsap;

/** Shared easing vocabulary — physical deceleration, no bounce. */
export const EASE = {
  /** Default reveal: fast out, long settle. */
  out: "expo.out",
  /** Masked text entrances. */
  mask: "expo.inOut",
  /** Scroll-scrubbed values (linear, driven by scroll). */
  scrub: "none",
  /** Micro-interactions. */
  snap: "power3.out",
} as const;

/** Section reveal timings, in seconds. */
export const T = {
  fast: 0.5,
  base: 0.9,
  slow: 1.3,
  stagger: 0.055,
} as const;

export { gsap, ScrollTrigger };