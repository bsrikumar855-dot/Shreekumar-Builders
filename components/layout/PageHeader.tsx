import type { ReactNode } from "react";
import Reveal from "@/components/animations/Reveal";
import RevealText from "@/components/animations/RevealText";
import { SectionMark, TickChain } from "@/components/ui/Drafting";

type Props = {
  index: string;
  label: string;
  /** Each array item becomes one line of the display headline. */
  lines: string[];
  /** A trailing line set in the editorial serif. */
  serifLine?: string;
  lead?: string;
  meta?: { k: string; v: string }[];
  tone?: "light" | "dark";
};

/**
 * PageHeader
 * The shared opening for every interior page: section mark, drawn rule,
 * display headline set line by line, and a short specification column.
 */
export default function PageHeader({
  index,
  label,
  lines,
  serifLine,
  lead,
  meta,
  tone = "light",
}: Props & { children?: ReactNode }) {
  const dark = tone === "dark";

  return (
    <header
      data-surface={tone}
      className={`grain relative pb-14 pt-[124px] lg:pb-20 lg:pt-[176px] ${
        dark ? "text-bone" : "text-ink"
      }`}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
        <div className="shell h-full">
          <div className="relative h-full">
            <div
              className={`absolute inset-y-0 left-0 w-px ${dark ? "bg-bone-08" : "bg-ink-06"}`}
            />
            <div
              className={`absolute inset-y-0 right-0 w-px ${dark ? "bg-bone-08" : "bg-ink-06"}`}
            />
          </div>
        </div>
      </div>

      <div className="shell relative">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
          <SectionMark index={index} label={label} tone={tone} />
          {meta && meta.length > 0 && (
            <dl className="flex flex-wrap gap-x-8 gap-y-2 lg:justify-end">
              {meta.map((m) => (
                <div key={m.k} className="flex items-baseline gap-2.5">
                  <dt className={`meta-sm ${dark ? "text-bone-35" : "text-ink-35"}`}>
                    {m.k}
                  </dt>
                  <dd className={`meta ${dark ? "text-bone-70" : "text-ink-70"}`}>{m.v}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <h1 className="mt-8 lg:mt-12">
          {lines.map((line, i) => (
            <RevealText
              key={line}
              text={line}
              className={`display block ${dark ? "text-bone" : "text-ink"} ${
                lines.length > 1 && i > 0 ? "lg:pl-[8.3%]" : ""
              }`}
              delay={i * 0.06}
            />
          ))}
          {serifLine && (
            <RevealText
              text={serifLine}
              wordClassName={dark ? "text-oxide-tint" : "text-oxide"}
              className={`serif display block font-normal italic ${
                dark ? "text-oxide-tint" : "text-ink"
              } ${lines.length > 0 ? "lg:pl-[16.6%]" : ""}`}
              delay={lines.length * 0.06}
            />
          )}
        </h1>

        {lead && (
          <Reveal y={22} className="mt-9 grid grid-cols-12 gap-x-5 lg:mt-14 lg:gap-x-8">
            <p
              className={`lead col-span-12 max-w-[52ch] lg:col-span-6 ${
                dark ? "text-bone-60" : "text-ink-70"
              }`}
            >
              {lead}
            </p>
          </Reveal>
        )}
      </div>

      <div className="shell relative mt-12 lg:mt-16">
        <TickChain tone={tone} />
      </div>
    </header>
  );
}