import type { ReactNode } from "react";

/**
 * Flat construction illustrations in the brand palette. They stand in for
 * photography until real images are dropped into /public/images (see
 * SmartImage) — bold, on-brand, and never an empty grey box.
 */

export type PlateVariant =
  | "masonry"
  | "circuit"
  | "pipe"
  | "tile"
  | "section"
  | "detail"
  | "frame"
  | "plan";

export type PlateTone = "orange" | "cream" | "ink" | "rust";

const O = "var(--color-orange)";
const R = "var(--color-rust)";
const RD = "var(--color-rust-deep)";
const C = "var(--color-cream)";
const S = "var(--color-sand)";
const K = "var(--color-ink)";

/** background, primary, secondary, line */
const TONES: Record<PlateTone, [string, string, string, string]> = {
  orange: [O, K, C, RD],
  cream: [S, O, K, R],
  ink: [K, O, C, R],
  rust: [R, O, C, K],
};

function Masonry([, a, b, l]: string[]): ReactNode {
  const rows = 7;
  const bricks: ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    const y = 120 + r * 24;
    const offset = r % 2 ? -30 : 0;
    for (let i = 0; i < 8; i++) {
      const x = 40 + offset + i * 60;
      if (x < 30 || x > 330) continue;
      const tone = (r * 3 + i) % 5 === 0 ? b : (r + i) % 3 === 0 ? l : a;
      bricks.push(
        <rect key={`${r}-${i}`} x={x} y={y} width={56} height={20} fill={tone} stroke={K} strokeWidth={2} />,
      );
    }
  }
  return (
    <>
      <rect x={30} y={108} width={340} height={4} fill={K} />
      {bricks}
      <path d="M90 108V40M90 40H250M250 40V70" stroke={K} strokeWidth={5} fill="none" />
      <rect x={236} y={70} width={28} height={22} fill={b} stroke={K} strokeWidth={2} />
      <path d="M90 40L60 108M90 40L130 108" stroke={K} strokeWidth={2.5} />
    </>
  );
}

function Circuit([, a, b, l]: string[]): ReactNode {
  return (
    <>
      <path d="M0 70H90V150H190M400 90H300V200H220M0 230H110M400 240H320M190 40V90" stroke={l} strokeWidth={5} fill="none" />
      {[[90, 70], [190, 150], [300, 90], [220, 200], [110, 230], [320, 240], [190, 40]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={9} fill={b} stroke={K} strokeWidth={3} />
      ))}
      <path d="M215 30L150 160H200L180 270L260 130H208L240 30Z" fill={a} stroke={K} strokeWidth={5} strokeLinejoin="round" />
    </>
  );
}

function Pipe([, a, b, l]: string[]): ReactNode {
  return (
    <>
      <path d="M0 80H140V180H260V240H400" stroke={K} strokeWidth={34} fill="none" strokeLinejoin="round" />
      <path d="M0 80H140V180H260V240H400" stroke={a} strokeWidth={24} fill="none" strokeLinejoin="round" />
      <path d="M0 80H140V180H260V240H400" stroke={b} strokeWidth={4} fill="none" strokeLinejoin="round" strokeDasharray="2 18" strokeLinecap="round" />
      <rect x={118} y={64} width={44} height={32} fill={l} stroke={K} strokeWidth={3} />
      <rect x={238} y={224} width={44} height={32} fill={l} stroke={K} strokeWidth={3} />
      <path d="M310 40C310 40 280 84 280 104a30 30 0 0060 0c0-20-30-64-30-64z" fill={b} stroke={K} strokeWidth={4} />
    </>
  );
}

function Tile([, a, b, l]: string[]): ReactNode {
  const cells: ReactNode[] = [];
  for (let r = 0; r < 6; r++) {
    for (let i = 0; i < 8; i++) {
      const alt = (r + i) % 2 === 0;
      const hot = (r * 8 + i) % 7 === 0;
      cells.push(
        <rect
          key={`${r}-${i}`}
          x={24 + i * 44}
          y={24 + r * 42}
          width={40}
          height={38}
          fill={hot ? l : alt ? a : b}
          stroke={K}
          strokeWidth={2}
        />,
      );
    }
  }
  return (
    <>
      {cells}
      <path d="M300 230l60-60 20 20-60 60z" fill={K} />
      <rect x={284} y={232} width={46} height={20} fill={a} stroke={K} strokeWidth={3} transform="rotate(-45 307 242)" />
    </>
  );
}

function Section([, a, b, l]: string[]): ReactNode {
  return (
    <>
      <path d="M40 260V60H250L290 40 330 80 310 110 350 150 320 190 360 230V260Z" fill={a} stroke={K} strokeWidth={4} strokeLinejoin="round" />
      <path d="M40 140H300M40 200H310" stroke={K} strokeWidth={4} />
      <rect x={70} y={80} width={50} height={40} fill={b} stroke={K} strokeWidth={3} />
      <rect x={150} y={80} width={50} height={40} fill={b} stroke={K} strokeWidth={3} />
      <rect x={70} y={160} width={50} height={30} fill={l} stroke={K} strokeWidth={3} />
      <path d="M270 120l24 20M300 70l10 30" stroke={K} strokeWidth={4} strokeDasharray="6 8" />
      <path d="M20 262H380" stroke={K} strokeWidth={6} />
    </>
  );
}

function Detail([, a, b, l]: string[]): ReactNode {
  return (
    <>
      <rect x={30} y={40} width={340} height={200} fill={b} stroke={K} strokeWidth={4} />
      <rect x={30} y={40} width={230} height={200} fill={a} stroke={K} strokeWidth={4} />
      <rect x={30} y={225} width={340} height={15} fill={l} />
      <rect x={110} y={90} width={150} height={44} rx={4} fill={K} />
      <rect x={118} y={98} width={134} height={28} rx={2} fill={a} />
      <path d="M260 112H300V170H236V200" stroke={K} strokeWidth={6} fill="none" />
      <rect x={222} y={198} width={28} height={50} rx={4} fill={K} />
    </>
  );
}

function Frame([, a, b, l]: string[]): ReactNode {
  const cols = [60, 140, 220, 300];
  return (
    <>
      <path d="M20 262H380" stroke={K} strokeWidth={6} />
      {cols.map((x) => (
        <rect key={x} x={x - 8} y={50} width={16} height={212} fill={a} stroke={K} strokeWidth={3} />
      ))}
      {[90, 160, 230].map((y) => (
        <rect key={y} x={52} y={y - 7} width={256} height={14} fill={b} stroke={K} strokeWidth={3} />
      ))}
      <path d="M68 97L132 153M148 97L212 153M228 97L292 153M132 167L68 223M212 167L148 223M292 167L228 223" stroke={l} strokeWidth={4} />
      <path d="M340 262V30H280M340 30L370 80" stroke={K} strokeWidth={5} fill="none" />
    </>
  );
}

function Plan([, a, b, l]: string[]): ReactNode {
  return (
    <>
      <rect x={40} y={40} width={320} height={200} fill={b} stroke={K} strokeWidth={8} />
      <path d="M40 130H170M230 130H360M200 40V90M200 150V240M120 130V240" stroke={K} strokeWidth={8} />
      <path d="M170 130a30 30 0 0030 -30" stroke={a} strokeWidth={4} fill="none" />
      <rect x={52} y={52} width={60} height={30} fill={a} stroke={K} strokeWidth={2} />
      <circle cx={290} cy={190} r={26} fill={l} stroke={K} strokeWidth={3} />
      <path d="M40 262H360M40 254V270M360 254V270" stroke={K} strokeWidth={3} />
      <path d="M380 40V240M372 40H388M372 240H388" stroke={K} strokeWidth={3} />
    </>
  );
}

const DRAW: Record<PlateVariant, (p: string[]) => ReactNode> = {
  masonry: Masonry,
  circuit: Circuit,
  pipe: Pipe,
  tile: Tile,
  section: Section,
  detail: Detail,
  frame: Frame,
  plan: Plan,
};

export default function Illustration({
  variant,
  tone = "orange",
  className = "",
  title,
}: {
  variant: PlateVariant;
  tone?: PlateTone;
  className?: string;
  title?: string;
}) {
  const p = TONES[tone];
  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={className}
    >
      <rect width={400} height={300} fill={p[0]} />
      {DRAW[variant](p)}
    </svg>
  );
}
