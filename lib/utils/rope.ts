/**
 * Hanging-cord physics (no DOM, no imports, so it can be tested in Node).
 *
 * A chain of points pinned at the top (Verlet integration + distance
 * constraints) with a heavy bulb on the free end. The bulb itself pivots on a
 * damped spring so it wobbles. Everything runs on a FIXED timestep
 * (accumulator), and every force/impulse is expressed per second, so the
 * motion is identical on 30, 60, 144 or 240 Hz displays.
 *
 * Safety rails: velocity cap, hard geometric limits (the cord can never
 * stretch past its length or rise above the ceiling), NaN recovery, and the
 * bulb angle is clamped. A bug here must never make the bulb leave the screen.
 */

export const ROPE = {
  AX: 360, // anchor x (viewBox units)
  AY: -220, // anchor y, above the visible top
  ATTACH: 205, // y of the socket when hanging at rest
  N: 22, // number of points
} as const;

const DT = 1 / 120; // fixed physics step (s)
const MAX_STEPS = 6; // never simulate more than 50 ms per frame
const GRAVITY = 1500; // units / s^2
const VEL_DAMP_PER_S = 0.5; // fraction of velocity left after one second
const MAX_SPEED = 900; // units / s
const ITERATIONS = 10;
const SEG = (ROPE.ATTACH - ROPE.AY) / (ROPE.N - 1);
const REACH = SEG * (ROPE.N - 1);

const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));

export class Rope {
  readonly n = ROPE.N;
  x = new Float64Array(ROPE.N);
  y = new Float64Array(ROPE.N);
  private px = new Float64Array(ROPE.N);
  private py = new Float64Array(ROPE.N);
  private invM = new Float64Array(ROPE.N).fill(1);

  /** Bulb angle (deg) and angular velocity (deg / s). */
  angle = 0;
  private angVel = 0;

  private acc = 0;
  private t = 0;
  private wind = 0; // sideways accel from scrolling (units / s^2)
  private dragging = false;
  private tx: number = ROPE.AX;
  private ty: number = ROPE.ATTACH;
  private kickDir = 1;

  constructor(entrance = true) {
    this.invM[0] = 0; // pinned to the ceiling
    this.invM[ROPE.N - 1] = 0.3; // the bulb is heavy
    this.reset();
    if (entrance) this.impulse(-110, 0.6); // arrives with a small sideways swing
  }

  reset() {
    for (let i = 0; i < ROPE.N; i++) {
      this.x[i] = this.px[i] = ROPE.AX;
      this.y[i] = this.py[i] = ROPE.AY + i * SEG;
    }
    this.angle = 0;
    this.angVel = 0;
    this.dragging = false;
    this.wind = 0;
  }

  /** Sideways velocity impulse (units / s), strongest at the free end. */
  private impulse(vx: number, from = 0.15) {
    const start = Math.floor(ROPE.N * from);
    for (let i = ROPE.N - 1; i > start; i--) {
      const k = (i - start) / (ROPE.N - 1 - start);
      this.px[i] -= vx * k * DT;
    }
  }

  /** A shake: alternates direction on every call. Speed-independent. */
  kick() {
    this.kickDir *= -1;
    this.impulse(this.kickDir * 290, 0.15);
    this.angVel = clamp(this.angVel + this.kickDir * 260, 400);
  }

  /** Sideways wind in units / s^2 (e.g. from scroll speed). Decays on its own. */
  blow(accel: number) {
    this.wind = clamp(accel, 500);
  }

  grab(x: number, y: number) {
    this.dragging = true;
    this.moveTo(x, y);
  }

  moveTo(x: number, y: number) {
    // keep the grab point within the cord's reach so it can never be torn off
    const dx = x - ROPE.AX;
    const dy = Math.max(y - ROPE.AY, 40);
    const d = Math.hypot(dx, dy);
    const k = d > REACH * 0.995 ? (REACH * 0.995) / d : 1;
    this.tx = ROPE.AX + dx * k;
    this.ty = ROPE.AY + dy * k;
  }

  release() {
    if (!this.dragging) return;
    this.dragging = false;
    // hand the bulb back gently: cap whatever speed the drag built up
    const cap = 300 * DT;
    for (let i = 1; i < ROPE.N; i++) {
      this.px[i] = this.x[i] - clamp(this.x[i] - this.px[i], cap);
      this.py[i] = this.y[i] - clamp(this.y[i] - this.py[i], cap);
    }
    this.angVel = clamp(this.angVel, 180);
  }

  get isDragging() {
    return this.dragging;
  }

  /** Advance by a frame time in seconds (any value; internally stepped). */
  advance(frameSeconds: number) {
    if (!Number.isFinite(frameSeconds) || frameSeconds <= 0) return;
    this.acc += Math.min(frameSeconds, MAX_STEPS * DT);
    this.wind *= Math.exp(-2.2 * frameSeconds);
    let steps = 0;
    while (this.acc >= DT && steps < MAX_STEPS) {
      this.step();
      this.acc -= DT;
      steps++;
    }
    if (steps === MAX_STEPS) this.acc = 0;
    if (!this.healthy()) this.reset();
  }

  private step() {
    const { x, y, px, py, invM } = this;
    const N = ROPE.N;
    const damp = Math.pow(VEL_DAMP_PER_S, DT);
    const vmax = MAX_SPEED * DT;
    this.t += DT;
    const breeze =
      Math.sin(this.t * 0.55) * 120 + Math.sin(this.t * 1.15 + 1.3) * 45 + this.wind;

    for (let i = 1; i < N; i++) {
      const k = i / (N - 1);
      const vx = clamp((x[i] - px[i]) * damp, vmax);
      const vy = clamp((y[i] - py[i]) * damp, vmax);
      px[i] = x[i];
      py[i] = y[i];
      x[i] += vx + breeze * k * k * DT * DT;
      y[i] += vy + GRAVITY * DT * DT;
    }

    if (this.dragging) {
      // chase the pointer instead of teleporting, so the cord never snaps
      x[N - 1] += clamp((this.tx - x[N - 1]) * 0.3, 8);
      y[N - 1] += clamp((this.ty - y[N - 1]) * 0.3, 8);
      px[N - 1] = x[N - 1];
      py[N - 1] = y[N - 1];
    }

    for (let it = 0; it < ITERATIONS; it++) {
      for (let i = 0; i < N - 1; i++) {
        const dx = x[i + 1] - x[i];
        const dy = y[i + 1] - y[i];
        const d = Math.hypot(dx, dy) || 1e-6;
        const diff = (d - SEG) / d;
        const w0 = invM[i];
        const w1 = this.dragging && i + 1 === N - 1 ? 0 : invM[i + 1];
        const tw = w0 + w1;
        if (tw === 0) continue;
        x[i] += (dx * diff * w0) / tw;
        y[i] += (dy * diff * w0) / tw;
        x[i + 1] -= (dx * diff * w1) / tw;
        y[i + 1] -= (dy * diff * w1) / tw;
      }
    }

    // Hard limits: nothing can leave the disk its cord length allows, or
    // rise above the ceiling the cord hangs from.
    for (let i = 1; i < N; i++) {
      if (y[i] < ROPE.AY) y[i] = ROPE.AY;
      const dx = x[i] - ROPE.AX;
      const dy = y[i] - ROPE.AY;
      const d = Math.hypot(dx, dy);
      const lim = i * SEG;
      if (d > lim) {
        x[i] = ROPE.AX + (dx / d) * lim;
        y[i] = ROPE.AY + (dy / d) * lim;
      }
    }

    // Bulb: damped spring chasing the cord's end direction (wobbles, overshoots)
    const tip = (-Math.atan2(x[N - 1] - x[N - 2], y[N - 1] - y[N - 2]) * 180) / Math.PI;
    this.angVel += (110 * (tip - this.angle) - 3.4 * this.angVel) * DT;
    this.angVel = clamp(this.angVel, 900);
    this.angle = clamp(this.angle + this.angVel * DT, 75);
  }

  private healthy() {
    for (let i = 0; i < ROPE.N; i++) {
      if (!Number.isFinite(this.x[i]) || !Number.isFinite(this.y[i])) return false;
    }
    return Number.isFinite(this.angle) && Number.isFinite(this.angVel);
  }
}
