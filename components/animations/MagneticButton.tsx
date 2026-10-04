"use client";

import { useRef, type ReactNode } from "react";
import Link from "next/link";
import { useGsap } from "@/lib/utils/motion";
import { useFinePointer, usePrefersReducedMotion } from "@/lib/utils/hooks";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  innerClassName?: string;
  /** Maximum pull toward the pointer, in px. */
  strength?: number;
  cursorLabel?: string;
  ariaLabel?: string;
  target?: string;
  rel?: string;
};

/**
 * MagneticButton
 * A restrained magnetic pull. The element drifts toward the pointer within
 * its own bounds; the label drifts slightly further. Disabled on touch and
 * under reduced motion, and the element stays a plain link underneath.
 */
export default function MagneticButton({
  children,
  href,
  onClick,
  className = "",
  innerClassName = "",
  strength = 14,
  cursorLabel,
  ariaLabel,
  target,
  rel,
}: Props) {
  const root = useRef<HTMLElement>(null);
  const inner = useRef<HTMLSpanElement>(null);
  const gsap = useGsap();
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();
  const enabled = fine && !reduced && Boolean(gsap);

  const attach = (el: HTMLElement | null) => {
    root.current = el;
  };

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!enabled || !root.current) return;
    const rect = root.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    gsap!.to(root.current, {
      x: (relX / (rect.width / 2)) * strength,
      y: (relY / (rect.height / 2)) * strength,
      duration: 0.5,
      ease: "power3.out",
      overwrite: "auto",
    });
    if (inner.current) {
      gsap!.to(inner.current, {
        x: (relX / (rect.width / 2)) * strength * 0.4,
        y: (relY / (rect.height / 2)) * strength * 0.4,
        duration: 0.6,
        ease: "power3.out",
        overwrite: "auto",
      });
    }
  };

  const onLeave = () => {
    if (!root.current) return;
    gsap!.to(root.current, { x: 0, y: 0, duration: 0.7, ease: "expo.out", overwrite: "auto" });
    if (inner.current)
      gsap!.to(inner.current, { x: 0, y: 0, duration: 0.8, ease: "expo.out", overwrite: "auto" });
  };

  const shared = {
    ref: attach as never,
    onPointerMove: onMove,
    onPointerLeave: onLeave,
    className: `inline-flex will-change-transform ${className}`,
    "data-cursor": cursorLabel,
    "aria-label": ariaLabel,
  };

  const innerEl = <span ref={inner} className={`inline-flex items-center gap-2.5 ${innerClassName}`}>{children}</span>;

  if (href) {
    const isExternal = href.startsWith("http") || href.startsWith("mailto") || href.startsWith("tel");
    if (isExternal) {
      return (
        <a href={href} target={target} rel={rel} {...shared}>
          {innerEl}
        </a>
      );
    }
    return (
      <Link href={href} {...shared}>
        {innerEl}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} {...shared}>
      {innerEl}
    </button>
  );
}

/** Shared button chrome — used by CTAs across the site. */
export const buttonBase =
  "group relative inline-flex items-center justify-center overflow-hidden border px-7 py-4 meta transition-colors duration-500";

export const buttonSolid =
  `${buttonBase} border-ink bg-ink text-bone hover:border-oxide hover:bg-oxide`;

export const buttonGhost =
  `${buttonBase} border-ink-22 text-ink hover:border-ink hover:bg-ink hover:text-bone`;

export const buttonGhostDark =
  `${buttonBase} border-bone-35 text-bone hover:border-oxide-tint hover:bg-oxide-tint hover:text-ink`;