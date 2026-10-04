"use client";

import type { ReactNode } from "react";
import { scrollToId } from "@/lib/utils/smooth-scroll";

/**
 * A button that scrolls to a section on the current page. Exists as its own
 * client component so server-rendered pages can offer in-page navigation
 * without becoming client components themselves.
 */
export default function ScrollToButton({
  target,
  className = "",
  cursorLabel,
  children,
}: {
  target: string;
  className?: string;
  cursorLabel?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => scrollToId(target)}
      className={className}
      data-cursor={cursorLabel}
    >
      {children}
    </button>
  );
}