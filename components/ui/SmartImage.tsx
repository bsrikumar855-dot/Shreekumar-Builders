import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Illustration, { type PlateVariant, type PlateTone } from "./Illustration";

/**
 * Real photography when a file named `src` exists in /public/images, the
 * brand illustration when it does not. Server-side check — no client JS.
 *
 * `parallax` makes the picture drift inside its frame as the page scrolls
 * (the frame crops it, so the image is scaled up slightly to avoid gaps).
 */
function hasPhoto(name: string): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", "images", name));
  } catch {
    return false;
  }
}

type Props = {
  /** Filename inside /public/images, e.g. "electrical-installation.webp". */
  src: string;
  alt: string;
  plate: PlateVariant;
  tone?: PlateTone;
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** Parallax speed for the picture inside its frame (e.g. -0.12). */
  parallax?: number;
};

export default function SmartImage({
  src,
  alt,
  plate,
  tone = "orange",
  className = "",
  priority = false,
  sizes = "(max-width: 767px) 100vw, 50vw",
  parallax,
}: Props) {
  const photo = hasPhoto(src);
  const moving = parallax !== undefined;

  return (
    <div className={`relative overflow-hidden bg-sand ${className}`} data-parallax-scope>
      <div
        className="absolute inset-0"
        style={moving ? { transform: "scale(1.28)" } : undefined}
      >
        <div
          className="h-full w-full"
          {...(moving ? { "data-parallax": String(parallax) } : {})}
        >
          {photo ? (
            <Image
              src={`/images/${src}`}
              alt={alt}
              fill
              sizes={sizes}
              priority={priority}
              className="object-cover"
            />
          ) : (
            <Illustration variant={plate} tone={tone} title={alt} className="h-full w-full" />
          )}
        </div>
      </div>
    </div>
  );
}
