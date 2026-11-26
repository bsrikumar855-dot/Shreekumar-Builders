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
        {/* Header: segmented, clickable progress (shown when pinned) */}
        <div className="steps-head shell absolute inset-x-0 top-[4.9rem] z-20 items-center gap-5">
          <p className="label flex shrink-0 items-center gap-3">
            <span className="bg-ink px-2 py-1 text-cream">05</span>
            Process
          </p>
          <div className="flex flex-1 gap-1.5" role="group" aria-label="Process steps">
            {process.map((st, i) => (
              <button
                key={st.index}
                type="button"
                data-step-go={i}
                data-on={i === 0 ? "true" : "false"}
                data-cursor="Go"
                aria-label={`Go to step ${st.index}: ${st.title}`}
                className="group flex-1 py-[1.15rem]"
              >
                <span className="block h-[7px] bg-ink/20 transition-[background-color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:bg-ink/60 group-data-[on=true]:bg-ink" />
              </button>
            ))}
          </div>
          <p className="label hidden shrink-0 sm:block">{n} stages</p>
        </div>

        {heading ? (
          <div className="steps-plain shell pb-6 pt-24">
            <h2 id="process-title" className="h2">
              How a project runs
            </h2>
          </div>
        ) : (
          <h2 id="process-title" className="sr-only">
            How a project runs
          </h2>
        )}

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
