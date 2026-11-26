import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import SmartImage from "@/components/ui/SmartImage";
import CtaBand from "@/components/sections/CtaBand";
import { Cta } from "@/components/ui/Bits";
import { services, getService, serviceSlugs } from "@/lib/data/services";

export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: `${service.title} works`,
    description: service.summary,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const current = services.findIndex((s) => s.slug === slug);
  const next = services[(current + 1) % services.length];

  return (
    <>
      <PageHeader
        index={service.index}
        label={service.title}
        crumbs={[{ label: "Services", href: "/services" }, { label: service.title }]}
        lines={[service.title]}
        lead={service.summary}
        meta={[{ k: "Trade", v: `${service.index} / 06` }]}
      />

      <section className="bg-sand py-[var(--spacing-section)]">
        <div className="shell">
          <div data-parallax-scope data-reveal="scale">
            <div className="card overflow-hidden">
              <SmartImage
                src={service.image}
                alt={`${service.title} — Shreekumar Builders`}
                plate={service.plate}
                parallax={-0.14}
                priority
                sizes="100vw"
                className="aspect-[16/9] w-full"
              />
            </div>
          </div>

          <div className="mt-20 grid grid-cols-12 gap-x-8 gap-y-14 lg:mt-28">
            <div className="col-span-12 lg:col-span-7">
              <h2 className="label">Approach</h2>
              <div className="mt-8 space-y-6">
                {service.body.map((para, i) => (
                  <p
                    key={i}
                    data-reveal
                    className={i === 0 ? "lead" : "text-[1.05rem] leading-[1.75] text-ink-70"}
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>

            <aside className="col-span-12 lg:col-span-5">
              <div className="card bg-paper p-6 lg:sticky lg:top-28 lg:p-8" data-reveal="right">
                <h2 className="label">Scope of work</h2>
                <ul className="mt-5">
                  {service.scope.map((item, i) => (
                    <li key={item} className="flex items-baseline gap-4 border-t-2 border-ink py-3.5">
                      <span className="font-display w-7 shrink-0 text-xl leading-none text-rust">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="label mt-6 text-ink-70">
                  Exact deliverables are agreed per project during scoping.
                </p>
                <div className="mt-6">
                  <Cta href="/contact">Start a project</Cta>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Next trade */}
      <section className="on-dark bg-ink py-16 text-cream lg:py-24">
        <div className="shell">
          <p className="label text-orange">Next trade</p>
          <Link
            href={`/services/${next.slug}`}
            className="group mt-5 flex flex-wrap items-end justify-between gap-6"
          >
            <span className="display-2 transition-transform duration-700 ease-[var(--ease-out)] group-hover:translate-x-3 group-hover:text-orange">
              {next.title}
            </span>
            <span className="label text-cream-70">
              {next.index} / 06 <span className="arr inline-block">→</span>
            </span>
          </Link>
          <div className="mt-10">
            <Link href="/services" className="btn btn-paper">
              All services
            </Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
