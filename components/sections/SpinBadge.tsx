"use client";

import { useRef } from "react";
import { gsap } from "gsap";

/**
 * Rotating badge. Scrolling spins it (data-spin, handled by ScrollFX);
 * hovering whips it up to speed, and a click reverses it.
 */
export default function SpinBadge() {
  const svg = useRef<SVGSVGElement>(null);
  const dir = useRef(1);

  const rate = (to: number, duration = 0.7) => {
    const anim = svg.current?.getAnimations()[0];
    if (anim) gsap.to(anim, { playbackRate: to * dir.current, duration, ease: "power3.out", overwrite: true });
  };

  return (
    <button
      type="button"
      data-spin="160"
      data-cursor="Spin"
      aria-label="Six trades, one team, one scope. Decorative badge: press to reverse its spin."
      className="block h-28 w-28 rounded-full md:h-36 md:w-36"
      onPointerEnter={() => rate(9)}
      onPointerLeave={() => rate(1)}
      onFocus={() => rate(9)}
      onBlur={() => rate(1)}
      onClick={() => {
        dir.current *= -1;
        rate(9, 0.4);
      }}
    >
      <svg ref={svg} viewBox="0 0 120 120" className="spin-slow h-full w-full" aria-hidden>
        <defs>
          <path id="badge-circle" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" />
        </defs>
        <circle cx="60" cy="60" r="58" fill="var(--color-ink)" />
        <text fill="var(--color-cream)" style={{ fontSize: 10.5, fontWeight: 800, textTransform: "uppercase" }}>
          <textPath href="#badge-circle" textLength="283" lengthAdjust="spacing">
            Six trades · One team · One scope ·
          </textPath>
        </text>
        <path d="M44 38h32v10H54v4h22v22H44V64h22v-4H44z" fill="var(--color-orange)" transform="translate(0 4)" />
      </svg>
    </button>
  );
}
