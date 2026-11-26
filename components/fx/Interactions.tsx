"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Pointer interactions, delegated from the document so they survive route
 * changes without rebinding:
 *
 *   - Cursor follower: a small dot that swells over links and shows a label
 *     (data-cursor="View") over rich targets. Additive: the system cursor
 *     stays visible.
 *   - data-tilt: card tilts in 3D toward the pointer.
 *   - .btn: buttons are gently pulled toward the pointer (magnetic).
 *
 * Fine pointers only, and never with prefers-reduced-motion.
 */
export default function Interactions() {
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const d = dot.current;
    const text = label.current;
    if (!fine || reduced || !d || !text) return;

    const x = gsap.quickTo(d, "x", { duration: 0.3, ease: "power3.out" });
    const y = gsap.quickTo(d, "y", { duration: 0.3, ease: "power3.out" });

    let tilted: HTMLElement | null = null;
    let pulled: HTMLElement | null = null;

    const resetTilt = (el: HTMLElement) =>
      gsap.to(el, { rotationX: 0, rotationY: 0, duration: 0.8, ease: "elastic.out(1,0.5)", overwrite: "auto" });
    const resetPull = (el: HTMLElement) =>
      gsap.to(el, { "--mx": "0px", "--my": "0px", duration: 0.7, ease: "elastic.out(1,0.4)", overwrite: "auto" });

    const last = { x: 0, y: 0 };
    const setState = (t: Element | null) => {
      const cursorEl = t?.closest<HTMLElement>("[data-cursor]");
      const interactive = t?.closest("a, button, [role='button'], input, select, textarea, label");
      d.dataset.state = cursorEl ? "label" : interactive ? "link" : "idle";
      text.textContent = cursorEl?.dataset.cursor ?? "";
    };

    // Content scrolling under a still pointer changes what is hovered
    let scrollRaf = 0;
    const onScroll = () => {
      if (scrollRaf || d.dataset.show !== "1") return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        setState(document.elementFromPoint(last.x, last.y));
      });
    };

    const onMove = (e: PointerEvent) => {
      last.x = e.clientX;
      last.y = e.clientY;
      x(e.clientX);
      y(e.clientY);
      d.dataset.show = "1";

      const t = e.target instanceof Element ? e.target : null;
      setState(t);

      // 3D tilt
      const tiltEl = t?.closest<HTMLElement>("[data-tilt]") ?? null;
      if (tilted && tilted !== tiltEl) resetTilt(tilted);
      if (tiltEl) {
        const r = tiltEl.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(tiltEl, {
          rotationY: px * 11,
          rotationX: -py * 9,
          transformPerspective: 900,
          duration: 0.5,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
      tilted = tiltEl;

      // Magnetic buttons
      const btn = t?.closest<HTMLElement>(".btn") ?? null;
      if (pulled && pulled !== btn) resetPull(pulled);
      if (btn) {
        const r = btn.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.22;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.32;
        gsap.to(btn, { "--mx": `${dx}px`, "--my": `${dy}px`, duration: 0.4, ease: "power3.out", overwrite: "auto" });
      }
      pulled = btn;
    };

    const onLeave = () => {
      delete d.dataset.show;
      if (tilted) resetTilt(tilted);
      if (pulled) resetPull(pulled);
      tilted = pulled = null;
    };

    const onDown = () => {
      d.dataset.press = "1";
    };
    const onUp = () => {
      delete d.dataset.press;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(scrollRaf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={dot} aria-hidden className="cursor-dot" data-state="idle">
      <span ref={label} className="label" />
    </div>
  );
}
