import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import ProcessStepper from "@/components/sections/ProcessStepper";
import WhyUs from "@/components/sections/WhyUs";
import CtaBand from "@/components/sections/CtaBand";
import { process } from "@/lib/data/process";

export const metadata: Metadata = {
  title: "Process",
  description:
    "How a Shreekumar Builders project runs — consult, plan, prepare, build, install, finish and hand over.",
  alternates: { canonical: "/process" },
};

export default function ProcessPage() {
  return (
    <>
      <PageHeader
        index="05"
        label="Process"
        lines={["Set out first.", "Built to dimension"]}
        lead="Seven stages, one team. Each stage ends with something checked — before the next one covers it."
        meta={[{ k: "Stages", v: String(process.length).padStart(2, "0") }]}
      />
      <ProcessStepper heading={false} />
      <WhyUs id="process-why" />
      <CtaBand />
    </>
  );
}
