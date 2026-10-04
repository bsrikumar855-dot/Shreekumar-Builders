"use client";

import { useMemo, type ReactNode } from "react";
import { ImageManifestContext } from "./image-manifest-context";

/**
 * Client half of the manifest. Receives a plain filename array from the
 * server so no `node:fs` access ever reaches the browser bundle.
 */
export default function ImageManifestProviderClient({
  files,
  children,
}: {
  files: string[];
  children: ReactNode;
}) {
  const value = useMemo(() => new Set(files), [files]);
  return (
    <ImageManifestContext.Provider value={value}>{children}</ImageManifestContext.Provider>
  );
}