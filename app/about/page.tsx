import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import SmartImage from "@/components/ui/SmartImage";
import MaterialSwatch from "@/components/ui/MaterialSwatch";
import Reveal from "@/components/animations/Reveal";
import RevealText from "@/components/animations/RevealText";
import PendingNote from "@/components/ui/PendingNote";
import { materials } from "@/lib/data/process";
import { services } from "@/lib/data/services";
import { site } from "@/lib/data/site";
import { buttonGhost } from "@/components/animations/MagneticButton";
import ScrollToButton from "@/components/ui/ScrollToButton";

export const metadata: Metadata = {
  title: "About",
  description:
    "Shreekumar Builders — building and civil works, electrical, plumbing and tile laying, delivered as one coordinated scope.",
  alternates: { canonical: "/about" },
};

const principles = [
  {
    index: "01",
    title: "Set out before building",
    body: "Grid lines, levels and dimensions are agreed and marked on site before the first pour or the first block is laid. It is the cheapest correction available.",
  },
  {
    index: "02",
    title: "Services planned, not chased",
    body: "Conduits, sleeves and pipe routes are resolved with the structure. Chasing services into finished walls is slow, messy and always leaves a weak patch.",
  },
  {
    index: "03",
    title: "Trade coordination is our job",
    body: "Building, electrical and plumbing are our own scope. That removes the gap where one trade's assumption becomes another trade's problem on site.",
  },
  {
    index: "04",
    title: "Checked before it is covered",
    body: "Electrical, plumbing and drainage are verified while they are still visible. Once a wall is closed, verification is guesswork.",
  },
  {
    index: "05",
    title: "Finish is part of the job",
    body: "Tiling, plastering and painting are planned from the set-out, not improvised at the end. A finished surface should read as one continuous plane.",
  },
  {
    index: "06",
    title: "Handover in writing",
    body: "Outstanding items are listed and closed, the site is cleared, and what was built is explained before the keys change hands.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        index="04"
        label="About"
        lines={["Building is a craft.", "Execution is a discipline."]}
        serifLine="That is the whole idea."
        lead={`${site.name} — ${site.tradeName} — works across building and civil, electrical, plumbing and tiling for residential and commercial projects.`}
        meta={[
          { k: "Trades", v: "06" },
          { k: "Works", v: "Residential · Commercial" },
        ]}
      />

      {/* Statement + drawing */}
      <div className="grain border-t border-ink-12 py-[var(--spacing-section)]">
        <div className="shell">
          <div className="grid grid-cols-12 gap-x-5 gap-y-12 lg:gap-x-8">
            <div className="col-span-12 lg:col-span-6">
              <h2 className="meta text-ink-35">The company</h2>
              <div className="mt-6 space-y-5">
                <Reveal y={20}>
                  <p className="lead max-w-[54ch] text-ink-70">
                    Most construction problems are not dramatic. They are small
                    misunderstandings about where something goes, made expensive by
                    the order they were made in.
                  </p>
                </Reveal>
                <Reveal y={20} delay={0.06}>
                  <p className="body-copy max-w-[54ch] text-ink-70">
                    Working as a single scope across the trades is how those
                    misunderstandings are designed out. The set-out is agreed
                    before the structure goes up. The services are drawn with the
                    structure, not after it. The finishes are planned from the same
                    set-out that set the dimensions.
                  </p>
                </Reveal>
                <Reveal y={20} delay={0.12}>
                  <p className="body-copy max-w-[54ch] text-ink-70">
                    That is a less dramatic way to describe quality than a promise,
                    and it is the one that survives contact with a real site.
                  </p>
                </Reveal>
              </div>

              <div className="mt-9 flex flex-wrap gap-2">
                {services.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="meta border border-ink-12 px-3 py-2 text-ink-60 transition-colors duration-500 hover:border-ink hover:text-ink"
                  >
                    {s.index} · {s.title}
                  </Link>
                ))}
              </div>

              <div className="mt-9">
                <PendingNote>
                  Founding year, team history and company profile to be supplied
                </PendingNote>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-5 lg:col-start-8">
              <Reveal y={26}>
                <SmartImage
                  src="about-workshop.webp"
                  alt="Shreekumar Builders — building, electrical, plumbing and tiling works"
                  plate="plan"
                  className="aspect-square w-full"
                  reveal
                  caption="Drawing 01"
                  sizes="(max-width: 1023px) 100vw, 36rem"
                />
              </Reveal>
            </div>
          </div>
        </div>
      </div>

      {/* Principles */}
      <section
        data-surface="light"
        className="grain border-t border-ink-12 bg-limestone py-[var(--spacing-section)]"
        aria-labelledby="principles-title"
      >
        <div className="shell">
          <h2 id="principles-title" className="heading max-w-[16ch] text-ink">
            <span className="block">Six working</span>
            <span className="serif block font-normal italic">principles.</span>
          </h2>

          <ol className="mt-12 border-t border-ink-12 lg:mt-16">
            {principles.map((p) => (
              <li key={p.index}>
                <Reveal y={24}>
                  <div className="grid grid-cols-12 items-baseline gap-x-5 gap-y-3 border-b border-ink-12 py-7 lg:gap-x-8 lg:py-9">
                    <span className="meta col-span-3 text-ink-35 lg:col-span-1">
                      {p.index}
                    </span>
                    <div className="col-span-9 lg:col-span-4">
                      <RevealText
                        as="h3"
                        text={p.title}
                        className="text-[clamp(1.35rem,2.4vw,2.1rem)] leading-[1.02] tracking-[-0.035em] text-ink"
                      />
                    </div>
                    <p className="body-copy col-span-12 max-w-[56ch] text-ink-70 lg:col-span-6 lg:col-start-7">
                      {p.body}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Materials */}
      <section
        data-surface="light"
        className="grain border-t border-ink-12 py-[var(--spacing-section)]"
        aria-labelledby="materials-title"
      >
        <div className="shell">
          <h2 id="materials-title" className="heading max-w-[18ch] text-ink">
            Materials, and how they behave
          </h2>

          <ul className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
            {materials.map((m, i) => (
              <li key={m.name}>
                <Reveal y={24} delay={i * 0.05} className="h-full">
                  <div className="flex h-full flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden bg-limestone">
                      <MaterialSwatch tone={m.tone} className="h-full w-full" />
                      <span className="meta-sm absolute left-4 top-4 text-ink-60">
                        {m.index}
                      </span>
                    </div>
                    <h3 className="mt-5 text-[1.5rem] leading-none tracking-[-0.035em] text-ink">
                      {m.name}
                    </h3>
                    <p className="meta-sm mt-2.5 text-oxide">{m.note}</p>
                    <p className="body-copy mt-3 max-w-[40ch] text-ink-70">{m.detail}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Close */}
      <section data-surface="light" className="grain border-t border-ink-12 py-16 lg:py-24">
        <div className="shell">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <h2 className="display-2 text-ink">
              <RevealText as="span" text="Let's build it right." />
            </h2>
            <div className="flex flex-wrap gap-3">
              <ScrollToButton target="contact" className={buttonGhost} cursorLabel="Talk">
                Start a project <span className="arrow-shift">→</span>
              </ScrollToButton>
              <Link href="/process" className={buttonGhost} data-cursor="See">
                See the process
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}