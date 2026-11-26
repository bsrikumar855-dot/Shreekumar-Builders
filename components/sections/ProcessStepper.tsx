import Illustration from "@/components/ui/Illustration";
import { process } from "@/lib/data/process";

/**
 * Process — a pinned, scroll-driven stepper. The stage sticks while the page
 * scrolls through it; ScrollFX swaps the active step and drives the progress
 * bar. Without JS / with reduced motion it degrades to a plain list.
 */
export default function ProcessStepper({ heading = true }: { heading?: boolean }) {
  const n = process.length;
  return (
    <section
      className="steps relative bg-orange"
      style={{ ["--n" as string]: n }}
      aria-labelledby="process-title"
    >
      <div className="steps-stage">
        {/* Header + progress */}
        <div className="shell absolute inset-x-0 top-[5.4rem] z-20 hidden items-center gap-6 [html.fx_&]:flex">
          <p className="label flex shrink-0 items-center gap-3">
            <span className="bg-ink px-2 py-1 text-cream">05</span>
            Process
          </p>
          <div className="h-[6px] flex-1 bg-ink/20" aria-hidden>
            <div className="steps-bar h-full bg-ink" />
          </div>
          <p className="label shrink-0">{n} stages</p>
        </div>

        {heading && (
          <div className="shell pb-6 pt-24 [html.fx_&]:hidden">
            <h2 id="process-title" className="h2">
              How a project runs
            </h2>
          </div>
        )}
        {!heading && <h2 id="process-title" className="sr-only">How a project runs</h2>}

        {process.map((s, i) => (
          <article key={s.index} className="steps-item" data-active={i === 0 ? "true" : "false"}>
            <div className="shell grid h-full grid-cols-12 items-center gap-x-8 gap-y-6">
              <div className="col-span-12 md:col-span-7">
                <p className="label">
                  Step {s.index} / {String(n).padStart(2, "0")} — {s.kicker}
                </p>
                <div className="relative mt-2">
                  <span
                    aria-hidden
                    className="font-display outline-text absolute -top-[0.22em] left-0 select-none text-[clamp(8rem,26vw,22rem)] leading-none opacity-[0.16]"
                  >
                    {s.index}
                  </span>
                  <h3 className="display-2 relative pt-[0.4em]">{s.title}</h3>
                </div>
                <p className="lead mt-6 max-w-[48ch] text-[clamp(1rem,1.35vw,1.3rem)]">{s.body}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {s.outputs.map((o) => (
                    <li key={o} className="label border-2 border-ink bg-cream px-3 py-2">
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="hidden md:col-span-5 md:block">
                <div className="card overflow-hidden" style={{ transform: `rotate(${i % 2 ? 3 : -3}deg)` }}>
                  <Illustration
                    variant={s.plate}
                    tone={i % 2 ? "cream" : "ink"}
                    title={`${s.title} — illustration`}
                    className="aspect-[4/3] w-full"
                  />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
