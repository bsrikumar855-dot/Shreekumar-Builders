"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { getLenis } from "@/lib/utils/smooth-scroll";
import { Rope, ROPE } from "@/lib/utils/rope";

/**
 * The hero's hanging light bulb, on a real flexible cord.
 *
 * All motion comes from `Rope` (lib/utils/rope.ts): a Verlet cord with a
 * heavy bulb on a spring, stepped on a fixed 120 Hz clock so it behaves the
 * same on every display, and hard-limited so it can never leave the screen.
 * That module is tested separately (stability at 24-240 Hz, fuzzed drags,
 * wind and frame spikes).
 *
 *   - Click, tap, Enter or Space switches the light and shakes the bulb.
 *   - Drag to pull the cord; release and it swings back.
 *   - Fast scrolling blows on it. There is no hover interaction.
 *
 * Positions are written straight to the DOM every frame (never through React
 * state). With prefers-reduced-motion the bulb stays still and lit.
 */
const VIEW_W = 720;
const CX = 360;
const CY = 455;
const RAYS = [-135, -108, -81, -54, -27, 0, 27, 54, 81, 108, 135];
const CLICK_SLOP = 8; // px of movement that turns a click into a drag

export default function HangingBulb() {
  const wrap = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const cord = useRef<SVGPathElement>(null);
  const bulb = useRef<SVGGElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const ropeRef = useRef<Rope | null>(null);
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

    const rope = new Rope(true);
    ropeRef.current = rope;
    const N = rope.n;

    const render = () => {
      const { x, y } = rope;
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
        `translate(${x[N - 1].toFixed(1)} ${y[N - 1].toFixed(1)}) rotate(${rope.angle.toFixed(2)}) translate(${-ROPE.AX} ${-ROPE.ATTACH})`,
      );
      if (glow.current) {
        const s = box.getBoundingClientRect().width / VIEW_W;
        glow.current.style.translate = `${((x[N - 1] - ROPE.AX) * s).toFixed(1)}px ${((y[N - 1] - ROPE.ATTACH) * s).toFixed(1)}px`;
      }
    };

    const tick = (_: number, deltaMs: number) => {
      rope.advance(deltaMs / 1000);
      render();
    };
    gsap.ticker.add(tick);

    // Wind from fast scrolling
    const lenis = getLenis();
    const onScroll = (l: { velocity: number }) => {
      if (!rope.isDragging) rope.blow(Math.max(-50, Math.min(50, l.velocity)) * 9);
    };
    lenis?.on("scroll", onScroll as never);

    const toSvg = (cx: number, cy: number) => {
      const m = root.getScreenCTM();
      if (!m) return { x: ROPE.AX, y: ROPE.ATTACH };
      const p = new DOMPoint(cx, cy).matrixTransform(m.inverse());
      return { x: p.x, y: p.y };
    };

    /* ---- pointer: press = click, press + move = drag ---- */
    let pressed = false;
    let startX = 0;
    let startY = 0;
    let moved = 0;
    const down = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === "mouse") return;
      e.preventDefault();
      pressed = true;
      moved = 0;
      startX = e.clientX;
      startY = e.clientY;
      (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
      document.body.style.userSelect = "none";
    };
    const move = (e: PointerEvent) => {
      if (!pressed) return;
      moved = Math.max(moved, Math.hypot(e.clientX - startX, e.clientY - startY));
      if (moved <= CLICK_SLOP) return;
      const p = toSvg(e.clientX, e.clientY);
      if (!rope.isDragging) {
        rope.grab(p.x, p.y);
        document.documentElement.style.cursor = "grabbing";
      } else {
        rope.moveTo(p.x, p.y);
      }
    };
    const end = (cancelled: boolean) => {
      if (!pressed) return;
      pressed = false;
      document.body.style.userSelect = "";
      document.documentElement.style.cursor = "";
      if (rope.isDragging) {
        rope.release();
        setTouched(true);
      } else if (!cancelled && moved <= CLICK_SLOP) {
        toggle();
        rope.kick();
      }
    };
    const up = () => end(false);
    const cancel = () => end(true);
    const key = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
        rope.kick();
      }
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", cancel);
    el.addEventListener("lostpointercapture", cancel);
    el.addEventListener("keydown", key);

    return () => {
      window.clearTimeout(auto);
      ropeRef.current = null;
      gsap.ticker.remove(tick);
      lenis?.off("scroll", onScroll as never);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", cancel);
      el.removeEventListener("lostpointercapture", cancel);
      el.removeEventListener("keydown", key);
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
          d={`M${ROPE.AX} ${ROPE.AY} L${ROPE.AX} ${ROPE.ATTACH}`}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* the bulb: positioned and rotated imperatively */}
        <g
          ref={bulb}
          role="button"
          tabIndex={0}
          aria-pressed={on}
          aria-label="Light bulb. Press to switch it on or off and shake it. Drag to pull it."
          style={{ pointerEvents: "auto", cursor: "pointer", touchAction: "pan-y", userSelect: "none" }}
          className="outline-none focus-visible:[&>rect]:stroke-ink"
        >
          {/* generous invisible hit area */}
          <rect x="180" y="190" width="360" height="400" fill="transparent" strokeWidth="0" />

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
