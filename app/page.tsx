import type { Metadata } from "next";
import HomeIntro from "@/components/sections/HomeIntro";
import Introduction from "@/components/sections/Introduction";
import CapabilityIndex from "@/components/sections/CapabilityIndex";
import ProjectsShowcase from "@/components/sections/ProjectsShowcase";
import ProcessTimeline from "@/components/sections/ProcessTimeline";
import ServicesList from "@/components/sections/ServicesList";
import MaterialsExplorer from "@/components/sections/MaterialsExplorer";
import AboutSection from "@/components/sections/AboutSection";
import WhyShreekumar from "@/components/sections/WhyShreekumar";
import ProjectCta from "@/components/sections/ProjectCta";
import ContactSection from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <HomeIntro />
      <Introduction />
      <CapabilityIndex />
      <ProjectsShowcase />
      <ProcessTimeline />
      <ServicesList />
      <MaterialsExplorer />
      <AboutSection />
      <WhyShreekumar />
      <ProjectCta />
      <ContactSection />
    </>
  );
}