import Link from "next/link";
import type { ReactNode } from "react";
import { Blob } from "@/components/ui/Bits";

type Props = {
  index: string;
  label: string;
  /** Title lines; the last line is set in orange. */
  lines: string[];
  lead?: string;
  meta?: { k: string; v: string }[];
  crumbs?: { label: string; href?: string }[];
  children?: ReactNode;
};

/** Shared page opener: layered blobs, giant title, breadcrumb, hazard rule. */
export default function PageHeader({ index, label, lines, lead, meta, crumbs, children }: Props) {
  return (
    <header
      data-parallax-scope
      className="relative isolate overflow-hidden bg-cream pb-16 pt-[9.5rem] md:pb-24 md:pt-[11rem]"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div data-parallax="-0.3" className="absolute -right-[14%] -top-[30%] w-[62vw] max-w-[860px]">
          <Blob variant="a" fill="var(--color-orange)" className="w-full" />
        </div>
        <div data-parallax="-0.14" className="absolute -bottom-[66%] right-[24%] hidden w-[34vw] max-w-[520px] lg:block">
          <Blob variant="c" fill="var(--color-rust)" className="w-full" />
        </div>
        <div
          data-parallax="0.35"
          className="font-display outline-text absolute -bottom-[6%] right-[2%] select-none text-[clamp(10rem,30vw,30rem)] leading-none opacity-[0.16]"
        >
          {index}
        </div>
      </div>

      <div className="shell">
        <nav aria-label="Breadcrumb" className="label flex flex-wrap items-center gap-2" data-reveal>
          <Link href="/" className="u-link">
            Home
          </Link>
          {(crumbs ?? [{ label }]).map((c) => (
            <span key={c.label} className="flex items-center gap-2">
              <span aria-hidden>/</span>
              {c.href ? (
                <Link href={c.href} className="u-link">
                  {c.label}
                </Link>
              ) : (
                <span aria-current="page" className="bg-ink px-2 py-1 text-cream">
                  {c.label}
                </span>
              )}
            </span>
          ))}
        </nav>

        <h1 className="display mt-8 max-w-[14ch] md:max-w-none" data-split>
          {lines.map((l, i) => (
            <span key={l} className={`block ${i === lines.length - 1 ? "text-ink" : ""}`}>
              {l}
              {i === lines.length - 1 && <span className="text-orange">.</span>}
            </span>
          ))}
        </h1>

        {(lead || meta) && (
          <div className="mt-10 grid grid-cols-12 items-end gap-x-6 gap-y-8">
            {lead && (
              <p className="lead col-span-12 max-w-[46ch] md:col-span-7" data-reveal data-delay="300">
                {lead}
              </p>
            )}
            {meta && (
              <dl className="col-span-12 flex flex-wrap gap-3 md:col-span-5 md:justify-end" data-reveal data-delay="450">
                {meta.map((m) => (
                  <div key={m.k} className="border-2 border-ink bg-paper px-4 py-3 shadow-[4px_4px_0_var(--color-ink)]">
                    <dt className="label text-ink-70">{m.k}</dt>
                    <dd className="font-display mt-1 text-2xl uppercase leading-none">{m.v}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>

      <div className="hazard absolute inset-x-0 bottom-0 h-3" aria-hidden />
    </header>
  );
}
