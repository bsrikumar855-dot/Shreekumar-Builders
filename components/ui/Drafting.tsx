/**
 * Drafting primitives
 * ---------------------------------------------------------------------------
 * The site's connective motif: hairline rules, section marks, tick chains,
 * dimension annotations and registration crosshairs. Used sparingly, they
 * turn the layout into a set of drawn sheets rather than a stack of cards.
 *
 * All pure / server-safe — no hooks, no client JS.
 */

export function Rule({ className = "", tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    <div
      aria-hidden
      className={`h-px w-full ${
        tone === "dark" ? "bg-bone-14" : "bg-ink-12"
      } ${className}`}
    />
  );
}

/** Chain of architectural tick marks along a line. */
export function TickChain({
  className = "",
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div
      aria-hidden
      className={`tick-rule h-2 w-full ${tone === "dark" ? "text-bone-14" : "text-ink-12"} ${className}`}
    />
  );
}

/** Crosshair / registration mark. */
export function Crosshair({
  className = "",
  size = 14,
  tone = "light",
}: {
  className?: string;
  size?: number;
  tone?: "light" | "dark";
}) {
  return (
    <span
      aria-hidden
      className={`relative inline-block shrink-0 ${
        tone === "dark" ? "text-bone-35" : "text-ink-45"
      } ${className}`}
      style={{ width: size, height: size }}
    >
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
      <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-current" />
    </span>
  );
}

/**
 * Section mark — `§ 04 / CAPABILITY`. The spine of the page's numbering.
 */
export function SectionMark({
  index,
  label,
  tone = "light",
  className = "",
}: {
  index: string;
  label: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 ${
        tone === "dark" ? "text-bone-60" : "text-ink-45"
      } ${className}`}
    >
      <Crosshair tone={tone} />
      <span className="meta">
        <span className={tone === "dark" ? "text-oxide-tint" : "text-oxide"}>
          §{index}
        </span>
        <span className="mx-2 opacity-40">/</span>
        {label}
      </span>
    </div>
  );
}

/** Vertical hairline used to divide editorial columns. */
export function ColumnRule({
  className = "",
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div
      aria-hidden
      className={`w-px self-stretch ${
        tone === "dark" ? "bg-bone-14" : "bg-ink-12"
      } ${className}`}
    />
  );
}