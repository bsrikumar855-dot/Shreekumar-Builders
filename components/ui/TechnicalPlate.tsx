import type { CSSProperties } from "react";

/**
 * TechnicalPlate
 * ---------------------------------------------------------------------------
 * A procedural, brand-native illustration system drawn entirely in SVG.
 *
 * These replace site photography until real images are dropped into
 * /public/images (see `SmartImage`). They are not placeholders in the
 * "grey box" sense — each variant is a considered axonometric / elevation
 * drawing of the actual trade involved: masonry bond, DIN-rail distribution,
 * an isometric pipe run, a tile set-out, a wall section, a finish detail and
 * a floor plan.
 *
 * Everything is deterministic, resolution-independent and costs no network.
 */

export type PlateVariant =
  | "frame"
  | "masonry"
  | "circuit"
  | "pipe"
  | "tile"
  | "section"
  | "detail"
  | "plan";

export type PlateTone = "light" | "dark";

type Props = {
  variant: PlateVariant;
  tone?: PlateTone;
  className?: string;
  style?: CSSProperties;
  /**
   * `sheet` (default) fits the whole drawing inside the frame and lets the
   * field colour carry the rest — nothing is ever cropped, so annotations
   * stay readable. `cover` fills the frame edge to edge and crops the sheet.
   */
  fit?: "sheet" | "cover";
  /** Hide the drawn annotations and the registration mark for full-bleed crops. */
  bare?: boolean;
  title?: string;
};

const W = 1200;
const H = 900;

/* The field is drawn far beyond the viewBox so that neither `sheet` nor
   `cover` ever exposes an unstyled edge. */
const FIELD = { x: -2400, y: -1800, width: 4800, height: 3600 };

/* Isometric projection helpers — 30° standard architectural axonometric */
const COS30 = Math.cos(Math.PI / 6);
const SIN30 = Math.sin(Math.PI / 6);

type Pt = [number, number];

const iso = (x: number, y: number, z: number): Pt => [
  W / 2 + (x - y) * COS30,
  H / 2 - 85 + (x + y) * SIN30 - z,
];

const pts = (list: Pt[]) => list.map((p) => p.join(",")).join(" ");

export default function TechnicalPlate({
  variant,
  tone = "light",
  className,
  style,
  fit = "sheet",
  bare = false,
  title,
}: Props) {
  const dark = tone === "dark";

  const ink = dark ? "#efeae2" : "#121110";
  const line = dark ? "rgba(239,234,226,0.40)" : "rgba(18,17,16,0.38)";
  const faint = dark ? "rgba(239,234,226,0.13)" : "rgba(18,17,16,0.11)";
  const wash = dark ? "rgba(239,234,226,0.06)" : "rgba(18,17,16,0.045)";
  const accent = dark ? "#e6c6a3" : "#bd5b1a";
  const labelFill = dark ? "rgba(239,234,226,0.46)" : "rgba(18,17,16,0.38)";

  const uid = `tp-${variant}-${tone}${bare ? "-bare" : ""}`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio={fit === "cover" ? "xMidYMid slice" : "xMidYMid meet"}
      className={className}
      style={style}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <defs>
        <pattern id={`${uid}-dot`} width="30" height="30" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill={faint} />
        </pattern>
        <pattern
          id={`${uid}-hatch`}
          width="7"
          height="7"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1="0" y1="0" x2="0" y2="7" stroke={faint} strokeWidth="1" />
        </pattern>
        <pattern
          id={`${uid}-hatch-dense`}
          width="4"
          height="4"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1="0" y1="0" x2="0" y2="4" stroke={line} strokeWidth="0.8" />
        </pattern>
        <pattern
          id={`${uid}-cross`}
          width="9"
          height="9"
          patternUnits="userSpaceOnUse"
        >
          <path d="M0 0H9M0 0V9" stroke={faint} strokeWidth="0.7" />
        </pattern>
      </defs>

      {/* Field — oversized so no framing mode exposes an unstyled edge */}
      <rect {...FIELD} fill={dark ? "#171614" : "#e6e0d6"} />
      <rect {...FIELD} fill={`url(#${uid}-dot)`} />

      {variant === "frame" && <Frame uid={uid} ink={ink} line={line} faint={faint} wash={wash} accent={accent} bare={bare} label={labelFill} />}
      {variant === "masonry" && <Masonry uid={uid} ink={ink} line={line} faint={faint} wash={wash} accent={accent} bare={bare} label={labelFill} />}
      {variant === "circuit" && <Circuit uid={uid} ink={ink} line={line} faint={faint} wash={wash} accent={accent} bare={bare} label={labelFill} />}
      {variant === "pipe" && <Pipe uid={uid} ink={ink} line={line} faint={faint} wash={wash} accent={accent} bare={bare} label={labelFill} />}
      {variant === "tile" && <Tile uid={uid} line={line} wash={wash} accent={accent} bare={bare} label={labelFill} />}
      {variant === "section" && <SectionPlate uid={uid} line={line} wash={wash} accent={accent} bare={bare} label={labelFill} />}
      {variant === "detail" && <DetailPlate uid={uid} line={line} wash={wash} accent={accent} bare={bare} label={labelFill} />}
      {variant === "plan" && <Plan uid={uid} ink={ink} line={line} faint={faint} wash={wash} accent={accent} bare={bare} label={labelFill} />}

      {/* Registration crosshair, bottom-right */}
      {!bare && (
        <g stroke={accent} strokeWidth="1" opacity="0.65" vectorEffect="non-scaling-stroke">
          <path d={`M${W - 92} ${H - 60}h34M${W - 75} ${H - 77}v34`} fill="none" />
          <circle cx={W - 75} cy={H - 60} r="13" fill="none" />
        </g>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Shared pieces                                                      */
/* ------------------------------------------------------------------ */

type DrawProps = {
  uid: string;
  ink?: string;
  line: string;
  faint?: string;
  wash: string;
  accent: string;
  bare: boolean;
  label: string;
};

function Annot({
  x,
  y,
  children,
  fill,
  anchor = "start",
  size = 15,
  letterSpacing = 2.4,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  fill: string;
  anchor?: "start" | "middle" | "end";
  size?: number;
  letterSpacing?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      fill={fill}
      fontFamily="var(--font-plex-mono), monospace"
      fontSize={size}
      letterSpacing={letterSpacing}
      textAnchor={anchor}
      style={{ textTransform: "uppercase" }}
    >
      {children}
    </text>
  );
}

/** Engineering dimension line with architectural tick marks. */
function Dimension({
  x1,
  y1,
  x2,
  y2,
  text,
  color,
  label,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  text?: string;
  color: string;
  label?: string;
}) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const horizontal = y1 === y2;
  return (
    <g stroke={color} strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke">
      <path d={`M${x1} ${y1}L${x2} ${y2}`} />
      {horizontal ? (
        <>
          <path d={`M${x1} ${y1 - 9}v18`} />
          <path d={`M${x2} ${y2 - 9}v18`} />
        </>
      ) : (
        <>
          <path d={`M${x1 - 9} ${y1}h18`} />
          <path d={`M${x2 - 9} ${y2}h18`} />
        </>
      )}
      {label && (
        <Annot x={horizontal ? mx : mx + 14} y={horizontal ? my - 12 : my} fill={color} anchor={horizontal ? "middle" : "start"}>
          {label}
        </Annot>
      )}
      {text}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 01 — Structural frame, axonometric                                 */
/* ------------------------------------------------------------------ */

function Frame({ line, faint, wash, accent, bare, label }: DrawProps) {
  const bays = 3;
  const span = 170;
  const storey = 170;
  const levels = [0, storey, storey * 2];

  const columns: string[] = [];
  for (let i = 0; i <= bays; i++) {
    columns.push(pts([iso(i * span, 0, 0), iso(i * span, 0, levels[2])]));
    columns.push(pts([iso(0, i * span, 0), iso(0, i * span, levels[2])]));
    columns.push(pts([iso(i * span, bays * span, 0), iso(i * span, bays * span, levels[2])]));
    columns.push(pts([iso(bays * span, i * span, 0), iso(bays * span, i * span, levels[2])]));
  }

  return (
    <g>
      {/* Floor plates */}
      {levels.map((z, li) => (
        <g key={z}>
          <polygon
            points={pts([
              iso(0, 0, z),
              iso(bays * span, 0, z),
              iso(bays * span, bays * span, z),
              iso(0, bays * span, z),
            ])}
            fill={li === 0 ? wash : "none"}
            stroke={line}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          {li > 0 && (
            <polygon
              points={pts([
                iso(0, 0, z + 26),
                iso(bays * span, 0, z + 26),
                iso(bays * span, bays * span, z + 26),
                iso(0, bays * span, z + 26),
              ])}
              fill={wash}
              stroke={line}
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              opacity="0.7"
            />
          )}
        </g>
      ))}

      {/* Columns */}
      <g stroke={line} strokeWidth="1.4" fill="none" vectorEffect="non-scaling-stroke">
        {columns.map((c, i) => (
          <polyline key={i} points={c} />
        ))}
      </g>

      {/* Diagonal bracing on the rear bay */}
      <g stroke={faint} strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke">
        <polyline points={pts([iso(0, bays * span, 0), iso(bays * span, bays * span, storey * 2)])} />
        <polyline points={pts([iso(bays * span, bays * span, 0), iso(0, bays * span, storey * 2)])} />
        <polyline points={pts([iso(bays * span, 0, 0), iso(bays * span, bays * span, storey)])} />
      </g>

      {/* Services — conduit runs routed within the frame, in the accent */}
      <g stroke={accent} strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" opacity="0.85">
        <polyline points={pts([iso(span * 0.5, 0, storey * 2 - 40), iso(span * 0.5, bays * span * 0.6, storey * 2 - 40)])} />
        <polyline points={pts([iso(span * 0.5, bays * span * 0.6, storey * 2 - 40), iso(span * 0.5, bays * span * 0.6, storey + 30)])} />
        <polyline points={pts([iso(span * 0.5, bays * span * 0.6, storey + 30), iso(bays * span * 0.9, bays * span * 0.6, storey + 30)])} />
      </g>
      {/* Water line */}
      <g stroke={line} strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" strokeDasharray="14 9">
        <polyline points={pts([iso(span * 1.5, span * 0.2, storey - 46), iso(span * 1.5, bays * span * 0.8, storey - 46)])} />
        <polyline points={pts([iso(span * 1.5, bays * span * 0.8, storey - 46), iso(span * 1.5, bays * span * 0.8, 40)])} />
      </g>

      {/* Node markers */}
      <g fill={accent}>
        {[0, 1, 2].map((i) => (
          <circle key={i} {...pointProps(iso(span * 0.5, bays * span * 0.6, storey + 30))} r="3.5" />
        ))}
        <circle {...pointProps(iso(span * 1.5, bays * span * 0.8, 40))} r="3.5" />
      </g>

      {/* Setting-out grid on the base plate */}
      <g stroke={faint} strokeWidth="0.8" fill="none" vectorEffect="non-scaling-stroke">
        {[1, 2].map((i) => (
          <polyline key={i} points={pts([iso(i * span, 0, 0), iso(i * span, bays * span, 0)])} />
        ))}
        {[1, 2].map((i) => (
          <polyline key={`b${i}`} points={pts([iso(0, i * span, 0), iso(bays * span, i * span, 0)])} />
        ))}
      </g>

      {!bare && (
        <g>
          <Dimension
            x1={iso(0, 0, 0)[0]}
            y1={iso(0, 0, 0)[1] + 58}
            x2={iso(bays * span, 0, 0)[0]}
            y2={iso(bays * span, 0, 0)[1] + 58}
            color={label}
            label="SPAN"
          />
          <Annot x={W / 2} y={H - 46} fill={label} anchor="middle">
            AXONOMETRIC — STRUCTURAL FRAME
          </Annot>
          <Annot x={W / 2} y={H - 22} fill={label} anchor="middle">
            CONDUIT + WATER COORDINATION
          </Annot>
        </g>
      )}
    </g>
  );
}

function pointProps([x, y]: Pt) {
  return { cx: x, cy: y };
}

/* ------------------------------------------------------------------ */
/* 02 — Masonry bond, elevation                                       */
/* ------------------------------------------------------------------ */

function Masonry({ uid, line, faint, wash, accent, bare, label }: DrawProps) {
  const bw = 128;
  const bh = 62;
  const gap = 6;
  const cols = 7;
  const rows = 7;
  const startX = 150;
  const startY = 130;

  return (
    <g>
      {/* Bond */}
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((__, c) => {
          const offset = r % 2 === 0 ? 0 : -(bw + gap) / 2;
          const x = startX + c * (bw + gap) + offset;
          const y = startY + r * (bh + gap);
          if (x < 120 || x + bw > W - 120) return null;
          const isAccent = (r === 3 && c === 2) || (r === 4 && c === 5);
          return (
            <rect
              key={`${r}-${c}`}
              x={x}
              y={y}
              width={bw}
              height={bh}
              fill={isAccent ? wash : "none"}
              stroke={isAccent ? accent : line}
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          );
        }),
      )}

      {/* Openings — a door and a window cut into the bond */}
      <g>
        <rect
          x={startX + (bw + gap) * 4 + 6}
          y={startY + (bh + gap) * 2}
          width={bw + gap + 12}
          height={(bh + gap) * 4}
          fill={`url(#${uid}-cross)`}
          stroke={accent}
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />
        <rect
          x={startX + 10}
          y={startY + (bh + gap) * 4 + 6}
          width={(bw + gap) * 2 + 12}
          height={(bh + gap) * 2}
          fill={`url(#${uid}-hatch)`}
          stroke={accent}
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />
      </g>

      {/* Perpends marked as fine verticals */}
      <g stroke={faint} strokeWidth="0.8" vectorEffect="non-scaling-stroke">
        {Array.from({ length: cols + 1 }).map((_, c) => (
          <line key={c} x1={startX + c * (bw + gap)} y1={startY - 20} x2={startX + c * (bw + gap)} y2={startY + rows * (bh + gap) + 10} />
        ))}
      </g>

      {/* Damp-proof course */}
      <g>
        <line
          x1={startX - 24}
          y1={startY + (bh + gap) * 5}
          x2={startX + (bw + gap) * (cols - 1) + 24}
          y2={startY + (bh + gap) * 5}
          stroke={accent}
          strokeWidth="2"
          strokeDasharray="20 8 4 8"
          vectorEffect="non-scaling-stroke"
        />
      </g>

      {!bare && (
        <g>
          <Dimension
            x1={startX}
            y1={startY - 62}
            x2={startX + (bw + gap) * 3}
            y2={startY - 62}
            color={label}
            label="600"
          />
          <Dimension
            x1={startX - 74}
            y1={startY}
            x2={startX - 74}
            y2={startY + (bh + gap) * 2}
            color={label}
            label="230"
          />
          <Annot x={startX - 24} y={startY - 92} fill={label}>
            STRETCHER BOND — SET OUT FROM DATUM
          </Annot>
          <Annot x={startX - 24} y={startY + rows * (bh + gap) + 52} fill={label}>
            DPC / OPENINGS COORDINATED WITH SERVICES
          </Annot>
        </g>
      )}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 03 — Distribution board + circuit routing                           */
/* ------------------------------------------------------------------ */

function Circuit({ line, faint, wash, accent, bare, label }: DrawProps) {
  const bx = 300;
  const by = 150;
  const bw = 600;
  const bh = 420;

  const breakers = Array.from({ length: 10 }).map((_, i) => ({
    x: bx + 46 + i * 52,
    label: `Q${i + 1}`,
  }));
  const busbar = Array.from({ length: 10 }).map((_, i) => bx + 72 + i * 52);

  return (
    <g>
      {/* Enclosure */}
      <rect x={bx} y={by} width={bw} height={bh} fill={wash} stroke={line} strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
      <rect x={bx + 18} y={by + 18} width={bw - 36} height={bh - 36} fill="none" stroke={faint} strokeWidth="0.9" vectorEffect="non-scaling-stroke" />

      {/* DIN rail */}
      <line x1={bx + 34} y1={by + 96} x2={bx + bw - 34} y2={by + 96} stroke={line} strokeWidth="3" vectorEffect="non-scaling-stroke" />
      <line x1={bx + 34} y1={by + 232} x2={bx + bw - 34} y2={by + 232} stroke={line} strokeWidth="3" vectorEffect="non-scaling-stroke" />

      {/* MCBs */}
      {breakers.map((b, i) => (
        <g key={b.label}>
          <rect x={b.x} y={by + 62} width={38} height={68} fill="none" stroke={i === 3 ? accent : line} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
          <line x1={b.x + 8} y1={by + 82} x2={b.x + 30} y2={by + 82} stroke={i === 3 ? accent : faint} strokeWidth="2" vectorEffect="non-scaling-stroke" />
          {!bare && (
            <Annot x={b.x + 19} y={by + 148} fill={label} anchor="middle" size={12} letterSpacing={1}>
              {b.label}
            </Annot>
          )}
        </g>
      ))}

      {/* RCBO row */}
      {Array.from({ length: 6 }).map((_, i) => (
        <rect
          key={i}
          x={bx + 46 + i * 88}
          y={by + 198}
          width={74}
          height={68}
          fill="none"
          stroke={line}
          strokeWidth="1.2"
          vectorEffect="non-scaling-stroke"
        />
      ))}

      {/* Outgoing circuits — orthogonal routing, accent for the selected run */}
      <g fill="none" vectorEffect="non-scaling-stroke">
        {busbar.map((x, i) => (
          <path
            key={i}
            d={`M ${x} ${by + 130} L ${x} ${by + 300} L ${bx + 30} ${by + 300}`}
            stroke={i === 3 ? accent : faint}
            strokeWidth={i === 3 ? 2 : 1}
          />
        ))}
        <path d={`M ${bx + 30} ${by + 300} L ${bx - 130} ${by + 300}`} stroke={accent} strokeWidth="2" />
        <path d={`M ${bx - 130} ${by + 300} L ${bx - 130} ${H - 150}`} stroke={accent} strokeWidth="2" />
        <path d={`M ${bx + 30} ${by + 300} L ${W - 170} ${by + 300}`} stroke={faint} strokeWidth="1" />
        <path d={`M ${W - 170} ${by + 300} L ${W - 170} ${H - 150}`} stroke={faint} strokeWidth="1" />
      </g>

      {/* Junction / accessory boxes */}
      <g fill={wash} stroke={line} strokeWidth="1.2" vectorEffect="non-scaling-stroke">
        <rect x={bx - 60} y={H - 210} width={60} height={60} />
        <rect x={W - 200} y={H - 210} width={60} height={60} />
      </g>

      {/* Terminal dots */}
      <g fill={accent}>
        <circle cx={bx - 130} cy={H - 180} r="4" />
        <circle cx={W - 170} cy={H - 180} r="4" />
      </g>

      {!bare && (
        <g>
          <Annot x={bx} y={by - 44} fill={label}>
            DISTRIBUTION — DIN RAIL / WAY
          </Annot>
          <Annot x={bx} y={by + bh + 62} fill={label}>
            CIRCUITS SET OUT BEFORE FIRST FIX
          </Annot>
          <Annot x={74} y={H / 2} fill={label} anchor="start">
            E L E C T R I C A L
          </Annot>
        </g>
      )}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 04 — Isometric pipe run                                             */
/* ------------------------------------------------------------------ */

function Pipe({ line, faint, wash, accent, bare, label }: DrawProps) {
  const r = 26;
  const y0 = 320;
  const x0 = 130;
  const x1 = W - 130;

  const elbow = (x: number, y: number, dx: number, dy: number) => {
    const c = pts([iso(dx * 120, dy * 120, 0)]);
    return c;
  };

  return (
    <g>
      {/* Main run drawn as a doubled isometric line with flanges */}
      <g fill="none" vectorEffect="non-scaling-stroke">
        <line x1={x0} y1={y0} x2={x1} y2={y0} stroke={line} strokeWidth="3" />
        <line x1={x0} y1={y0 - r * 1.7} x2={x1} y2={y0 - r * 1.7} stroke={faint} strokeWidth="1.4" />
        <line x1={x0} y1={y0 + r * 1.7} x2={x1} y2={y0 + r * 1.7} stroke={faint} strokeWidth="1.4" />

        {/* Branch dropping to a lower level */}
        <polyline points={`${x0 + 210},${y0} ${x0 + 210},${y0 + 130} ${x0 + 470},${y0 + 130}`} stroke={line} strokeWidth="3" />
        <polyline points={`${x0 + 470},${y0 + 130} ${x0 + 470},${H - 160}`} stroke={line} strokeWidth="3" />

        {/* Second branch */}
        <polyline points={`${x1 - 260},${y0} ${x1 - 260},${y0 + 210} ${x1 - 90},${y0 + 210}`} stroke={faint} strokeWidth="2" />
      </g>

      {/* Flanges */}
      {[x0 + 90, x0 + 380, x1 - 150].map((x) => (
        <g key={x} stroke={line} strokeWidth="1.4" fill={wash} vectorEffect="non-scaling-stroke">
          <rect x={x} y={y0 - 34} width={16} height={68} />
          <line x1={x} y1={y0 - 34} x2={x} y2={y0 + 34} />
        </g>
      ))}

      {/* Valve */}
      <g stroke={accent} strokeWidth="1.6" fill={wash} vectorEffect="non-scaling-stroke">
        <path d={`M${x1 - 420} ${y0 - 34}l34 34-34 34-34-34z`} />
        <line x1={x1 - 454} y1={y0 - 34} x2={x1 - 420} y2={y0 + 34} stroke={accent} />
        <line x1={x1 - 420} y1={y0 - 34} x2={x1 - 420} y2={y0 - 96} stroke={accent} />
        <circle cx={x1 - 420} cy={y0 - 106} r={16} />
      </g>

      {/* Pipe hangers */}
      {[x0 + 210, x0 + 560, x1 - 260].map((x) => (
        <g key={`h${x}`} stroke={faint} strokeWidth="1.2" fill="none" vectorEffect="non-scaling-stroke">
          <path d={`M${x - 46} ${y0 - 44}v-52h92v52`} />
          <path d={`M${x - 46} ${y0 + 44}v52h92v-52`} />
        </g>
      ))}

      {/* Flow arrows */}
      <g fill={accent} opacity="0.8">
        <path d={`M${x0 + 640} ${y0}l34 10-34 10z`} />
        <path d={`M${x0 + 640} ${y0 + 124}l34 10-34 10z`} />
      </g>

      {/* Trap / floor gully */}
      <g stroke={accent} strokeWidth="1.6" fill={wash} vectorEffect="non-scaling-stroke">
        <rect x={x0 + 432} y={H - 200} width={76} height={44} />
        <circle cx={x0 + 470} cy={H - 178} r={11} />
      </g>

      {!bare && (
        <g>
          <Dimension x1={x0} y1={y0 - 118} x2={x1} y2={y0 - 118} color={label} label="SET FALL 1:80" />
          <Annot x={74} y={130} fill={label}>
            WATER / DRAINAGE — ISOMETRIC RUN
          </Annot>
          <Annot x={74} y={156} fill={label}>
            SUPPORTS AT FIXED CENTRES
          </Annot>
          <Annot x={x0 + 470} y={H - 118} fill={label} anchor="middle" size={13}>
            FLOOR TRAP
          </Annot>
        </g>
      )}
      {void elbow}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 05 — Tile set-out                                                   */
/* ------------------------------------------------------------------ */

function Tile({ uid, line, wash, accent, bare, label }: DrawProps) {
  const cols = 8;
  const rows = 6;
  const ox = 168;
  const oy = 130;
  const gap = 8;
  const tw = (W - 336 - gap * (cols - 1)) / cols;
  const th = (H - 300 - gap * (rows - 1)) / rows;

  return (
    <g>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((__, c) => {
          const offset = r % 2 === 0 ? 0 : -tw / 2;
          const x = ox + c * (tw + gap) + offset;
          const y = oy + r * (th + gap);
          if (x < ox - 2 || x + tw > W - ox + 2) return null;
          const accentTile = (r === 2 && c === 3) || (r === 3 && c === 4);
          const hatched = (r === 4 && c === 6) || (r === 1 && c === 0);
          return (
            <rect
              key={`${r}-${c}`}
              x={x}
              y={y}
              width={tw}
              height={th}
              fill={hatched ? `url(#${uid}-hatch)` : accentTile ? wash : "none"}
              stroke={accentTile ? accent : line}
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          );
        }),
      )}

      {/* Centreline set-out marks */}
      <g stroke={accent} strokeWidth="1.2" vectorEffect="non-scaling-stroke" opacity="0.9">
        <path d={`M${W / 2} ${oy - 46}v-24M${W / 2} ${oy + rows * (th + gap) + 24}v24`} />
        <path d={`M${ox - 46} ${oy + rows * (th + gap) / 2}h-24M${ox + cols * (tw + gap) + 22} ${oy + rows * (th + gap) / 2}h24`} />
      </g>
      <g fill={accent}>
        <circle cx={W / 2} cy={oy + rows * (th + gap) / 2} r={5} />
      </g>

      {/* Fall arrows toward drain */}
      <g stroke={accent} strokeWidth="1.4" fill="none" vectorEffect="non-scaling-stroke">
        <path d={`M${W / 2 - 150} ${oy + rows * (th + gap) - 40}l-46 0m16-14l-16 14 16 14`} />
        <path d={`M${W / 2 + 150} ${oy + rows * (th + gap) - 40}l-46 0m16-14l-16 14 16 14`} />
      </g>
      {/* Drain */}
      <g stroke={accent} strokeWidth="1.6" fill={wash} vectorEffect="non-scaling-stroke">
        <circle cx={W / 2} cy={oy + rows * (th + gap) + 34} r={26} />
        <circle cx={W / 2} cy={oy + rows * (th + gap) + 34} r={9} />
      </g>

      {!bare && (
        <g>
          <Dimension x1={ox} y1={oy - 62} x2={ox + tw * 2 + gap} y2={oy - 62} color={label} label="MODULE" />
          <Annot x={ox} y={oy - 88} fill={label}>
            OFFSET BOND — SET OUT FROM CENTRELINE
          </Annot>
          <Annot x={W / 2} y={oy + rows * (th + gap) + 96} fill={label} anchor="middle" size={13}>
            FALL TO DRAIN
          </Annot>
        </g>
      )}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 06 — Wall section / renovation layers                               */
/* ------------------------------------------------------------------ */

function SectionPlate({ uid, line, wash, accent, bare, label }: DrawProps) {
  const layers = [
    { h: 46, fill: "none", name: "FINISH / TILE" },
    { h: 30, fill: `url(#${uid}-hatch)`, name: "ADHESIVE + TILE" },
    { h: 84, fill: wash, name: "BLOCKWORK" },
    { h: 54, fill: `url(#${uid}-cross)`, name: "EXISTING STRUCTURE" },
    { h: 66, fill: wash, name: "NEW INFILL" },
    { h: 40, fill: `url(#${uid}-hatch-dense)`, name: "SCREED" },
  ];

  let y = 190;
  const rows = layers.map((l) => {
    const row = { ...l, y };
    y += l.h + 5;
    return row;
  });

  return (
    <g>
      {rows.map((l, i) => (
        <g key={l.name}>
          <rect
            x={300}
            y={l.y}
            width={600}
            height={l.h}
            fill={l.fill}
            stroke={i === 3 ? accent : line}
            strokeWidth={i === 3 ? 1.4 : 1}
            vectorEffect="non-scaling-stroke"
          />
          {!bare && (
            <Annot x={920} y={l.y + l.h / 2 + 5} fill={label} size={13}>
              {l.name}
            </Annot>
          )}
          {!bare && (
            <line
              x1={902}
              y1={l.y + l.h / 2}
              x2={914}
              y2={l.y + l.h / 2}
              stroke={label}
              strokeWidth="0.9"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </g>
      ))}

      {/* Demolition limit — dashed, accent */}
      <g stroke={accent} strokeWidth="1.6" fill="none" vectorEffect="non-scaling-stroke">
        <path d={`M240 ${rows[3].y - 22}h-40M240 ${rows[3].y + rows[3].h + 22}h-40`} />
        <path d={`M200 ${rows[3].y - 22}v${rows[3].h + 44}`} strokeDasharray="12 8" />
      </g>
      {!bare && (
        <Annot x={200} y={rows[3].y - 38} fill={accent} anchor="middle" size={13}>
          RETAIN
        </Annot>
      )}

      {/* Conduit embedded in the new build-up */}
      <g stroke={accent} strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke">
        <circle cx={430} cy={rows[4].y + rows[4].h / 2} r={20} />
        <line x1={430} y1={rows[4].y + rows[4].h / 2} x2={640} y2={rows[4].y + rows[4].h / 2} />
        <circle cx={660} cy={rows[4].y + rows[4].h / 2} r={20} />
        <line x1={660} y1={rows[4].y + rows[4].h / 2} x2={840} y2={rows[4].y + rows[4].h / 2} />
      </g>

      {!bare && (
        <g>
          <Dimension
            x1={262}
            y1={rows[0].y}
            x2={262}
            y2={rows[rows.length - 1].y + rows[rows.length - 1].h}
            color={label}
            label="BUILD-UP"
          />
          <Annot x={300} y={rows[0].y - 44} fill={label}>
            SECTION THROUGH EXISTING & NEW BUILD-UP
          </Annot>
          <Annot x={300} y={H - 110} fill={label} size={13}>
            SERVICES CAST IN — NOT CHASED IN
          </Annot>
        </g>
      )}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 07 — Finish detail                                                  */
/* ------------------------------------------------------------------ */

function DetailPlate({ uid, line, wash, accent, bare, label }: DrawProps) {
  return (
    <g>
      {/* Floor build-up */}
      <g stroke={line} strokeWidth="1.2" fill="none" vectorEffect="non-scaling-stroke">
        <rect x={240} y={560} width={720} height={40} />
        <rect x={240} y={600} width={720} height={26} />
        <rect x={240} y={626} width={720} height={54} fill={`url(#${uid}-cross)`} />
      </g>

      {/* Wall */}
      <rect x={240} y={190} width={54} height={370} fill={wash} stroke={line} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
      <rect x={294} y={190} width={26} height={370} fill="none" stroke={accent} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />

      {/* Skirting profile */}
      <g stroke={line} strokeWidth="1.2" fill={wash} vectorEffect="non-scaling-stroke">
        <path d="M320 526h34v18h12v16h-46z" />
      </g>

      {/* Movement joint in the screed */}
      <g stroke={accent} strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke">
        <path d={`M600 560v120`} strokeDasharray="10 8" />
      </g>
      <g fill={accent}>
        <circle cx={600} cy={560} r={4} />
        <circle cx={600} cy={680} r={4} />
      </g>

      {/* Fixture outline — basin */}
      <g stroke={line} strokeWidth="1.4" fill="none" vectorEffect="non-scaling-stroke">
        <path d="M700 400h190v52a48 48 0 0 1-48 48h-94a48 48 0 0 1-48-48z" />
        <path d="M724 400v-46h142v46" />
        <circle cx={795} cy={470} r={13} />
      </g>
      {/* Tap */}
      <g stroke={accent} strokeWidth="1.6" fill="none" vectorEffect="non-scaling-stroke">
        <path d="M795 354v-42h-44" />
        <circle cx={795} cy={348} r={11} />
      </g>

      {/* Edge trim detail */}
      <g stroke={line} strokeWidth="1.2" fill="none" vectorEffect="non-scaling-stroke">
        <rect x={960} y={190} width={30} height={370} />
        <line x1={960} y1={190} x2={990} y2={214} />
        <line x1={960} y1={560} x2={990} y2={536} />
      </g>

      {!bare && (
        <g>
          <Annot x={240} y={158} fill={label}>
            FINISH DETAIL — JUNCTION OF SURFACES
          </Annot>
          <Annot x={1010} y={380} fill={label} size={13}>
            MOVEMENT JOINT
          </Annot>
          <Annot x={700} y={336} fill={label} size={13}>
            FIXTURE SET SQUARE
          </Annot>
          <Annot x={320} y={706} fill={label} size={13}>
            SKIRTING / TILE EDGE / SCREED
          </Annot>
        </g>
      )}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* 08 — Floor plan                                                    */
/* ------------------------------------------------------------------ */

function Plan({ line, faint, wash, accent, bare, label }: DrawProps) {
  const rooms = [
    { x: 220, y: 200, w: 300, h: 250, name: "LIVING" },
    { x: 520, y: 200, w: 250, h: 250, name: "KITCHEN" },
    { x: 770, y: 200, w: 210, h: 250, name: "BATH" },
    { x: 220, y: 450, w: 470, h: 230, name: "BEDROOM" },
    { x: 690, y: 450, w: 290, h: 230, name: "UTILITY" },
  ];

  return (
    <g>
      {rooms.map((r, i) => (
        <g key={r.name}>
          <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={i === 2 ? wash : "none"} stroke={line} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
          {!bare && (
            <Annot x={r.x + r.w / 2} y={r.y + r.h / 2 - 4} fill={label} anchor="middle" size={15} letterSpacing={3}>
              {r.name}
            </Annot>
          )}
          {!bare && (
            <Annot x={r.x + r.w / 2} y={r.y + r.h / 2 + 20} fill={label} anchor="middle" size={12} letterSpacing={1.6}>
              {[1, 2, 3, 4, 5][i]}.0 × {[1, 2, 3, 4, 5][i]}.0
            </Annot>
          )}
        </g>
      ))}

      {/* Door swings */}
      <g stroke={faint} strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke">
        <path d="M520 400a75 75 0 0 1-75 75" />
        <path d="M445 475v-75h75" />
        <path d="M690 560a70 70 0 0 1-70 70" />
        <path d="M620 630v-70h70" />
        <path d="M770 340a55 55 0 0 0-55 55" />
      </g>

      {/* Wet runs — accent */}
      <g stroke={accent} strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" opacity="0.9">
        <path d="M960 250v120H820" />
        <circle cx={820} cy={370} r={8} />
        <path d="M260 640h150" />
        <circle cx={430} cy={640} r={8} />
      </g>

      {/* Structural grid bubbles */}
      <g stroke={line} strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke">
        {[220, 520, 770, 980].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy={150} r={17} />
            <path d={`M${x - 26} 150h-16M${x + 26} 150h16`} />
            {!bare && (
              <text x={x} y={156} textAnchor="middle" fontFamily="var(--font-plex-mono), monospace" fontSize={15} fill={label}>
                {String.fromCharCode(65 + i)}
              </text>
            )}
          </g>
        ))}
      </g>

      {/* North arrow */}
      <g stroke={accent} strokeWidth="1.4" fill="none" vectorEffect="non-scaling-stroke">
        <path d="M144 240v-72" />
        <path d="M144 168l-14 26h28z" fill={accent} />
      </g>
      {!bare && (
        <Annot x={144} y={272} fill={accent} anchor="middle" size={13}>
          N
        </Annot>
      )}

      {!bare && (
        <Annot x={220} y={760} fill={label}>
          GENERAL ARRANGEMENT — LEVEL 00
        </Annot>
      )}
    </g>
  );
}