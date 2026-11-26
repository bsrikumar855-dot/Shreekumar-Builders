import { Blob, Cta } from "@/components/ui/Bits";
import HangingBulb from "@/components/sections/HangingBulb";
import { services } from "@/lib/data/services";
import SpinBadge from "@/components/sections/SpinBadge";

/**
 * Hero — layered for depth.
 *   back   orange / rust blobs + grid  (drift slower than the page)
 *   mid    black headline              (z-10)
 *   front  hanging bulb               (z-20, drops in, swings, switches on)
 *   top    outline copy of headline    (z-30) so the bulb reads *inside* the type
 */
const TRADES = services.map((s) => s.title);

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
            Electrical · Plumbing · Building · Tiling
          </p>

          <div className="relative">
            {/* MID layer: solid headline */}
            <h1 className="display relative z-10 text-ink" data-reveal="wipe" data-delay="150">
              Wired with
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
              Wired with
              <br />
              Precision.
            </div>
          </div>
        </div>

        {/* FRONT layer: crane */}
        <div
          data-parallax="0.22"
          className="relative z-20 mx-auto w-[min(86vw,28rem)] md:absolute md:-top-6 md:right-[6%] md:mx-0 md:w-[min(56vw,56rem)]"
        >
          <div className="hero-drop">
            <HangingBulb />
          </div>
        </div>

        <div className="relative z-20 grid grid-cols-12 items-end gap-x-6 gap-y-8">
          <div className="col-span-12 md:col-span-5 lg:col-span-4">
            <p className="label max-w-[34ch] !leading-[1.7] text-ink" data-reveal data-delay="300">
              Electrical first. Wiring, power and lighting are planned on the same drawing as the
              plumbing, structure and finishes, and installed by one team. Set out first.
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
              <SpinBadge />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
