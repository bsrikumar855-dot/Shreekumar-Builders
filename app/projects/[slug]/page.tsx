import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import SmartImage from "@/components/ui/SmartImage";
import Reveal from "@/components/animations/Reveal";

import { getProject, projectSlugs, scopeLabel } from "@/lib/data/projects";
import { services } from "@/lib/data/services";
import PendingNote from "@/components/ui/PendingNote";

export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.placeholder ? `${project.index} — Project` : project.title,
    description: project.overview[0].replace(/\[|\]/g, "").trim(),
    alternates: { canonical: `/projects/${project.slug}` },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <>
      <PageHeader
        index={project.index}
        label="Project"
        lines={[project.title]}
        lead={project.placeholder ? undefined : project.overview[0]}
        meta={[
          { k: "Location", v: project.location },
          { k: "Year", v: project.year },
        ]}
      />

      <div className="grain border-t border-ink-12">
        <div className="shell">
          {/* Cinematic hero */}
          <Reveal y={26} className="pt-14 lg:pt-20">
            <SmartImage
              src={project.image}
              alt={`${project.title} — Shreekumar Builders`}
              plate={project.plate}
              className="aspect-[4/3] w-full lg:aspect-[16/9]"
              priority
              reveal
              sizes="100vw"
              caption={`${project.index} — ${project.title}`}
            />
          </Reveal>

          <div className="grid grid-cols-12 gap-x-5 gap-y-12 py-14 lg:gap-x-8 lg:py-20">
            {/* Overview */}
            <div className="col-span-12 lg:col-span-6">
              <h2 className="meta text-ink-35">Overview</h2>
              <div className="mt-6 space-y-5">
                {project.overview.map((para, i) => (
                  <Reveal y={20} key={i}>
                    <p className="lead max-w-[54ch] text-ink-70">{para}</p>
                  </Reveal>
                ))}
              </div>

              <div className="mt-8">
                <PendingNote>
                  Project narrative awaiting verified site information
                </PendingNote>
              </div>
            </div>

            {/* Scope + facts */}
            <aside className="col-span-12 lg:col-span-4 lg:col-start-9">
              <h2 className="meta text-ink-35">Scope delivered</h2>
              <ul className="mt-6 border-t border-ink-12">
                {project.scope.map((s) => (
                  <li key={s}>
                    <Reveal y={16}>
                      <div className="flex items-baseline gap-4 border-b border-ink-12 py-3.5">
                        <span className="meta-sm text-ink-25">—</span>
                        <Link
                          href={`/services/${s}`}
                          className="link-rule body-copy text-ink-70"
                        >
                          {scopeLabel(s, services)}
                        </Link>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ul>

              <h2 className="meta mt-10 text-ink-35">Project details</h2>
              <dl className="mt-6 border-t border-ink-12">
                {project.facts.map((f) => (
                  <div key={f.key} className="flex items-baseline gap-6 border-b border-ink-12 py-3.5">
                    <dt className="meta w-32 shrink-0 text-ink-35">{f.key}</dt>
                    <dd className="body-copy text-ink-70">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <section
        data-surface="light"
        className="grain border-t border-ink-12 bg-limestone py-[var(--spacing-section)]"
        aria-labelledby="gallery-title"
      >
        <div className="shell">
          <h2 id="gallery-title" className="heading text-ink">
            Gallery
          </h2>

          <ul className="mt-10 space-y-12 lg:mt-14 lg:space-y-20">
            {project.gallery.map((g, i) => (
              <li key={g.src}>
                <Reveal y={28}>
                  <figure>
                    <SmartImage
                      src={g.src}
                      alt={`${project.title} — ${g.caption}`}
                      plate={g.plate}
                      className={`w-full ${
                        i % 2 === 0 ? "aspect-[16/10]" : "aspect-[4/3] lg:aspect-[16/9]"
                      }`}
                      reveal
                      sizes="100vw"
                    />
                    <figcaption className="mt-4 flex items-baseline gap-4 border-t border-ink-12 pt-4">
                      <span className="meta-sm text-ink-25">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="meta text-ink-60">{g.caption}</span>
                    </figcaption>
                  </figure>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Next */}
      <section data-surface="light" className="grain border-t border-ink-12 py-16 lg:py-24">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <p className="meta text-ink-35">More projects</p>
            <Link
              href="/projects"
              data-cursor="All"
              className="link-rule meta text-ink-70 transition-colors hover:text-oxide"
            >
              All projects →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}