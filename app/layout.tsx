import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { site } from "@/lib/data/site";
import ScrollFX from "@/components/fx/ScrollFX";
import Interactions from "@/components/fx/Interactions";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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
    "electrician",
    "electrical works",
    "wiring",
    "plumbing works",
    "building contractor",
    "tile laying",
    "renovation",
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
  themeColor: "#f4620b",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

/**
 * Runs before first paint. Turns on the scroll-effect styles (html[data-fx]) only
 * when motion is allowed, and switches them off again if the effects script
 * has not come up within 4s — content can never stay hidden.
 */
const bootFx = `(function(){try{var d=document.documentElement;
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
d.setAttribute('data-fx','');
setTimeout(function(){if(!d.hasAttribute('data-fx-ready'))d.removeAttribute('data-fx')},4000);
}catch(e){}})();`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["Electrician", "HomeAndConstructionBusiness"],
  name: site.name,
  alternateName: site.tradeName,
  url: site.url,
  description: site.seo.description,
  ...(site.contact.phone.value ? { telephone: site.contact.phone.value } : {}),
  ...(site.contact.address.value
    ? {
        address: {
          "@type": "PostalAddress",
          streetAddress: "B4/32 Vallalar Apartment, Vallalar Nagar, Ondipudur",
          addressLocality: "Coimbatore",
          addressRegion: "Tamil Nadu",
          addressCountry: "IN",
        },
      }
    : {}),
  knowsAbout: ["Electrical installation", "Wiring and distribution", "Lighting", "Plumbing", "Building works", "Tile laying", "Renovation", "Finishing"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootFx }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\u003c") }}
        />
      </head>
      <body className="antialiased">
        <a
          href="#main"
          className="label sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:border-2 focus:border-ink focus:bg-orange focus:px-4 focus:py-3"
        >
          Skip to content
        </a>

        <ScrollFX />
        <Interactions />
        <Navbar />

        <main id="main">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
