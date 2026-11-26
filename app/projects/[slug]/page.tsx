import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import SmartImage from "@/components/ui/SmartImage";
import CtaBand from "@/components/sections/CtaBand";
import { projectTitle } from "@/components/sections/ProjectsPreview";
import { PendingNote } from "@/components/ui/Bits";
import { getProject, projects, projectSlugs, scopeLabel } from "@/lib/data/projects";
import { services } from "@/lib/data/services";

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
    title: project.placeholder ? `Project ${project.index}` : project.title,
    description: project.overview[0].replace(/\[|\]/g, "").trim(),
    alternates: { canonical: `/projects/${project.slug}` },
  };
}

const TONES = ["orange", "cream", "ink", "rust"] as const;

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const idx = projects.findIndex((p) => p.slug === slug);
  const next = projects[(idx + 1) % projects.length];
  const title = projectTitle(project);

  return (
    <>
      <PageHeader
        index={project.index}
        label={title}
        crumbs={[{ label: "Projects", href: "/projects" }, { label: title }]}
        lines={[title]}
        lead={project.placeholder ? project.category : project.overview[0]}
        meta={[
          { k: "Location", v: project.placeholder ? "To be added" : project.location },
          { k: "Year", v: project.placeholder ? "To be added" : project.year },
        ]}
      />

      <section className="bg-sand py-[var(--spacing-section)]">
        <div className="shell">
          <div data-parallax-scope data-reveal="scale">
            <div className="card overflow-hidden">
              <SmartImage
                src={project.image}
                alt={`${title} — Shreekumar Builders`}
                plate={project.plate}
                tone={TONES[idx % 4]}
                parallax={-0.14}
                priority
                sizes="100vw"
                className="aspect-[4/3] w-full lg:aspect-[16/9]"
              />
            </div>
          </div>

          <div className="mt-20 grid grid-cols-12 gap-x-8 gap-y-14 lg:mt-28">
            <div className="col-span-12 lg:col-span-7">
              <h2 className="label">Overview</h2>
              <div className="mt-8 space-y-6">
                {project.overview.map((para, i) => (
                  <p key={i} data-reveal className={i === 0 ? "lead" : "text-[1.05rem] leading-[1.75] text-ink-70"}>
                    {para}
                  </p>
                ))}
              </div>
              {project.placeholder && (
                <div className="mt-8">
                  <PendingNote>Project narrative awaiting verified site information</PendingNote>
                </div>
              )}
            </div>

            <aside className="col-span-12 space-y-8 lg:col-span-5">
              <div className="card bg-paper p-6 lg:p-8" data-reveal="right">
                <h2 className="label">Scope delivered</h2>
                <ul className="mt-4">
                  {project.scope.map((s) => (
                    <li key={s} className="border-t-2 border-ink py-3">
                      <Link href={`/services/${s}`} className="u-link font-semibold">
                        {scopeLabel(s, services)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card bg-orange p-6 lg:p-8" data-reveal="right" data-delay="120">
                <h2 className="label">Project details</h2>
                <dl className="mt-4">
                  {project.facts.map((f) => (
                    <div key={f.key} className="flex items-baseline justify-between gap-6 border-t-2 border-ink py-3">
                      <dt className="label">{f.key}</dt>
                      <dd className="text-right font-semibold">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-cream py-[var(--spacing-section)]" aria-labelledby="gallery-title">
        <div className="shell">
          <h2 id="gallery-title" className="h2" data-split>
            Gallery
          </h2>
          <ul className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 md:grid-cols-3">
            {project.gallery.map((g, i) => (
              <li key={g.src} data-parallax-scope>
                <div data-parallax={[0.1, -0.06, 0.16][i % 3]}>
                  <figure data-rotate={[-4, 3, -3][i % 3]}>
                    <div className="card overflow-hidden">
                      <SmartImage
                        src={g.src}
                        alt={`${title} — ${g.caption}`}
                        plate={g.plate}
                        tone={TONES[(idx + i) % 4]}
                        parallax={-0.1}
                        className="aspect-[4/5] w-full"
                      />
                    </div>
                    <figcaption className="label mt-4 flex gap-3">
                      <span className="text-orange">{String(i + 1).padStart(2, "0")}</span>
                      {g.caption}
                    </figcaption>
                  </figure>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="on-dark bg-ink py-16 text-cream lg:py-24">
        <div className="shell">
          <p className="label text-orange">Next project</p>
          <Link href={`/projects/${next.slug}`} className="group mt-5 flex flex-wrap items-end justify-between gap-6">
            <span className="display-2 transition-transform duration-700 ease-[var(--ease-out)] group-hover:translate-x-3 group-hover:text-orange">
              {projectTitle(next)}
            </span>
            <span className="label text-cream-70">
              {next.index} <span className="arr inline-block">→</span>
            </span>
          </Link>
          <div className="mt-10">
            <Link href="/projects" className="btn btn-paper">
              All projects
            </Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
