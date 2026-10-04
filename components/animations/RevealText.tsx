"use client";

import { useRef } from "react";
import { useGsap } from "@/lib/utils/motion";
import { usePrefersReducedMotion, useIsomorphicLayoutEffect } from "@/lib/utils/hooks";

type Props = {
  /** Plain text. Word-level masked reveal. */
  text: string;
  className?: string;
  wordClassName?: string;
  /** Reveal trigger offset. */
  start?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  /** Skip scroll trigger and play immediately (hero entrances). */
  immediate?: boolean;
  as?: "span" | "h1" | "h2" | "h3" | "p";
};

/**
 * RevealText
 * Word-level masked reveal: each word rises from beneath its own clipping
 * box. Under reduced motion the text is simply present.
 */
export default function RevealText({
  text,
  className = "",
  wordClassName = "",
  start = "top 86%",
  delay = 0,
  stagger = 0.055,
  duration = 1.15,
  immediate = false,
  as: Tag = "span",
}: Props) {
  const root = useRef<HTMLElement>(null);
  const gsap = useGsap();
  const reduced = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el || reduced || !gsap) return;
    const words = el.querySelectorAll<HTMLElement>("[data-word]");
    if (!words.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { yPercent: 112 },
        {
          yPercent: 0,
          duration,
          delay,
          ease: "expo.out",
          stagger,
          ...(immediate
            ? {}
            : {
                scrollTrigger: { trigger: el, start, once: true },
              }),
        },
      );
    }, el);

    return () => ctx.revert();
  }, [gsap, reduced, text, immediate, start, delay, stagger, duration]);

  const words = text.split(" ");

  return (
    <Tag ref={root as never} className={className}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden pb-[0.14em] align-bottom [clip-path:inset(-0.2em_0_-0.02em_0)]"
        >
          <span data-word className={`inline-block will-change-transform ${wordClassName}`}>
            {word}
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}