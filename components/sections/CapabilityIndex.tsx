"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import SmartImage from "@/components/ui/SmartImage";
import { SectionMark, TickChain } from "@/components/ui/Drafting";
import { services } from "@/lib/data/services";
import { useGsap } from "@/lib/utils/motion";
import { useFinePointer, usePrefersReducedMotion, useMediaQuery } from "@/lib/utils/hooks";

/**
 * CapabilityIndex — Act 02
 * Desktop: a list of trades. Hovering a row floats the trade's drawing at
 * the cursor and pulls its description into the right-hand column.
 * Mobile: the same list becomes an accordion, because hover does not exist.
 */
export default function CapabilityIndex() {
  const [active, setActive] = useState(0);
  const preview = useRef<HTMLDivElement>(null);
  const gsap = useGsap();
  const fine = useFinePointer();
  const reduced = usePrefersReducedMotion();

  const cursorPreview = fine && !reduced;
  const current = services[active];
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const onPointerMove = (e: React.PointerEvent) => {
    if (!cursorPreview || !preview.current || !gsap) return;
    gsap.to(preview.current, {
      x: e.clientX + 26,
      y: e.clientY - preview.current.offsetHeight / 2,
      duration: 0.75,
      ease: "power3.out",
      overwrite: "auto",
    });
  };

  const showPreview = () => {
    if (!cursorPreview || !preview.current || !gsap) return;
    gsap.to(preview.current, { opacity: 1, scale: 1, duration: 0.6, ease: "expo.out" });
  };

  const hidePreview = () => {
    if (!cursorPreview || !preview.current || !gsap) return;
    gsap.to(preview.current, { opacity: 0, scale: 0.94, duration: 0.4, ease: "power2.out" });
  };

  return (
    <section
      data-surface="light"
      aria-labelledby="capability-title"
      className="grain relative border-t border-ink-12 py-[var(--spacing-section)]"
      onPointerMove={onPointerMove}
    >
      {/* Desktop: contextual image at the cursor */}
      {cursorPreview && (
        <div
          ref={preview}
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-[60] w-[26rem] opacity-0 will-change-transform"
        >
          <div key={current.slug} className="relative aspect-square overflow-hidden">
            <SmartImage
              src={current.image}
              alt={`${current.title} — Shreekumar Builders`}
              plate={current.plate}
              className="h-full w-full"
              sizes="26rem"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-ink/85 px-4 py-3 backdrop-blur-sm">
              <span className="meta text-bone">{current.title}</span>
              <span className="meta-sm text-bone-45">{current.index}</span>
            </div>
          </div>
        </div>
      )}

      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionMark index="03" label="Capability" />
            <h2 id="capability-title" className="heading mt-7 max-w-[16ch] text-ink">
              <span className="block">Six trades.</span>
              <span className="serif block font-normal italic">One scope.</span>
            </h2>
          </div>
          <p className="meta max-w-[24ch] text-ink-45">
            Building · Civil · Electrical · Plumbing · Tiling · Finishing
          </p>
        </div>

        <div className="mt-12 lg:mt-16">
          <TickChain />
        </div>

        {/* ---- Desktop: list + contextual column ---- */}
        <div className="hidden lg:grid lg:grid-cols-12 lg:gap-x-8">
          <ul className="lg:col-span-7">
            {services.map((s, i) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  data-cursor="Open"
                  onMouseEnter={() => {
                    setActive(i);
                    showPreview();
                  }}
                  onMouseLeave={hidePreview}
                  onFocus={() => setActive(i)}
                  className="group block border-b border-ink-12 py-6 first:border-t"
                  aria-current={active === i ? "true" : undefined}
                >
                  <div className="flex items-baseline gap-5 lg:gap-8">
                    <span
                      className={`meta-sm w-6 shrink-0 transition-colors duration-500 ${
                        active === i ? "text-oxide" : "text-ink-25"
                      }`}
                    >
                      {s.index}
                    </span>
                    <span
                      className={`display-2 text-[clamp(2.1rem,4.6vw,4.2rem)] transition-[transform,color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        active === i
                          ? "translate-x-3 text-ink"
                          : "translate-x-0 text-ink-35 group-hover:translate-x-1.5 group-hover:text-ink-60"
                      }`}
                    >
                      {s.title}
                    </span>
                    <span className="meta-sm ml-auto self-center text-ink-25 transition-[transform,opacity] duration-500 group-hover:translate-x-1 group-hover:opacity-100 lg:opacity-0">
                      →
                    </span>
                  </div>

                  {/* Desktop contextual description */}
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      active === i
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="measure body-copy mt-4 max-w-[46ch] pl-11 text-ink-70 lg:pl-14">
                        {s.summary}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {/* Contextual plate, pinned in the grid so the composition holds
              even when the cursor preview is idle. */}
          <div className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-32">
              <div className="relative aspect-square overflow-hidden bg-limestone">
                {services.map(
                  (s, i) =>
                    Math.abs(i - active) <= 1 && (
                      <div
                        key={s.slug}
                        className={`absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          active === i ? "opacity-100" : "opacity-0"
                        }`}
                        aria-hidden={active !== i}
                      >
                        <SmartImage
                          src={s.image}
                          alt={`${s.title} — Shreekumar Builders`}
                          plate={s.plate}
                          className="h-full w-full"
                          sizes="34rem"
                        />
                      </div>
                    ),
                )}
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-4">
                <p className="meta text-ink-70">{current.title}</p>
                <p className="meta-sm text-ink-25">{current.index} / 06</p>
              </div>
            </div>
          </div>
        </div>

        {/* ---- Mobile / tablet: accordion ---- */}
        {!isDesktop && (
          <ul className="border-t border-ink-12 lg:hidden">
            {services.map((s) => (
              <MobileCapability key={s.slug} service={s} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function MobileCapability({
  service,
}: {
  service: (typeof services)[number];
}) {
  const [open, setOpen] = useState(false);
  const panelId = `cap-${service.slug}`;

  return (
    <li className="border-b border-ink-12">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-baseline gap-4 py-5 text-left"
        >
          <span className="meta-sm w-6 shrink-0 text-ink-25">{service.index}</span>
          <span className="display-2 text-[clamp(1.9rem,9vw,3rem)] text-ink">
            {service.title}
          </span>
          <span
            aria-hidden
            className={`meta ml-auto shrink-0 text-ink-45 transition-transform duration-500 ${
              open ? "rotate-45" : ""
            }`}
          >
            +
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        className={`grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-6">
            <div className="aspect-[4/3] w-full overflow-hidden bg-limestone">
              <SmartImage
                src={service.image}
                alt={`${service.title} — Shreekumar Builders`}
                plate={service.plate}
                className="h-full w-full"
                sizes="100vw"
              />
            </div>
            <p className="body-copy mt-5 pl-10 text-ink-70">{service.summary}</p>
            <Link
              href={`/services/${service.slug}`}
              className="link-rule meta mt-5 inline-block pl-10 text-oxide"
            >
              Scope — {service.title}
            </Link>
          </div>
        </div>
      </div>
    </li>
  );
}