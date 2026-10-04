"use client";

import Image from "next/image";
import { useContext, useState, useRef, useEffect } from "react";
import { ImageManifestContext } from "@/components/providers/image-manifest-context";
import TechnicalPlate, { type PlateVariant, type PlateTone } from "./TechnicalPlate";
import { usePrefersReducedMotion } from "@/lib/utils/hooks";
import { useGsapContext } from "@/lib/utils/motion";

type Props = {
  /** Filename inside /public/images, e.g. "electrical-installation.webp" */
  src: string;
  alt: string;
  /** Technical drawing shown until / while the photograph loads. */
  plate: PlateVariant;
  tone?: PlateTone;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
  /** Small technical caption, bottom-left. */
  caption?: string;
  /** Animate a clip-path reveal on scroll. */
  reveal?: boolean;
  /** Fill the frame edge to edge, cropping the drawing. Use with `bare`. */
  fit?: "sheet" | "cover";
  /** Hide the drawing's annotations for full-bleed crops. */
  bare?: boolean;
};

/**
 * Renders real photography when a file exists for `src`, and the brand's
 * procedural technical drawing when it does not — plus while it loads, so
 * there is never an empty grey box.
 */
export default function SmartImage({
  src,
  alt,
  plate,
  tone = "light",
  className = "",
  imageClassName = "",
  priority = false,
  sizes = "(max-width: 767px) 100vw, (max-width: 1439px) 60vw, 50vw",
  caption,
  reveal = false,
  fit = "sheet",
  bare = false,
}: Props) {
  const manifest = useContext(ImageManifestContext);
  const hasPhoto = manifest.has(src);
  const [loaded, setLoaded] = useState(false);
  const reduced = usePrefersReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const gsap = useGsapContext();

  useEffect(() => {
    const el = root.current;
    if (!reveal || reduced || !el || !gsap) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { clipPath: "inset(0% 0% 100% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.25,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        },
      );
      const inner = el.querySelector<HTMLElement>("[data-plate-inner]");
      if (inner) {
        gsap.fromTo(
          inner,
          { scale: 1.14 },
          {
            scale: 1,
            duration: 1.6,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );
      }
    }, el);

    return () => ctx.revert();
  }, [gsap, reduced, reveal]);

  return (
    <div
      ref={root}
      className={`relative overflow-hidden bg-limestone ${className}`}
      data-plate={plate}
    >
      {/* Technical plate: the resting state, and the loading state for photography */}
      <div
        data-plate-inner
        aria-hidden={hasPhoto && loaded ? true : undefined}
        className={`absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          hasPhoto && loaded ? "opacity-0" : "opacity-100"
        }`}
      >
        <TechnicalPlate
          variant={plate}
          tone={tone}
          fit={fit}
          bare={bare}
          className="h-full w-full"
        />
      </div>

      {hasPhoto && (
        <Image
          src={`/images/${src}`}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          onLoad={() => setLoaded(true)}
          className={`object-cover transition-opacity duration-700 ${
            loaded ? "opacity-100" : "opacity-0"
          } ${imageClassName}`}
        />
      )}

      {/* Technical caption */}
      {caption && (
        <span className="meta-sm pointer-events-none absolute bottom-3 left-3 z-10 text-ink-45 mix-blend-multiply">
          {caption}
        </span>
      )}

      {/* Development-only marker: makes unreplaced image slots obvious */}
      {!hasPhoto && process.env.NODE_ENV !== "production" && (
        <span className="meta-sm pointer-events-none absolute bottom-3 right-3 z-10 border border-oxide/50 bg-bone/70 px-1.5 py-1 text-oxide-deep backdrop-blur-sm">
          IMG SLOT · {src}
        </span>
      )}
    </div>
  );
}