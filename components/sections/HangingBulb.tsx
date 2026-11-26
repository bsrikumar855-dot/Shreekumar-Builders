"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { getLenis } from "@/lib/utils/smooth-scroll";

/**
 * The hero's hanging light bulb.
 *   - It is a damped pendulum: idle sway, fast scrolling gives it a kick,
 *     drag it and it follows your pointer / finger, then swings back.
 *   - Click, tap (or Enter / Space) switches it on and off. It flickers on
 *     like a real filament and throws a warm glow over the hero.
 * With prefers-reduced-motion it simply stays on, with no physics.
 */
const PIVOT_X = 360; // cable top, in viewBox units
const VIEW_W = 720;
const CX = 360; // globe centre
const CY = 455;
const RAYS = [-135, -108, -81, -54, -27, 0, 27, 54, 81, 108, 135];

export default function HangingBulb() {
  const wrap = useRef<HTMLDivElement>(null);
  const swing = useRef<SVGGElement>(null);
  const [on, setOn] = useState(false);
  const [flick, setFlick] = useState(0);
  const [touched, setTouched] = useState(false);
  const userToggled = useRef(false);

  const toggle = () => {
    userToggled.current = true;
    setTouched(true);
    setOn((v) => !v);
  };

  // Every switch-on restarts the filament flicker
  useEffect(() => {
    if (on) setFlick((k) => k + 1);
  }, [on]);

  useEffect(() => {
    const el = swing.current;
    const box = wrap.current;
    if (!el || !box) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setOn(true);
      return;
    }

    // Switch on by itself shortly after load (unless the visitor got there first)
    const auto = window.setTimeout(() => {
      if (!userToggled.current) setOn(true);
    }, 1100);

    let angle = 0; // degrees, + = clockwise
    let vel = 0; // deg / s
    let dragging = false;
    let t = 0;
    let wind = 0;
    const K = 26;
    const C = 1.7;
    const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));

    const tick = (_: number, deltaMs: number) => {
      const dt = Math.min(deltaMs, 40) / 1000;
      t += dt;
      if (!dragging) {
        wind *= Math.exp(-3 * dt);
        const rest = Math.sin(t * 0.96) * 1.6 + wind;
        const acc = -K * (angle - rest) - C * vel;
        vel += acc * dt;
        angle += vel * dt;
      }
      el.style.transform = `rotate(${angle.toFixed(3)}deg)`;
    };
    gsap.ticker.add(tick);

    const lenis = getLenis();
    const onScroll = (l: { velocity: number }) => {
      if (!dragging) wind = clamp(l.velocity, 40) * 0.35;
    };
    lenis?.on("scroll", onScroll as never);

    const pivot = () => {
      const r = box.getBoundingClientRect();
      return { x: r.left + (PIVOT_X / VIEW_W) * r.width, y: r.top };
    };
    let last = 0;
    let lastT = 0;
    let startX = 0;
    let startY = 0;
    let startT = 0;
    let moved = 0;
    const toAngle = (e: PointerEvent) => {
      const p = pivot();
      return clamp((-Math.atan2(e.clientX - p.x, Math.max(80, e.clientY - p.y)) * 180) / Math.PI, 38);
    };
    const down = (e: PointerEvent) => {
      e.preventDefault();
      dragging = true;
      document.body.style.userSelect = "none";
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
      last = angle;
      lastT = performance.now();
      startT = lastT;
      startX = e.clientX;
      startY = e.clientY;
      moved = 0;
      document.documentElement.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      moved = Math.max(moved, Math.hypot(e.clientX - startX, e.clientY - startY));
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
      document.documentElement.style.cursor = "";
      document.body.style.userSelect = "";
      // A short, still press is a click: flip the switch
      if (moved < 6 && performance.now() - startT < 400) {
        vel = 0;
        toggle();
      } else {
        vel = clamp(vel, 600);
        setTouched(true);
      }
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);

    return () => {
      window.clearTimeout(auto);
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

  const glass = "M318 318 C318 352 210 372 210 455 A150 150 0 0 0 510 455 C510 372 402 352 402 318 Z";

  return (
    <div ref={wrap} className="relative">
      {/* Warm glow cast over the hero (multiply keeps the black type black) */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[65%] aspect-square w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-[900ms] ease-out"
        style={{
          opacity: on ? 1 : 0,
          mixBlendMode: "multiply",
          background:
            "radial-gradient(circle, rgba(255,196,92,0.85) 0%, rgba(255,150,50,0.4) 28%, rgba(244,98,11,0.12) 48%, transparent 66%)",
        }}
      />

      <svg
        viewBox="0 0 720 700"
        role="group"
        aria-label="Hanging light bulb"
        className="pointer-events-none relative h-auto w-full overflow-visible"
      >
        <defs>
          <radialGradient id="bulb-lit" cx="50%" cy="46%" r="62%">
            <stop offset="0" stopColor="#fff7d1" />
            <stop offset="0.5" stopColor="var(--color-orange-soft)" />
            <stop offset="1" stopColor="var(--color-orange)" />
          </radialGradient>
        </defs>

        <g
          ref={swing}
          data-cursor="Switch"
          role="button"
          tabIndex={0}
          aria-pressed={on}
          aria-label="Light bulb. Press to switch it on or off. Drag to swing it."
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggle();
            }
          }}
          style={{
            transformOrigin: `${PIVOT_X}px 0px`,
            pointerEvents: "auto",
            cursor: "grab",
            touchAction: "pan-y",
            userSelect: "none",
            outline: "none",
          }}
        >
          {/* generous invisible hit area */}
          <rect x="180" y="190" width="360" height="400" fill="transparent" />

          {/* cable */}
          <line x1="360" y1="-600" x2="360" y2="205" stroke="var(--color-ink)" strokeWidth="7" />

          {/* rays */}
          <g
            stroke="var(--color-orange)"
            strokeWidth="9"
            strokeLinecap="round"
            style={{ opacity: on ? 1 : 0, transition: "opacity 0.6s", transformOrigin: `${CX}px ${CY}px` }}
          >
            {RAYS.map((a) => {
              const r = (a * Math.PI) / 180;
              const x1 = CX + Math.sin(r) * 190;
              const y1 = CY + Math.cos(r) * 190;
              const x2 = CX + Math.sin(r) * 232;
              const y2 = CY + Math.cos(r) * 232;
              return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} />;
            })}
          </g>

          {/* socket */}
          <rect x="338" y="198" width="44" height="52" rx="6" fill="var(--color-ink)" />
          <rect x="318" y="248" width="84" height="30" fill="var(--color-ink)" />
          <rect x="314" y="276" width="92" height="16" fill="var(--color-rust)" stroke="var(--color-ink)" strokeWidth="4" />
          <rect x="314" y="292" width="92" height="16" fill="var(--color-rust)" stroke="var(--color-ink)" strokeWidth="4" />
          <rect x="324" y="308" width="72" height="14" fill="var(--color-ink)" />

          {/* glass: off state */}
          <path d={glass} fill="var(--color-sand)" stroke="var(--color-ink)" strokeWidth="7" strokeLinejoin="round" />
          {/* glass: lit state (fades in, flickers on every switch-on) */}
          <path
            key={flick}
            d={glass}
            fill="url(#bulb-lit)"
            className={on ? "bulb-flicker" : ""}
            style={{ opacity: on ? 1 : 0, transition: "opacity 0.35s" }}
          />
          <path d={glass} fill="none" stroke="var(--color-ink)" strokeWidth="7" strokeLinejoin="round" />

          {/* highlight */}
          <path d="M262 440 A104 104 0 0 1 310 362" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" opacity="0.75" />

          {/* filament */}
          <g
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke={on ? "#fff" : "var(--color-ink)"}
            style={{ filter: on ? "drop-shadow(0 0 7px #ff9a2e)" : "none", transition: "stroke 0.3s" }}
          >
            <path d="M344 322V398M376 322V398" />
            <path d="M344 398q8 -34 16 0q8 34 16 0" />
          </g>
        </g>
      </svg>

      {/* Affordance: disappears after the first interaction */}
      <span
        aria-hidden
        className={`label pointer-events-none absolute left-[62%] top-[10%] hidden bg-ink px-3 py-2 text-cream transition-opacity duration-700 md:block ${
          touched ? "opacity-0" : "opacity-100"
        }`}
      >
        Click the bulb · Drag to swing
      </span>
    </div>
  );
}
