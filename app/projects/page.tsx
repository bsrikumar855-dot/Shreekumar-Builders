import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import SmartImage from "@/components/ui/SmartImage";
import Reveal from "@/components/animations/Reveal";
import { projects, scopeLabel } from "@/lib/data/projects";
import { services } from "@/lib/data/services";
import PendingNote from "@/components/ui/PendingNote";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected building, electrical, plumbing and tiling works by Shreekumar Builders.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        index="02"
        label="Projects"
        lines={["Selected", "work."]}
        serifLine="Documented, not decorated."
        lead="Each project is recorded with its scope, its sequence and the details that mattered. Project titles and locations are added as site photography is supplied."
        meta={[{ k: "Entries", v: String(projects.length).padStart(2, "0") }]}
      />

      <div className="grain border-t border-ink-12 py-[var(--spacing-section)]">
        <div className="shell">
          <div className="mb-10">
            <PendingNote>
              Project entries are structured placeholders — replace with verified
              project data in lib/data/projects.ts
            </PendingNote>
          </div>

          <ul className="grid grid-cols-1 gap-x-6 gap-y-14 lg:grid-cols-2 lg:gap-y-20">
            {projects.map((p, i) => (
              <li key={p.slug}>
                <Reveal y={28} delay={(i % 2) * 0.06}>
                  <Link href={`/projects/${p.slug}`} data-cursor="Open" className="group block">
                    <div className="relative aspect-[4/3] overflow-hidden bg-limestone">
                      <div className="absolute inset-0 transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]">
                        <SmartImage
                          src={p.image}
                          alt={`${p.title} — Shreekumar Builders`}
                          plate={p.plate}
                          className="h-full w-full"
                          sizes="(max-width: 1023px) 100vw, 42rem"
                        />
                      </div>
                      <span className="meta pointer-events-none absolute left-4 top-4 border border-ink/20 bg-bone/85 px-2.5 py-1.5 text-ink backdrop-blur-sm">
                        {p.index}
                      </span>
                    </div>

                    <div className="mt-5 border-t border-ink-12 pt-5">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                        <h2 className="text-[clamp(1.5rem,2.6vw,2.4rem)] leading-none tracking-[-0.035em] text-ink transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
                          {p.title}
                        </h2>
                        <p className="meta-sm text-ink-45">
                          {p.location} · {p.year}
                        </p>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {p.scope.map((s) => (
                          <span key={s} className="meta-sm border border-ink-12 px-2 py-1 text-ink-45">
                            {scopeLabel(s, services)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}