/**
 * MaterialSwatch
 * Procedural material textures — concrete, stone, ceramic, steel, timber and
 * glass. Each is built from a construction-relevant principle rather than a
 * decorative gradient: aggregate speckle, ashlar coursing, a grout grid,
 * brushed grain, sawn figure, and a reflective face.
 *
 * Everything is static geometry and repeating patterns — no SVG filters.
 * Filters have to be re-rasterised per instance, and a page carrying a dozen
 * swatches would pay for it on first paint.
 */

type Tone = "concrete" | "stone" | "ceramic" | "steel" | "timber" | "glass";

/* Deterministic stipple: the same aggregate field every build.
   The two axes use unrelated multipliers — correlating them turns the
   speckle into diagonal stripes. */
const SPECKLE = Array.from({ length: 30 }, (_, i) => ({
  x: (i * 37) % 30,
  y: (i * 17) % 30,
  r: 0.3 + ((i * 13) % 7) * 0.12,
  o: 0.08 + ((i * 11) % 5) * 0.045,
}));

const GRAIN_LINES = Array.from({ length: 26 }, (_, i) => ({
  y: i * 20,
  o: 0.05 + ((i * 11) % 6) * 0.028,
}));

const FIGURE = Array.from({ length: 15 }, (_, i) => {
  const bend = 6 + ((i * 7) % 6) * 5;
  const x = i * 27;
  return `M${x} -10 C ${x + bend} 130 ${x - bend} 300 ${x + bend - 8} 510`;
});

export default function MaterialSwatch({
  tone,
  className = "",
}: {
  tone: Tone;
  className?: string;
}) {
  const id = `ms-${tone}`;

  return (
    <svg
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden
      focusable="false"
    >
      <defs>
        <pattern id={`${id}-speckle`} width="30" height="30" patternUnits="userSpaceOnUse">
          {SPECKLE.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#4a453e" opacity={s.o} />
          ))}
        </pattern>
        <pattern
          id={`${id}-blotch`}
          width="120"
          height="120"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="34" cy="28" r="42" fill="#5c564d" opacity="0.05" />
          <circle cx="92" cy="86" r="30" fill="#5c564d" opacity="0.04" />
        </pattern>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#efeae2" stopOpacity="0.9" />
          <stop offset="46%" stopColor="#8d877e" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#322f2b" stopOpacity="0.75" />
        </linearGradient>
      </defs>

      {/* ---- Concrete ---- */}
      {tone === "concrete" && (
        <g>
          <rect width="400" height="500" fill="#c9c3b9" />
          <rect width="400" height="500" fill={`url(#${id}-blotch)`} />
          <rect width="400" height="500" fill={`url(#${id}-speckle)`} />
          <g stroke="#7f7a71" strokeWidth="1" fill="none" opacity="0.5">
            <circle cx="96" cy="128" r="11" />
            <circle cx="304" cy="128" r="11" />
            <circle cx="96" cy="372" r="11" />
            <circle cx="304" cy="372" r="11" />
            <path d="M0 250h400" opacity="0.35" />
          </g>
        </g>
      )}

      {/* ---- Stone ---- */}
      {tone === "stone" && (
        <g>
          <rect width="400" height="500" fill="#cdc7bc" />
          <g stroke="#8d877e" strokeWidth="1.2" fill="none">
            {Array.from({ length: 6 }).map((_, r) =>
              Array.from({ length: 3 }).map((__, c) => {
                const w = 130;
                const h = 82;
                const x = c * (w + 5) + (r % 2 ? -w / 2 : 0);
                const y = r * (h + 5);
                if (x + w < 0 || x > 400) return null;
                return <rect key={`${r}-${c}`} x={x} y={y} width={w} height={h} rx="1" />;
              }),
            )}
          </g>
          <g stroke="#322f2b" strokeWidth="0.7" opacity="0.26">
            {Array.from({ length: 44 }).map((_, i) => (
              <path key={i} d={`M${(i * 97) % 400} ${(i * 53) % 500}h${20 + (i % 7) * 6}`} />
            ))}
          </g>
        </g>
      )}

      {/* ---- Ceramic ---- */}
      {tone === "ceramic" && (
        <g>
          <rect width="400" height="500" fill="#e8e3da" />
          <g fill="#d6d0c5">
            {Array.from({ length: 8 }).map((_, r) =>
              Array.from({ length: 5 }).map((__, c) => (
                <rect key={`${r}-${c}`} x={c * 82 + 2} y={r * 64 + 2} width={78} height={60} />
              )),
            )}
          </g>
          <g stroke="#8d877e" strokeWidth="0.6" fill="none" opacity="0.32">
            <path d="M0 64h400M0 128h400M0 192h400M0 256h400M0 320h400M0 384h400M0 448h400" />
            <path d="M82 0v500M164 0v500M246 0v500M328 0v500" />
          </g>
          <rect x="164" y="128" width="78" height="60" fill="#bd5b1a" opacity="0.14" />
        </g>
      )}

      {/* ---- Steel ---- */}
      {tone === "steel" && (
        <g>
          <rect width="400" height="500" fill="#a9a49b" />
          <rect width="400" height="500" fill={`url(#${id}-blotch)`} />
          <g stroke="#efeae2" strokeWidth="0.8" fill="none">
            {GRAIN_LINES.map((l, i) => (
              <path key={i} d={`M0 ${l.y}h400`} opacity={l.o + 0.16} />
            ))}
          </g>
          <g stroke="#322f2b" strokeWidth="0.8" fill="none" opacity="0.22">
            {GRAIN_LINES.map((l, i) => (
              <path key={i} d={`M0 ${l.y + 7}h400`} opacity={l.o + 0.1} />
            ))}
          </g>
          <g fill="#322f2b" opacity="0.45">
            {Array.from({ length: 4 }).map((_, r) =>
              Array.from({ length: 3 }).map((__, c) => (
                <circle key={`${r}-${c}`} cx={60 + c * 140} cy={70 + r * 130} r="6" />
              )),
            )}
          </g>
        </g>
      )}

      {/* ---- Timber ---- */}
      {tone === "timber" && (
        <g>
          <rect width="400" height="500" fill="#c4b49b" />
          <rect width="400" height="500" fill={`url(#${id}-speckle)`} opacity="0.5" />
          <g stroke="#6f5a3c" strokeWidth="1" fill="none" opacity="0.4">
            {FIGURE.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
          <g stroke="#6f5a3c" strokeWidth="0.7" fill="none" opacity="0.16">
            {FIGURE.map((d, i) => (
              <path key={i} d={d} transform="translate(11 0)" />
            ))}
          </g>
          <ellipse cx="200" cy="250" rx="16" ry="26" fill="none" stroke="#6f5a3c" opacity="0.5" />
          <ellipse cx="200" cy="250" rx="7" ry="13" fill="none" stroke="#6f5a3c" opacity="0.5" />
        </g>
      )}

      {/* ---- Glass ---- */}
      {tone === "glass" && (
        <g>
          <rect width="400" height="500" fill={`url(#${id}-glass)`} />
          <g fill="#efeae2" opacity="0.26">
            <path d="M-40 500L200 0h46L6 500z" />
            <path d="M40 500L280 0h16L56 500z" opacity="0.7" />
            <path d="M300 500L540 0h10L310 500z" opacity="0.5" />
          </g>
          <g stroke="#efeae2" strokeWidth="1" fill="none" opacity="0.5">
            <rect x="24" y="24" width="352" height="452" />
            <rect x="32" y="32" width="336" height="436" opacity="0.4" />
          </g>
        </g>
      )}
    </svg>
  );
}