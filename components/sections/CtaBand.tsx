import { Cta } from "@/components/ui/Bits";

export default function CtaBand({
  lines = ["Let's build", "it right."],
  lead = "Send the location, the drawings and the brief. We'll tell you what it takes and the order it should be built in.",
}: {
  lines?: [string, string];
  lead?: string;
}) {
  return (
    <section
      data-parallax-scope
      className="relative isolate overflow-hidden bg-orange py-[var(--spacing-section)]"
      aria-labelledby="cta-title"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          data-parallax-x="0.9"
          className="font-display outline-text absolute top-[6%] whitespace-nowrap text-[clamp(10rem,32vw,32rem)] uppercase leading-none opacity-20"
        >
          Build · Build · Build ·
        </div>
        <div data-parallax="-0.3" className="absolute -bottom-[30%] -right-[10%] h-[70%] w-[48%] rounded-full bg-rust" />
        <div className="hazard absolute inset-x-0 bottom-0 h-3" />
      </div>

      <div className="shell relative">
        <h2 id="cta-title" className="display" data-split>
          {lines[0]}
          <br />
          {lines[1]}
        </h2>
        <div className="mt-10 grid grid-cols-12 items-end gap-6 lg:mt-14">
          <p className="lead col-span-12 max-w-[44ch] md:col-span-7" data-reveal data-delay="150">
            {lead}
          </p>
          <div className="col-span-12 flex flex-wrap gap-4 md:col-span-5 md:justify-end" data-reveal data-delay="300">
            <Cta href="/contact" variant="ink">
              Start a project
            </Cta>
            <Cta href="/process" variant="paper">
              See the process
            </Cta>
          </div>
        </div>
      </div>
    </section>
  );
}
