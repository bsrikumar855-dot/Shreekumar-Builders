"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { getLenis } from "@/lib/utils/smooth-scroll";

/**
 * The hero's hanging light bulb, on a real flexible cord.
 *
 *   - The cord is a chain of points (Verlet integration, distance
 *     constraints) pinned at the top, with a heavy bulb on the free end. It
 *     bends like a wire and keeps a gentle breeze going so it is never frozen.
 *   - The bulb pivots on a spring at the end of the cord, so it swings loose,
 *     overshoots and wobbles instead of tracking the cord rigidly.
 *   - Click, tap, Enter or Space switches it on and off AND shakes it, with
 *     a filament flicker and a warm glow. Drag it to pull the cord; let go
 *     and it swings back. Fast scrolling blows on it. No hover effects.
 *
 * Positions are written straight to the DOM every frame (never through React
 * state). With prefers-reduced-motion it stays still and lit.
 */
const AX = 360; // anchor x in viewBox units
const AY = -220; // anchor y (above the visible top, so the cord enters from off-screen)
const ATTACH = 205; // y of the socket top when hanging at rest
const N = 22; // cord points
const SEG = (ATTACH - AY) / (N - 1);
const VIEW_W = 720;
const CX = 360;
const CY = 455;
const RAYS = [-135, -108, -81, -54, -27, 0, 27, 54, 81, 108, 135];

export default function HangingBulb() {
  const wrap = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const cord = useRef<SVGPathElement>(null);
  const bulb = useRef<SVGGElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [flick, setFlick] = useState(0);
  const [touched, setTouched] = useState(false);
  const userToggled = useRef(false);
  const shakeRef = useRef<(() => void) | null>(null);

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
    const el = bulb.current;
    const path = cord.current;
    const root = svg.current;
    const box = wrap.current;
    if (!el || !path || !root || !box) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOn(true);
      return;
    }

    // Switch on by itself shortly after load (unless the visitor got there first)
    const auto = window.setTimeout(() => {
      if (!userToggled.current) setOn(true);
    }, 1100);

    /* ---- cord state ---- */
    const x = new Float32Array(N);
    const y = new Float32Array(N);
    const px = new Float32Array(N);
    const py = new Float32Array(N);
    const invM = new Float32Array(N).fill(1);
    invM[0] = 0; // pinned to the ceiling
    invM[N - 1] = 0.3; // the bulb is heavy
    for (let i = 0; i < N; i++) {
      x[i] = px[i] = AX;
      y[i] = py[i] = AY + i * SEG;
    }
    // Entrance: the bulb arrives with a sideways swing
    px[N - 1] -= 9;
    px[N - 2] -= 6;
    px[N - 3] -= 3;

    let bAngle = 0; // bulb angle (deg), on its own spring
    let bVel = 0;
    let t = 0;
    let wind = 0;
    let dragging = false;
    let target = { x: AX, y: ATTACH };

    const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));

    const toSvg = (cx: number, cy: number) => {
      const m = root.getScreenCTM();
      if (!m) return { x: AX, y: ATTACH };
      const p = new DOMPoint(cx, cy).matrixTransform(m.inverse());
      return { x: p.x, y: p.y };
    };

    const SUB = 2;
    const step = (dt: number) => {
      const damp = 0.9945;
      const breeze = Math.sin(t * 0.55) * 120 + Math.sin(t * 1.15 + 1.3) * 45 + wind;
      for (let i = 1; i < N; i++) {
        const k = i / (N - 1);
        const vx = clamp((x[i] - px[i]) * damp, 5);
        const vy = clamp((y[i] - py[i]) * damp, 5);
        px[i] = x[i];
        py[i] = y[i];
        x[i] += vx + breeze * k * k * dt * dt;
        y[i] += vy + 1500 * dt * dt;
      }
      if (dragging) {
        // chase the pointer instead of teleporting, so the cord never snaps
        x[N - 1] += clamp((target.x - x[N - 1]) * 0.3, 8);
        y[N - 1] += clamp((target.y - y[N - 1]) * 0.3, 8);
        px[N - 1] = x[N - 1];
        py[N - 1] = y[N - 1];
      }
      for (let it = 0; it < 10; it++) {
        for (let i = 0; i < N - 1; i++) {
          const dx = x[i + 1] - x[i];
          const dy = y[i + 1] - y[i];
          const d = Math.hypot(dx, dy) || 0.0001;
          const diff = (d - SEG) / d;
          const w0 = invM[i];
          const w1 = dragging && i + 1 === N - 1 ? 0 : invM[i + 1];
          const tw = w0 + w1;
          if (tw === 0) continue;
          x[i] += (dx * diff * w0) / tw;
          y[i] += (dy * diff * w0) / tw;
          x[i + 1] -= (dx * diff * w1) / tw;
          y[i + 1] -= (dy * diff * w1) / tw;
        }
      }
      // Bulb spring: chases the cord's end direction, overshoots, wobbles
      const tipAngle = (-Math.atan2(x[N - 1] - x[N - 2], y[N - 1] - y[N - 2]) * 180) / Math.PI;
      bVel += (110 * (tipAngle - bAngle) - 3.4 * bVel) * dt;
      bAngle += bVel * dt;
      bAngle = clamp(bAngle, 75);
    };

    const render = () => {
      let d = `M${x[0].toFixed(1)} ${y[0].toFixed(1)}`;
      for (let i = 1; i < N - 1; i++) {
        const mx = (x[i] + x[i + 1]) / 2;
        const my = (y[i] + y[i + 1]) / 2;
        d += ` Q${x[i].toFixed(1)} ${y[i].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
      }
      d += ` L${x[N - 1].toFixed(1)} ${y[N - 1].toFixed(1)}`;
      path.setAttribute("d", d);
      el.setAttribute(
        "transform",
        `translate(${x[N - 1].toFixed(1)} ${y[N - 1].toFixed(1)}) rotate(${bAngle.toFixed(2)}) translate(${-AX} ${-ATTACH})`,
      );
      if (glow.current) {
        const s = box.getBoundingClientRect().width / VIEW_W;
        glow.current.style.translate = `${((x[N - 1] - AX) * s).toFixed(1)}px ${((y[N - 1] - ATTACH) * s).toFixed(1)}px`;
      }
    };

    const tick = (_: number, deltaMs: number) => {
      const frame = Math.min(deltaMs, 40) / 1000;
      t += frame;
      wind *= Math.exp(-2.2 * frame);
      const dt = frame / SUB;
      for (let s = 0; s < SUB; s++) step(dt);
      render();
    };
    gsap.ticker.add(tick);

    // Wind from fast scrolling
    const lenis = getLenis();
    const onScroll = (l: { velocity: number }) => {
      if (!dragging) wind = clamp(l.velocity, 50) * 9;
    };
    lenis?.on("scroll", onScroll as never);

    /* ---- drag the bulb ---- */
    let startX = 0;
    let startY = 0;
    let startT = 0;
    let moved = 0;
    const maxReach = (N - 1) * SEG * 0.995;
    const setTarget = (e: PointerEvent) => {
      const p = toSvg(e.clientX, e.clientY);
      // keep the grab point on the cord's reach so it cannot be pulled apart
      const dx = p.x - AX;
      const dy = Math.max(p.y - AY, 40);
      const d = Math.hypot(dx, dy);
      const k = d > maxReach ? maxReach / d : 1;
      target = { x: AX + dx * k, y: AY + dy * k };
    };
    const down = (e: PointerEvent) => {
      e.preventDefault();
      dragging = true;
      document.body.style.userSelect = "none";
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
      startT = performance.now();
      startX = e.clientX;
      startY = e.clientY;
      moved = 0;
      target = { x: x[N - 1], y: y[N - 1] };
      document.documentElement.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      moved = Math.max(moved, Math.hypot(e.clientX - startX, e.clientY - startY));
      // while pressing but not yet moving, hold position so a click stays a click
      if (moved > 6) setTarget(e);
      else target = { x: x[N - 1], y: y[N - 1] };
    };
    // A click shakes the bulb: a sideways kick up the cord plus a wobble
    let shakeDir = 1;
    const shake = () => {
      shakeDir *= -1;
      for (let i = N - 1; i > 3; i--) {
        const k = (i - 3) / (N - 4);
        px[i] -= shakeDir * 2.1 * k;
      }
      bVel += shakeDir * 260;
    };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      document.documentElement.style.cursor = "";
      document.body.style.userSelect = "";
      if (moved < 6 && performance.now() - startT < 400) {
        toggle();
        shake();
      } else {
        setTouched(true);
        // hand the bulb back gently: cap whatever speed the drag built up
        for (let i = 1; i < N; i++) {
          px[i] = x[i] - clamp(x[i] - px[i], 5);
          py[i] = y[i] - clamp(y[i] - py[i], 5);
        }
        bVel = clamp(bVel, 180);
      }
    };
    shakeRef.current = shake;
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);

    return () => {
      window.clearTimeout(auto);
      shakeRef.current = null;
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
      {/* Warm glow cast over the hero; it travels with the bulb (multiply keeps the black type black) */}
      <div
        ref={glow}
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
        ref={svg}
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

        {/* flexible cord (path is rewritten every frame) */}
        <path
          ref={cord}
          d={`M${AX} ${AY} L${AX} ${ATTACH}`}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* the bulb: positioned and rotated imperatively */}
        <g
          ref={bulb}
          data-cursor="Switch"
          role="button"
          tabIndex={0}
          aria-pressed={on}
          aria-label="Light bulb. Press to switch it on or off. Drag to swing it."
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggle();
              shakeRef.current?.();
            }
          }}
          style={{ pointerEvents: "auto", cursor: "grab", touchAction: "pan-y", userSelect: "none", outline: "none" }}
        >
          {/* generous invisible hit area */}
          <rect x="180" y="190" width="360" height="400" fill="transparent" />

          {/* rays */}
          <g
            stroke="var(--color-orange)"
            strokeWidth="9"
            strokeLinecap="round"
            style={{ opacity: on ? 1 : 0, transition: "opacity 0.6s" }}
          >
            {RAYS.map((a) => {
              const r = (a * Math.PI) / 180;
              return (
                <line
                  key={a}
                  x1={CX + Math.sin(r) * 190}
                  y1={CY + Math.cos(r) * 190}
                  x2={CX + Math.sin(r) * 232}
                  y2={CY + Math.cos(r) * 232}
                />
              );
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
        Click the bulb to shake it
      </span>
    </div>
  );
}
