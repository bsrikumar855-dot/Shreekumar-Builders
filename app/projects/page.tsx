import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import CtaBand from "@/components/sections/CtaBand";
import { ProjectCard } from "@/components/sections/ProjectsPreview";
import { PendingNote } from "@/components/ui/Bits";
import { projects } from "@/lib/data/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected work by Shreekumar Builders — building, electrical, plumbing, tiling and renovation projects.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const anyPlaceholder = projects.some((p) => p.placeholder);
  return (
    <>
      <PageHeader
        index="02"
        label="Projects"
        lines={["Work that", "speaks first"]}
        lead="Every project is delivered as one scope — structure, services and finishes under one team."
        meta={[{ k: "Projects", v: String(projects.length).padStart(2, "0") }]}
      />

      <section className="on-dark bg-rust py-[var(--spacing-section)] text-cream" aria-label="Project list">
        <div className="shell">
          {anyPlaceholder && (
            <div className="mb-12 text-ink" data-reveal>
              <PendingNote onDark>
                Project names, locations and details are being added — fill lib/data/projects.ts
              </PendingNote>
            </div>
          )}
          <ul className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2">
            {projects.map((p, i) => (
              <li key={p.slug} className={i % 2 ? "md:mt-20" : ""}>
                <ProjectCard p={p} i={i} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
