import { Anton, Archivo } from "next/font/google";

/** Anton — heavy condensed display type for headlines and wordmarks. */
export const anton = Anton({
  subsets: ["latin"],
  variable: "--font-anton",
  display: "swap",
  weight: "400",
});

/** Archivo — body, labels and UI. Variable weight axis. */
export const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

export const fontVariables = `${anton.variable} ${archivo.variable}`;
