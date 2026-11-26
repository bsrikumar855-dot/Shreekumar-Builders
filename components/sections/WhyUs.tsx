import { principles } from "@/lib/data/principles";

export default function WhyUs({ id = "why-title" }: { id?: string }) {
  return (
    <section
      data-parallax-scope
      className="on-dark relative overflow-hidden bg-ink py-[var(--spacing-section)] text-cream"
      aria-labelledby={id}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          data-parallax="-0.25"
          className="font-display outline-cream absolute -right-[4%] top-[10%] text-[clamp(14rem,40vw,40rem)] uppercase leading-none opacity-70"
        >
          06
        </div>
      </div>

      <div className="shell relative grid grid-cols-12 gap-x-8 gap-y-12">
        <div className="col-span-12 lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <p className="label flex items-center gap-3">
              <span className="bg-orange px-2 py-1 text-ink">06</span>
              Why Shreekumar
            </p>
            <h2 id={id} className="h2 mt-6" data-split>
              Six rules we
              <br />
              <span className="text-orange">build by.</span>
            </h2>
            <p className="lead mt-6 max-w-[34ch] text-cream-70" data-reveal data-delay="150">
              Most construction problems are small misunderstandings about where something goes,
              made expensive by the order they were made in.
            </p>
          </div>
        </div>

        <ol className="col-span-12 lg:col-span-7">
          {principles.map((p) => (
            <li
              key={p.index}
              data-reveal
              className="group grid grid-cols-[3.5rem_1fr] gap-x-5 border-t border-cream-15 py-8 transition-colors duration-500 hover:bg-cream/[0.04] md:grid-cols-[5rem_1fr] md:px-4"
            >
              <span className="font-display text-4xl leading-none text-orange md:text-6xl">
                {p.index}
              </span>
              <div>
                <h3 className="h3">{p.title}</h3>
                <p className="mt-3 max-w-[52ch] text-cream-70">{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
