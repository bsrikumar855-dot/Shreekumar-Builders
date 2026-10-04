"use client";

import { createContext } from "react";

/**
 * Set of filenames found in /public/images at build time.
 * Client components use this to decide whether an image slot holds a real
 * photograph or needs the procedural technical plate.
 */
export type ImageManifest = ReadonlySet<string>;

export const ImageManifestContext = createContext<ImageManifest>(new Set<string>());