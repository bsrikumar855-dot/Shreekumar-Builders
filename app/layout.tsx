import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { site } from "@/lib/data/site";
import ImageManifestProvider from "@/components/providers/ImageManifestProvider";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Cursor from "@/components/layout/Cursor";
import ScrollProgress from "@/components/layout/ScrollProgress";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileActionBar from "@/components/layout/MobileActionBar";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.seo.title,
    template: `%s — ${site.name}`,
  },
  description: site.seo.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  keywords: [
    "building contractor",
    "civil works",
    "electrical works",
    "plumbing works",
    "tile laying",
    "renovation",
    "construction",
    "Shreekumar Builders",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: site.seo.title,
    description: site.seo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.title,
    description: site.seo.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { telephone: true, address: false, email: true },
};

export const viewport: Viewport = {
  themeColor: "#efeae2",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" className={fontVariables}>
      <body className="antialiased">
        <noscript>
          <style>{`[data-hero-frame],[data-hero-scroll]{opacity:1 !important}
[data-intro-sheet]{display:none !important}`}</style>
        </noscript>
        <ImageManifestProvider>
          <a
            href="#main"
            className="meta sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:border focus:border-ink focus:bg-bone focus:px-4 focus:py-3"
          >
            Skip to content
          </a>

          <SmoothScroll />
          <ScrollProgress />
          <Cursor />
          <Navbar />

          <main id="main">{children}</main>

          <Footer />
          <MobileActionBar />
        </ImageManifestProvider>
      </body>
    </html>
  );
}