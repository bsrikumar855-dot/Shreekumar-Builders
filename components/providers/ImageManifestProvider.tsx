import fs from "node:fs";
import path from "node:path";
import ImageManifestProviderClient from "./ImageManifestProviderClient";

/**
 * Reads the contents of /public/images once per render on the server, then
 * hands the filenames to the client provider.
 *
 * `SmartImage` uses this to decide, with no client-side filesystem access,
 * whether an image slot holds a real photograph or needs the procedural
 * technical plate. Drop a file named e.g. `electrical-installation.webp` into
 * /public/images and the matching plate is replaced automatically on the next
 * build. Remove the file and the plate returns.
 */
function readImageFilenames(): string[] {
  const dir = path.join(process.cwd(), "public", "images");
  try {
    return fs
      .readdirSync(dir)
      .filter((f) => !f.startsWith(".") && !f.toLowerCase().endsWith(".md"));
  } catch {
    return [];
  }
}

export default function ImageManifestProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ImageManifestProviderClient files={readImageFilenames()}>{children}</ImageManifestProviderClient>;
}