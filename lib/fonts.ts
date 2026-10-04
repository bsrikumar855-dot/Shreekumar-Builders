import { Archivo, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";

/**
 * Archivo — neo-grotesk workhorse. Navigation, headlines, body, UI.
 * Variable weight axis (100–900).
 */
export const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

/**
 * Instrument Serif — restrained editorial contrast, used sparingly
 * for single words inside architectural headlines.
 */
export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});

/**
 * IBM Plex Mono — technical metadata, section marks, dimensions,
 * coordinates, part numbers.
 */
export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const fontVariables = `${archivo.variable} ${instrumentSerif.variable} ${plexMono.variable}`;