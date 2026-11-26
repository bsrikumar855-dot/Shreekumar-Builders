"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { getLenis } from "@/lib/utils/smooth-scroll";

/**
 * Interactive crane. The hanging assembly is a damped pendulum:
 *   - it idles with a slow sway,
 *   - drag the module and it follows the pointer (or finger) like a load on
 *     a cable, then swings back under spring + damping when released,
 *   - fast scrolling gives it a kick, like wind.
 * Decorative only (aria-hidden); respects prefers-reduced-motion.
 */
const PIVOT_X = 360; // cable top, in viewBox units
const VIEW_W = 720;

export default function Crane() {
  const wrap = useRef<HTMLDivElement>(null);
  const swing = useRef<SVGGElement>(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const el = swing.current;
    const box = wrap.current;
    if (!el || !box) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let angle = 0; // degrees, + = clockwise
    let vel = 0; // deg / s
    let dragging = false;
    let t = 0;
    let wind = 0; // deg offset from scroll speed, decays quickly
    const K = 26; // spring stiffness
    const C = 1.7; // damping
    const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));

    const tick = (_: number, deltaMs: number) => {
      const dt = Math.min(deltaMs, 40) / 1000;
      t += dt;
      if (!dragging) {
        wind *= Math.exp(-3 * dt);
        const rest = Math.sin(t * 0.96) * 1.6 + wind; // idle sway + wind
        const acc = -K * (angle - rest) - C * vel;
        vel += acc * dt;
        angle += vel * dt;
      }
      el.style.transform = `rotate(${angle.toFixed(3)}deg)`;
    };
    gsap.ticker.add(tick);

    // Wind: scroll speed shifts the resting angle, the spring does the rest
    const lenis = getLenis();
    const onScroll = (l: { velocity: number }) => {
      if (!dragging) wind = clamp(l.velocity, 40) * 0.35;
    };
    lenis?.on("scroll", onScroll as never);

    // Drag
    const pivot = () => {
      const r = box.getBoundingClientRect();
      return { x: r.left + (PIVOT_X / VIEW_W) * r.width, y: r.top };
    };
    let last = 0;
    let lastT = 0;
    const toAngle = (e: PointerEvent) => {
      const p = pivot();
      // Positive rotation swings the load to the left, so mirror dx
      return clamp((-Math.atan2(e.clientX - p.x, Math.max(80, e.clientY - p.y)) * 180) / Math.PI, 38);
    };
    const down = (e: PointerEvent) => {
      e.preventDefault();
      dragging = true;
      document.body.style.userSelect = "none";
      setTouched(true);
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
      last = angle;
      lastT = performance.now();
      document.documentElement.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const next = toAngle(e);
      const now = performance.now();
      const dts = Math.max(1, now - lastT) / 1000;
      vel = (next - last) / dts;
      last = next;
      lastT = now;
      angle = next;
    };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      vel = clamp(vel, 600);
      document.documentElement.style.cursor = "";
      document.body.style.userSelect = "";
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);

    return () => {
      gsap.ticker.remove(tick);
      lenis?.off("scroll", onScroll as never);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      document.documentElement.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, []);

  return (
    <div ref={wrap} className="relative">
      <svg
        viewBox="0 0 720 700"
        className="pointer-events-none h-auto w-full overflow-visible"
        aria-hidden
      >
        <g
          ref={swing}
          data-cursor="Drag"
          style={{
            transformOrigin: `${PIVOT_X}px 0px`,
            pointerEvents: "auto",
            cursor: "grab",
            touchAction: "pan-y",
            userSelect: "none",
          }}
        >
          {/* generous invisible hit area so the whole load is easy to grab */}
          <rect x="60" y="120" width="600" height="540" fill="transparent" />
          <line x1="360" y1="-600" x2="360" y2="150" stroke="var(--color-ink)" strokeWidth="6" />
          <rect x="338" y="140" width="44" height="26" fill="var(--color-ink)" />
          <path d="M360 166v16" stroke="var(--color-ink)" strokeWidth="8" />
          <path
            d="M360 176a16 16 0 1 1-12 27"
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path d="M360 200L106 395M360 200L581 328" stroke="#4b443d" strokeWidth="3" />
          <circle cx="106" cy="395" r="9" fill="var(--color-ink)" />
          <circle cx="581" cy="328" r="9" fill="var(--color-ink)" />

          <g transform="rotate(-8 360 480)">
            <rect x="120" y="360" width="480" height="240" fill="var(--color-orange)" stroke="var(--color-ink)" strokeWidth="5" />
            {Array.from({ length: 21 }).map((_, i) => (
              <rect key={i} x={134 + i * 14} y={366} width={6} height={228} fill="var(--color-rust)" opacity={0.55} />
            ))}
            <rect x="396" y="366" width="198" height="228" fill="var(--color-cream)" />
            <path
              d="M396 386h120c40 0 52 36 22 56-24 16-60 20-60 52 0 30 38 30 38 70H396z"
              fill="var(--color-orange)"
            />
            <rect x="120" y="590" width="480" height="14" fill="var(--color-ink)" />
            <rect x="120" y="360" width="22" height="16" fill="var(--color-ink)" />
            <rect x="578" y="360" width="22" height="16" fill="var(--color-ink)" />
            <rect x="150" y="500" width="232" height="64" fill="var(--color-ink)" />
            <path d="M164 516h22v6h-14v3h14v14h-22v-6h14v-3h-14z" fill="var(--color-orange)" />
            <text
              x="198"
              y="551"
              fill="var(--color-cream)"
              style={{ fontFamily: "var(--font-display)", fontSize: 38, letterSpacing: 2 }}
            >
              SHREEKUMAR
            </text>
          </g>
        </g>
      </svg>

      {/* Affordance: disappears after the first drag */}
      <span
        aria-hidden
        className={`label pointer-events-none absolute left-[55%] top-[9%] hidden bg-ink px-3 py-2 text-cream transition-opacity duration-700 md:block ${
          touched ? "opacity-0" : "opacity-100"
        }`}
      >
        ← Drag the load →
      </span>
    </div>
  );
}
