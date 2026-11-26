"use client";

import type Lenis from "lenis";

/** Shared handle on the single Lenis instance (owned by ScrollFX). */
let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis(): Lenis | null {
  return instance;
}
