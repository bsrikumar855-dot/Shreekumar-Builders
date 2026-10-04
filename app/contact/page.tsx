import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import ContactSection from "@/components/sections/ContactSection";
import Reveal from "@/components/animations/Reveal";
import { services } from "@/lib/data/services";
import { site } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project with Shreekumar Builders — building and civil works, electrical, plumbing and tiling.",
  alternates: { canonical: "/contact" },
};

const brief = [
  ["What to send", "The location, what the space has to do, and any drawings or plans you already have."],
  ["What you get back", "An honest read on what is possible, what it needs and the order it should be built in."],
  ["Residential & commercial", "Building, civil, electrical, plumbing and tiling work — planned as one scope."],
] as const;

export default function ContactPage() {
  return (
    <>
      <PageHeader
        index="05"
        label="Contact"
        lines={["Let's start", "with the site."]}
        serifLine="Then the rest follows."
        lead={`${site.name} carries out building and civil works, electrical, plumbing and tile laying for residential and commercial projects.`}
        meta={[{ k: "Trades", v: "06" }]}
      />

      <div className="grain border-t border-ink-12 pb-[var(--spacing-section)] pt-14 lg:pt-20">
        <div className="shell">
          <div className="grid grid-cols-12 gap-x-5 gap-y-12 lg:gap-x-8">
            <div className="col-span-12 lg:col-span-7">
              <h2 className="meta text-ink-35">How a project begins</h2>
              <dl className="mt-6 border-t border-ink-12">
                {brief.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-12 gap-x-5 gap-y-2 border-b border-ink-12 py-5 lg:gap-x-8">
                    <dt className="meta col-span-12 text-ink lg:col-span-3">{k}</dt>
                    <dd className="body-copy col-span-12 text-ink-70 lg:col-span-9">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="col-span-12 lg:col-span-4 lg:col-start-9">
              <h2 className="meta text-ink-35">Trades</h2>
              <ul className="mt-6 border-t border-ink-12">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Reveal y={14}>
                      <div className="flex items-baseline gap-4 border-b border-ink-12 py-3">
                        <span className="meta-sm w-6 shrink-0 text-ink-25">{s.index}</span>
                        <span className="body-copy text-ink-70">{s.title}</span>
                      </div>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <ContactSection />
    </>
  );
}