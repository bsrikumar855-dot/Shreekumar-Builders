import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import SmartImage from "@/components/ui/SmartImage";
import Reveal from "@/components/animations/Reveal";
import RevealText from "@/components/animations/RevealText";
import { process } from "@/lib/data/process";
import { buttonGhost } from "@/components/animations/MagneticButton";
import ScrollToButton from "@/components/ui/ScrollToButton";

export const metadata: Metadata = {
  title: "Process",
  description:
    "Consult, plan, prepare, build, install, finish, handover — the sequence a Shreekumar Builders project moves through.",
  alternates: { canonical: "/process" },
};

export default function ProcessPage() {
  return (
    <>
      <PageHeader
        index="03"
        label="Process"
        lines={["The sequence,", "drawn in order."]}
        serifLine="Nothing is covered before it is checked."
        lead="A project moves through seven stages. Each one produces something the next one depends on, which is why the order is not negotiable."
        meta={[{ k: "Stages", v: String(process.length).padStart(2, "0") }]}
      />

      <div className="grain border-t border-ink-12 py-[var(--spacing-section)]">
        <div className="shell">
          <ol className="border-t border-ink-12">
            {process.map((s, i) => (
              <li key={s.index} className="border-b border-ink-12">
                <Reveal y={26}>
                  <div className="grid grid-cols-12 items-start gap-x-5 gap-y-6 py-10 lg:gap-x-8 lg:py-16">
                    {/* index */}
                    <div className="col-span-4 lg:col-span-1">
                      <RevealText
                        as="span"
                        text={s.index}
                        wordClassName="text-oxide"
                        className="text-[clamp(1.6rem,3vw,2.6rem)] leading-none tracking-[-0.04em] tabular-nums"
                      />
                    </div>

                    {/* title + body */}
                    <div className="col-span-8 lg:col-span-4">
                      <h2 className="text-[clamp(1.8rem,3.6vw,3.2rem)] leading-[0.96] tracking-[-0.04em] text-ink">
                        {s.title}
                      </h2>
                      <p className="meta-sm mt-3 text-ink-35">{s.kicker}</p>
                      <p className="body-copy mt-5 max-w-[46ch] text-ink-70">{s.body}</p>
                    </div>

                    {/* outputs */}
                    <div className="col-span-12 lg:col-span-2 lg:col-start-6">
                      <p className="meta text-ink-35">Produces</p>
                      <ul className="mt-4 space-y-2">
                        {s.outputs.map((o) => (
                          <li key={o} className="meta-sm text-ink-60">
                            <span className="mr-2 text-oxide">—</span>
                            {o}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* drawing */}
                    <div className="col-span-12 lg:col-span-4 lg:col-start-9">
                      <div className="relative aspect-[4/3] overflow-hidden bg-limestone">
                        <SmartImage
                          src={`process-${s.index}.webp`}
                          alt={`${s.title} — stage ${s.index}`}
                          plate={s.plate}
                          className="h-full w-full"
                          reveal
                          sizes="(max-width: 1023px) 100vw, 30rem"
                        />
                      </div>
                      <p className="meta-sm mt-3 text-ink-35">
                        Sheet {String(i + 1).padStart(2, "0")} — {s.title}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>

          <div className="mt-14 flex flex-wrap gap-3 lg:mt-20">
            <ScrollToButton target="contact" className={buttonGhost} cursorLabel="Talk">
              Start a project <span className="arrow-shift">→</span>
            </ScrollToButton>
            <Link href="/projects" className={buttonGhost} data-cursor="See">
              View our work
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}