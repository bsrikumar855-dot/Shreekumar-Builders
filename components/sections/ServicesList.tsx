"use client";

import { useState } from "react";
import Link from "next/link";
import SmartImage from "@/components/ui/SmartImage";
import Reveal from "@/components/animations/Reveal";
import { SectionMark } from "@/components/ui/Drafting";
import { services } from "@/lib/data/services";

/**
 * Services
 * A works schedule, not a card grid. Each row is a line on a drawing: the
 * trade, what it covers, and the scope list, which opens on hover on desktop
 * and is simply present on small screens where hover does not exist.
 */
export default function ServicesList() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section
      data-surface="light"
      aria-labelledby="services-title"
      className="grain relative border-t border-ink-12 bg-limestone py-[var(--spacing-section)]"
      onPointerLeave={() => setHovered(null)}
    >
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionMark index="06" label="Scope of works" />
            <h2 id="services-title" className="heading mt-7 max-w-[16ch] text-ink">
              <span className="block">Six trades,</span>
              <span className="serif block font-normal italic">one responsibility.</span>
            </h2>
          </div>
          <p className="meta max-w-[24ch] text-ink-45">
            Building · Civil · Electrical · Plumbing · Tiling · Finishing
          </p>
        </div>

        {/* Column heads — desktop only */}
        <div className="mt-12 hidden grid-cols-12 gap-x-8 border-b border-ink-12 pb-3 lg:mt-16 lg:grid">
          <span className="meta col-span-1 text-ink-35">No.</span>
          <span className="meta col-span-4 text-ink-35">Trade</span>
          <span className="meta col-span-5 text-ink-35">Coverage</span>
          <span className="meta col-span-2 text-right text-ink-35">Sheet</span>
        </div>

        <ul className="border-b border-ink-12">
          {services.map((s) => {
            const open = hovered === s.slug;
            return (
              <li
                key={s.slug}
                className="group relative border-t border-ink-12"
                onPointerEnter={() => setHovered(s.slug)}
              >
                <Link
                  href={`/services/${s.slug}`}
                  data-cursor="Open"
                  className="relative block py-7 lg:py-9"
                  aria-describedby={`scope-${s.slug}`}
                >
                  {/* Row */}
                  <div className="grid grid-cols-12 items-baseline gap-x-5 gap-y-3 lg:gap-x-8">
                    <span className="meta col-span-2 text-ink-35 lg:col-span-1">
                      {s.index}
                    </span>

                    <span className="col-span-10 lg:col-span-4">
                      <span className="block text-[clamp(1.55rem,3.4vw,3.1rem)] leading-[0.98] tracking-[-0.038em] text-ink transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
                        {s.title}
                      </span>
                    </span>

                    <span className="col-span-12 lg:col-span-5">
                      <span className="body-copy block max-w-[52ch] text-ink-70">
                        {s.summary}
                      </span>
                    </span>

                    <span className="meta col-span-2 text-right text-ink-35 lg:col-span-2">
                      {s.index} — 06
                    </span>
                  </div>

                  {/* Scope: always open on small screens, opens on hover on desktop */}
                  <div
                    id={`scope-${s.slug}`}
                    className={`grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:duration-500 ${
                      open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[1fr] opacity-100 lg:grid-rows-[0fr] lg:opacity-0"
                    } lg:group-hover:grid-rows-[1fr] lg:group-hover:opacity-100`}
                  >
                    <div className="overflow-hidden">
                      <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-2 pl-0 sm:grid-cols-2 lg:mt-7 lg:grid-cols-2 lg:pl-[calc(8.333%+1.25rem)]">
                        {s.scope.map((item) => (
                          <li key={item} className="meta text-ink-60 lg:text-[0.66rem]">
                            <span className="mr-2 text-oxide">—</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Link>

                {/* Hover preview, rendered only for the active row */}
                {open && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute right-0 top-0 hidden h-full w-[19rem] overflow-hidden lg:block"
                  >
                    <SmartImage
                      src={s.image}
                      alt={`${s.title} — Shreekumar Builders`}
                      plate={s.plate}
                      className="h-full w-full"
                      sizes="19rem"
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <Reveal y={18} className="mt-10">
          <p className="meta text-ink-45">
            Scope shown is indicative. Exact deliverables are agreed per project.
          </p>
        </Reveal>
      </div>
    </section>
  );
}