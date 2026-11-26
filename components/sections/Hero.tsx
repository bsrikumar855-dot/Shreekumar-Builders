import { Blob, Cta } from "@/components/ui/Bits";

/**
 * Hero — layered for depth.
 *   back   orange / rust blobs + grid  (drift slower than the page)
 *   mid    black headline              (z-10)
 *   front  crane + hanging module      (z-20, rises and swings)
 *   top    outline copy of headline    (z-30) so the module reads *inside* the type
 */
function Crane() {
  return (
    <svg viewBox="0 0 720 700" className="h-auto w-full overflow-visible" aria-hidden>
      {/* Cable + hook + slings sway together */}
      <g className="sway" style={{ transformOrigin: "360px 0px" }}>
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

        {/* The module */}
        <g transform="rotate(-8 360 480)">
          <rect x="120" y="360" width="480" height="240" fill="var(--color-orange)" stroke="var(--color-ink)" strokeWidth="5" />
          {Array.from({ length: 21 }).map((_, i) => (
            <rect
              key={i}
              x={134 + i * 14}
              y={366}
              width={6}
              height={228}
              fill="var(--color-rust)"
              opacity={0.55}
            />
          ))}
          {/* white panel with swoosh, like a livery */}
          <rect x="396" y="366" width="198" height="228" fill="var(--color-cream)" />
          <path
            d="M396 386h120c40 0 52 36 22 56-24 16-60 20-60 52 0 30 38 30 38 70H396z"
            fill="var(--color-orange)"
          />
          <rect x="120" y="590" width="480" height="14" fill="var(--color-ink)" />
          <rect x="120" y="360" width="22" height="16" fill="var(--color-ink)" />
          <rect x="578" y="360" width="22" height="16" fill="var(--color-ink)" />
          {/* label */}
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
  );
}

function Badge() {
  return (
    <div data-spin="160" className="h-28 w-28 md:h-36 md:w-36">
      <svg viewBox="0 0 120 120" className="spin-slow h-full w-full" aria-hidden>
        <defs>
          <path id="badge-circle" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" />
        </defs>
        <circle cx="60" cy="60" r="58" fill="var(--color-ink)" />
        <text
          fill="var(--color-cream)"
          style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" }}
        >
          <textPath href="#badge-circle" textLength="283" lengthAdjust="spacing">
            Six trades · One team · One scope ·
          </textPath>
        </text>
        <path d="M44 38h32v10H54v4h22v22H44V64h22v-4H44z" fill="var(--color-orange)" transform="translate(0 4)" />
      </svg>
    </div>
  );
}

const TRADES = ["Building", "Electrical", "Plumbing", "Tile Laying", "Renovation", "Finishing"];

export default function Hero() {
  return (
    <section
      data-parallax-scope
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-cream pb-14 pt-[7.5rem] md:pb-20"
    >
      {/* BACK layer — slower than the page */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
        <div data-parallax="-0.28" className="absolute -right-[18%] -top-[22%] w-[78vw] max-w-[1100px]">
          <div data-mouse="0.012">
            <Blob variant="a" fill="var(--color-orange)" className="w-full" />
          </div>
        </div>
        <div data-parallax="-0.12" className="absolute -bottom-[52%] right-[6%] w-[62vw] max-w-[980px]">
          <div data-mouse="-0.016">
            <Blob variant="c" fill="var(--color-rust)" className="w-full" />
          </div>
        </div>
        <div
          data-parallax="-0.45"
          className="absolute inset-x-0 top-0 h-[140%] opacity-[0.16]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-ink) 1px, transparent 1px), linear-gradient(90deg, var(--color-ink) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(ellipse at 50% 35%, #000 20%, transparent 72%)",
            WebkitMaskImage: "radial-gradient(ellipse at 50% 35%, #000 20%, transparent 72%)",
          }}
        />
      </div>

      <div className="shell relative flex flex-1 flex-col justify-between gap-10">
        <div>
          <p className="label mb-5 flex items-center gap-3" data-reveal data-delay="100">
            <span className="bg-ink px-2 py-1 text-cream">01</span>
            Building · Civil · Electrical · Plumbing · Tiling
          </p>

          <div className="relative">
            {/* MID layer: solid headline */}
            <h1 className="display relative z-10 text-ink" data-reveal="wipe" data-delay="150">
              Built with
              <br />
              Precision<span className="text-orange">.</span>
            </h1>

            {/* TOP layer: same headline as an outline, above the crane */}
            <div
              aria-hidden
              data-reveal="wipe"
              data-delay="150"
              className="display outline-text pointer-events-none absolute inset-0 z-30 hidden md:block"
            >
              Built with
              <br />
              Precision.
            </div>
          </div>
        </div>

        {/* FRONT layer: crane */}
        <div
          data-parallax="0.22"
          className="relative z-20 mx-auto w-[min(86vw,28rem)] md:absolute md:-top-6 md:right-[1%] md:mx-0 md:w-[min(58vw,58rem)]"
        >
          <div className="hero-drop">
            <Crane />
          </div>
        </div>

        <div className="relative z-20 grid grid-cols-12 items-end gap-x-6 gap-y-8">
          <div className="col-span-12 md:col-span-5 lg:col-span-4">
            <p className="label max-w-[34ch] !leading-[1.7] text-ink" data-reveal data-delay="300">
              Structure, services and finishes are planned on the same drawing and executed by the
              same team. Set out first. Built to dimension.
            </p>
            <div className="mt-8 flex flex-wrap gap-4" data-reveal data-delay="450">
              <Cta href="/contact">Start a project</Cta>
              <Cta href="/projects" variant="paper">
                View our work
              </Cta>
            </div>
          </div>

          <div className="col-span-12 flex items-end justify-between gap-6 md:col-span-7 lg:col-span-8 lg:pl-[22%]">
            <ul className="hidden flex-wrap gap-2 md:flex" aria-label="Trades">
              {TRADES.map((t, i) => (
                <li
                  key={t}
                  data-reveal
                  data-delay={String(550 + i * 70)}
                  className="label border-2 border-ink bg-cream px-3 py-2"
                >
                  {t}
                </li>
              ))}
            </ul>
            <div className="ml-auto" data-reveal="scale" data-delay="900">
              <Badge />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
