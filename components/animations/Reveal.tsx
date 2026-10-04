"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { useGsap } from "@/lib/utils/motion";
import { usePrefersReducedMotion, useIsomorphicLayoutEffect } from "@/lib/utils/hooks";

type Direction = "up" | "down" | "left" | "right" | "none";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
  direction?: Direction;
  start?: string;
  blur?: boolean;
  immediate?: boolean;
  as?: ElementType;
};

/**
 * Reveal
 * A restrained scroll entrance. Used sparingly — only where an element needs
 * to announce itself as the reader arrives. Fades and translates, nothing more.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  duration = 1.1,
  y = 26,
  x = 0,
  direction,
  start = "top 88%",
  blur = false,
  immediate = false,
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const gsap = useGsap();
  const reduced = usePrefersReducedMotion();

  const dir = direction ?? (x === 0 ? "up" : "none");

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced || !gsap) return;

    const offset =
      dir === "left" ? { x: y * 1.2, y: 0 } : dir === "right" ? { x: -y * 1.2, y: 0 } : { x, y };

    const from: gsap.TweenVars = { opacity: 0, ...(dir === "none" ? { x, y } : offset) };
    if (blur) from.filter = "blur(6px)";

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        from,
        {
          opacity: 1,
          x: 0,
          y: 0,
          filter: "blur(0px)",
          duration,
          delay,
          ease: "expo.out",
          ...(immediate ? {} : { scrollTrigger: { trigger: el, start, once: true } }),
        },
      );
    }, el);

    return () => ctx.revert();
  }, [gsap, reduced, dir, x, y, delay, duration, start, blur, immediate]);

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}