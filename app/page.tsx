import Hero from "@/components/sections/Hero";
import Positioning from "@/components/sections/Positioning";
import ServicesGrid from "@/components/sections/ServicesGrid";
import ProjectsPreview from "@/components/sections/ProjectsPreview";
import ProcessStepper from "@/components/sections/ProcessStepper";
import WhyUs from "@/components/sections/WhyUs";
import CtaBand from "@/components/sections/CtaBand";
import { Marquee } from "@/components/ui/Bits";
import { services } from "@/lib/data/services";

const TRADES = services.map((s) => s.title);

/**
 * Home — proof-first, single primary CTA (see research notes in the repo
 * history): hero → trades ticker → position → services → work → process →
 * principles → contact.
 */
export default function HomePage() {
  return (
    <>
      <Hero />

      <div className="relative z-10 -rotate-[1.2deg] border-y-2 border-ink bg-orange py-4" data-skew>
        <Marquee
          items={TRADES}
          className="font-display text-[clamp(1.6rem,3.4vw,3rem)] uppercase leading-none"
          itemClassName="gap-[0.5em] pr-[0.5em]"
        />
      </div>

      <Positioning />
      <ServicesGrid />
      <ProjectsPreview />
      <ProcessStepper />
      <WhyUs />
      <CtaBand />
    </>
  );
}
