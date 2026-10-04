import Reveal from "@/components/animations/Reveal";
import RevealText from "@/components/animations/RevealText";
import { SectionMark, Crosshair } from "@/components/ui/Drafting";

/**
 * WhyShreekumar
 * Four positions, each with a mechanism rather than an adjective. No
 * experience counts, no awards, no testimonials — the reasoning is the proof.
 */
const pillars = [
  {
    index: "01",
    title: "Precision",
    body: "Attention to measurement, alignment and finishing. Levels are set out and checked before the work starts, not corrected once it is visible.",
    note: "Set out → build → verify",
  },
  {
    index: "02",
    title: "Coordination",
    body: "Building, electrical and plumbing are considered together from the first drawing, so service runs are planned into the structure instead of chased into it later.",
    note: "One drawing, one scope",
  },
  {
    index: "03",
    title: "Craftsmanship",
    body: "Installation quality is judged at the junction: how a tile meets a wall, how a board sits on a wall, how a joint is finished. That is where the standard shows.",
    note: "Junctions are the test",
  },
  {
    index: "04",
    title: "Accountability",
    body: "Clear communication about what is happening on site, what it costs, and what is outstanding. If something is not right, it is addressed rather than passed on.",
    note: "Named, dated, in writing",
  },
];

export default function WhyShreekumar() {
  return (
    <section
      data-surface="light"
      aria-labelledby="why-title"
      className="grain relative border-t border-ink-12 bg-limestone py-[var(--spacing-section)]"
    >
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionMark index="09" label="Why" />
            <h2 id="why-title" className="heading mt-7 max-w-[18ch] text-ink">
              <span className="block">Four positions,</span>
              <span className="serif block font-normal italic">each with a reason.</span>
            </h2>
          </div>
          <p className="meta max-w-[20ch] text-ink-45">
            Positions, not claims about numbers
          </p>
        </div>

        <div className="mt-12 lg:mt-16">
          <ul className="border-t border-ink-12">
            {pillars.map((p) => (
              <li key={p.index}>
                <Reveal y={26}>
                  <div className="group grid grid-cols-12 items-start gap-x-5 gap-y-4 border-b border-ink-12 py-8 lg:gap-x-8 lg:py-12">
                    {/* Index, on a drawn tab */}
                    <div className="col-span-3 flex items-center gap-4 lg:col-span-2">
                      <Crosshair className="hidden lg:block" />
                      <span className="meta text-ink-35 transition-colors duration-500 group-hover:text-oxide">
                        {p.index}
                      </span>
                    </div>

                    <div className="col-span-9 lg:col-span-3">
                      <RevealText
                        as="h3"
                        text={p.title}
                        className="text-[clamp(1.7rem,3.2vw,2.9rem)] leading-[0.95] tracking-[-0.04em] text-ink"
                      />
                    </div>

                    <div className="col-span-12 lg:col-span-5 lg:col-start-7">
                      <p className="body-copy max-w-[52ch] text-ink-70">{p.body}</p>
                    </div>

                    <p className="meta col-span-12 text-ink-35 lg:col-span-2 lg:col-start-5 lg:self-center">
                      {p.note}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}