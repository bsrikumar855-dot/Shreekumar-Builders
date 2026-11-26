import { Blob, SectionLabel } from "@/components/ui/Bits";
import { process } from "@/lib/data/process";
import { services } from "@/lib/data/services";

const facts = [
  { n: String(services.length).padStart(2, "0"), t: "Trades under one scope", rot: -5, speed: 0.1, bg: "bg-orange" },
  { n: String(process.length).padStart(2, "0"), t: "Stages, consult to handover", rot: 4, speed: -0.06, bg: "bg-paper" },
  { n: "01", t: "Team from set-out to snag list", rot: -3, speed: 0.16, bg: "bg-ink text-cream" },
];

export default function Positioning() {
  return (
    <section
      data-parallax-scope
      className="relative overflow-hidden bg-cream py-[var(--spacing-section)]"
      aria-labelledby="position-title"
    >
      {/* Background: giant outline word drifting sideways + rust blob */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div data-parallax="-0.2" className="absolute -right-[12%] top-[8%] w-[46vw] max-w-[640px] opacity-90">
          <Blob variant="b" fill="var(--color-sand)" className="w-full" />
        </div>
        <div
          data-parallax-x="0.7"
          className="font-display outline-text absolute bottom-[4%] left-0 whitespace-nowrap text-[clamp(8rem,26vw,28rem)] uppercase leading-none opacity-[0.12]"
        >
          Systems · Structure ·
        </div>
      </div>

      <div className="shell relative">
        <SectionLabel n="02">Position</SectionLabel>

        <div className="mt-8 grid grid-cols-12 items-end gap-x-6 gap-y-10">
          <h2 id="position-title" className="display-2 col-span-12 lg:col-span-8" data-split>
            We don&apos;t just build structures. We build the{" "}
            <span className="inline-block bg-orange px-[0.12em] leading-[0.92]">systems</span> that make them work.
          </h2>
          <div className="col-span-12 lg:col-span-4" data-reveal data-delay="200">
            <p className="lead">
              A building is not only walls and finishes. It is structure, electrical, plumbing and
              surface — planned together, so nothing collides and nothing is chased into a finished
              wall.
            </p>
          </div>
        </div>

        <ul className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3 lg:mt-24">
          {facts.map((f) => (
            <li key={f.t} data-parallax-scope>
              <div data-parallax={f.speed}>
                <div data-rotate={f.rot}>
                  <div data-tilt className={`card p-6 lg:p-8 ${f.bg}`}>
                    <p className="font-display text-[clamp(4rem,9vw,8rem)] leading-[0.9]">{f.n}</p>
                    <p className="label mt-4 max-w-[22ch]">{f.t}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
