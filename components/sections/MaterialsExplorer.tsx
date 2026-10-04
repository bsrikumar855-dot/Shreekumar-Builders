"use client";

import { useState } from "react";
import MaterialSwatch from "@/components/ui/MaterialSwatch";
import Reveal from "@/components/animations/Reveal";
import { SectionMark } from "@/components/ui/Drafting";
import { materials } from "@/lib/data/process";

/**
 * MaterialsExplorer
 * Six surfaces under the finger. Hovering a cell lets it breathe open and
 * brings its working note forward — the tactile idea, restrained.
 */
export default function MaterialsExplorer() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section
      data-surface="light"
      aria-labelledby="materials-title"
      className="grain relative border-t border-ink-12 py-[var(--spacing-section)]"
      onPointerLeave={() => setActive(null)}
    >
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionMark index="07" label="Materials" />
            <h2 id="materials-title" className="heading mt-7 max-w-[15ch] text-ink">
              <span className="block">Every surface</span>
              <span className="serif block font-normal italic">starts as a decision.</span>
            </h2>
          </div>
          <p className="meta max-w-[22ch] text-ink-45">
            How each material behaves on site
          </p>
        </div>

        {/* Desktop: cells that expand */}
        <div
          className="mt-12 hidden gap-px lg:mt-16 lg:flex"
          onPointerEnter={(e) => {
            const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cell]");
            setActive(t?.dataset.cell ?? null);
          }}
        >
          {materials.map((m) => {
            const open = active === m.name;
            return (
              <div
                key={m.name}
                data-cell={m.name}
                className={`relative min-w-0 cursor-default overflow-hidden bg-limestone transition-[flex-grow] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  open ? "flex-[2.6]" : "flex-1"
                }`}
              >
                <div
                  className={`absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    open ? "scale-110" : "scale-100"
                  }`}
                >
                  <MaterialSwatch tone={m.tone} className="h-full w-full" />
                </div>

                <div className="relative flex h-[26rem] flex-col justify-between p-5">
                  <span className="meta-sm text-ink-60">{m.index}</span>

                  <div>
                    <h3 className="text-[clamp(1.3rem,2vw,1.9rem)] leading-none tracking-[-0.035em] text-ink">
                      {m.name}
                    </h3>
                    <p
                      className={`meta mt-2.5 text-ink transition-opacity duration-500 ${
                        open ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {m.note}
                    </p>
                    <p
                      className={`body-copy mt-4 max-w-[34ch] text-ink-70 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        open
                          ? "translate-y-0 opacity-100"
                          : "pointer-events-none translate-y-3 opacity-0"
                      }`}
                    >
                      {m.detail}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile: tiles with the note always present */}
        <ul className="mt-10 grid grid-cols-2 gap-px bg-ink-12 sm:grid-cols-3 lg:hidden">
          {materials.map((m, i) => (
            <li key={m.name}>
              <Reveal y={20} delay={i * 0.04} className="h-full">
                <div className="flex h-full flex-col bg-bone">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <MaterialSwatch tone={m.tone} className="h-full w-full" />
                    <span className="meta-sm absolute left-3 top-3 text-ink-60">{m.index}</span>
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <h3 className="text-[1.15rem] leading-none tracking-[-0.03em] text-ink">
                      {m.name}
                    </h3>
                    <p className="meta-sm text-ink-45">{m.note}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}