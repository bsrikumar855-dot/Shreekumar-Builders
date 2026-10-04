"use client";

import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis(): Lenis | null {
  return instance;
}

/**
 * Scrolls to a section id, respecting the header height.
 * Uses Lenis when available, falls back to native scrolling otherwise.
 */
export function scrollToId(id: string, offset = -8) {
  if (typeof window === "undefined") return;
  const el = document.getElementById(id);
  if (!el) return;

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(el, { offset, duration: 1.35 });
    return;
  }
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: "smooth" });
}

/** Smooth scroll back to the very top. */
export function scrollToTop() {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(0, { duration: 1.2 });
    return;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}