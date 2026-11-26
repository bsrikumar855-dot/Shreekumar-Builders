import Link from "next/link";
import type { ReactNode } from "react";

/** Brand mark: blocky "S" on orange. */
export function LogoMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <rect width="64" height="64" fill="var(--color-orange)" />
      <path
        d="M16 14h32v10H26v4h22v22H16V40h22v-4H16z"
        fill="var(--color-ink)"
      />
    </svg>
  );
}

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span
      className={`font-display text-[1.45rem] uppercase leading-none tracking-[0.02em] ${
        light ? "text-cream" : "text-ink"
      }`}
    >
      Shreekumar
      <span
        className={`block font-sans text-[0.75rem] font-extrabold tracking-[0.28em] ${
          light ? "text-orange" : "text-rust"
        }`}
      >
        Builders
      </span>
    </span>
  );
}

/** Organic background blob (echoes the reference's soft shapes). */
const BLOBS = {
  a: "M421 56c68 35 128 111 120 193s-84 135-142 190c-58 55-110 112-186 105S54 456 48 372 82 205 143 138 353 21 421 56z",
  b: "M470 90c58 52 90 150 52 228s-142 118-224 150-170 20-216-46S2 292 56 210 192 70 290 40s122 8 180 50z",
  c: "M300 30c92-10 196 50 232 140s-10 190-84 250-174 98-262 70S30 410 28 316 70 144 138 86 240 36 300 30z",
};

export function Blob({
  variant = "a",
  fill = "var(--color-orange)",
  className = "",
}: {
  variant?: keyof typeof BLOBS;
  fill?: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 600 600" className={className} aria-hidden>
      <path d={BLOBS[variant]} fill={fill} />
    </svg>
  );
}

/** Looping ticker. Content is duplicated for a seamless -50% translate. */
export function Marquee({
  items,
  className = "",
  itemClassName = "",
  reverse = false,
}: {
  items: string[];
  className?: string;
  itemClassName?: string;
  reverse?: boolean;
}) {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((t) => (
        <li key={t} className={`flex shrink-0 items-center ${itemClassName}`}>
          <span>{t}</span>
          <span aria-hidden className="mx-[0.5em] inline-block h-[0.32em] w-[0.32em] rotate-45 bg-current" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`marquee ${className}`}>
      <div className="marquee-track" data-dir={reverse ? "rev" : undefined}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

export function SectionLabel({
  n,
  children,
  className = "",
}: {
  n?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`label flex items-center gap-3 ${className}`}>
      {n && <span className="bg-ink px-2 py-1 text-cream">{n}</span>}
      <span>{children}</span>
    </p>
  );
}

/** Honest placeholder tag for content the client still has to supply. */
export function PendingNote({
  children,
  onDark = false,
}: {
  children: ReactNode;
  onDark?: boolean;
}) {
  return (
    <p
      className={`label inline-block border-2 border-dashed px-3 py-2 ${
        onDark ? "border-cream text-cream" : "border-rust text-rust"
      }`}
    >
      {children}
    </p>
  );
}

export function Cta({
  href,
  children,
  variant = "orange",
  small = false,
}: {
  href: string;
  children: ReactNode;
  variant?: "orange" | "ink" | "paper";
  small?: boolean;
}) {
  return (
    <Link href={href} className={`btn btn-${variant} ${small ? "btn-sm" : ""}`}>
      {children}
      <span className="arr" aria-hidden>
        →
      </span>
    </Link>
  );
}
