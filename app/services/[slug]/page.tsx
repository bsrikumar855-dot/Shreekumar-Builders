import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import SmartImage from "@/components/ui/SmartImage";
import Reveal from "@/components/animations/Reveal";
import RevealText from "@/components/animations/RevealText";
import { services, getService, serviceSlugs } from "@/lib/data/services";
import { buttonGhost } from "@/components/animations/MagneticButton";

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
        lines={[service.title]}
        lead={service.summary}
        meta={[
          { k: "Trade", v: `${service.index} / 06` },
          { k: "Sheet", v: `SB-${service.index}` },
        ]}
      />

      <div className="grain border-t border-ink-12">
        <div className="shell">
          {/* Drawing */}
          <Reveal y={26} className="pt-14 lg:pt-20">
            <SmartImage
              src={service.image}
              alt={`${service.title} — Shreekumar Builders`}
              plate={service.plate}
              className="aspect-[16/9] w-full"
              caption={`Drawing — ${service.title.toLowerCase()}`}
              reveal
              sizes="100vw"
            />
          </Reveal>

          {/* Body + scope */}
          <div className="grid grid-cols-12 gap-x-5 gap-y-12 py-[var(--spacing-section)] lg:gap-x-8">
            <div className="col-span-12 lg:col-span-6">
              <h2 className="meta text-ink-35">Approach</h2>
              <div className="mt-6 space-y-5">
                {service.body.map((para, i) => (
                  <Reveal y={20} key={i}>
                    <p className="lead max-w-[54ch] text-ink-70">{para}</p>
                  </Reveal>
                ))}
              </div>
            </div>

            <aside className="col-span-12 lg:col-span-4 lg:col-start-9">
              <h2 className="meta text-ink-35">Scope of work</h2>
              <ul className="mt-6 border-t border-ink-12">
                {service.scope.map((item, i) => (
                  <li key={item}>
                    <Reveal y={16} delay={i * 0.03}>
                      <div className="flex items-baseline gap-4 border-b border-ink-12 py-3.5">
                        <span className="meta-sm w-6 shrink-0 text-ink-25">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="body-copy text-ink-70">{item}</span>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ul>

              <Reveal y={18} className="mt-8">
                <p className="meta-sm text-ink-35">
                  Exact deliverables are agreed per project during scoping.
                </p>
              </Reveal>
            </aside>
          </div>
        </div>
      </div>

      {/* Next trade */}
      <section
        data-surface="light"
        className="grain border-t border-ink-12 bg-limestone py-16 lg:py-24"
      >
        <div className="shell">
          <p className="meta text-ink-35">Next trade</p>
          <Link
            href={`/services/${next.slug}`}
            data-cursor="Open"
            className="group mt-5 flex flex-wrap items-end justify-between gap-6"
          >
            <RevealText
              as="span"
              text={next.title}
              className="display-2 text-ink transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3"
            />
            <span className="meta text-ink-45">
              {next.index} / 06 <span className="arrow-shift">→</span>
            </span>
          </Link>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/services" className={buttonGhost}>
              All services
            </Link>
            <Link href="/contact" className={buttonGhost} data-cursor="Talk">
              Start a project <span className="arrow-shift">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}