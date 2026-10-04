import type { PlateVariant } from "@/components/ui/TechnicalPlate";
import type { Service } from "./services";

/**
 * PROJECTS
 * ---------------------------------------------------------------------------
 * !! REAL-PROJECT-DATA REQUIRED — ALL ENTRIES BELOW ARE PLACEHOLDERS !!
 *
 * No project names, clients, locations or years were supplied for this build,
 * so none have been invented. Every entry is flagged `placeholder: true` and
 * renders as a clearly marked, designed placeholder card.
 *
 * To publish real work:
 *   1. Replace each object's fields with verified project data.
 *   2. Drop matching photographs into /public/images using the `image`
 *      filenames — the plates are replaced automatically at runtime.
 *   3. Set `placeholder: false` and the site renders it as a live project.
 *
 * `scope` values must only be the services actually delivered on that project.
 */

export type Project = {
  slug: string;
  index: string;
  placeholder: boolean;
  title: string;
  /** Short subtitle shown under the title. */
  category: string;
  location: string;
  year: string;
  /** Services actually delivered on this project. */
  scope: string[];
  overview: string[];
  /** Photography. Drop files with these names into /public/images. */
  image: string;
  /** Technical drawing shown until the photograph is supplied. */
  plate: PlateVariant;
  gallery: { src: string; caption: string; plate: PlateVariant }[];
  /** Facts panel on the detail page. */
  facts: { key: string; value: string }[];
};

export const projects: Project[] = [
  {
    slug: "project-01",
    index: "01",
    placeholder: true,
    title: "[Project Title]",
    category: "Building · Electrical · Plumbing · Tiling",
    location: "[Location]",
    year: "[Year]",
    scope: ["building", "electrical", "plumbing", "tile-laying", "finishing"],
    overview: [
      "[Project summary — two to three sentences describing the building, the client's brief, the constraints of the site and what was delivered.]",
      "[A second paragraph on the technical side: how the structure, services and finishes were coordinated, and which details required the most attention.]",
    ],
    image: "project-01.webp",
    plate: "frame",
    gallery: [
      { src: "project-01-01.webp", caption: "[Structure / in progress]", plate: "frame" },
      { src: "project-01-02.webp", caption: "[Services rough-in]", plate: "circuit" },
      { src: "project-01-03.webp", caption: "[Finishing stage]", plate: "tile" },
    ],
    facts: [
      { key: "Type", value: "[Project type]" },
      { key: "Plot area", value: "[Area]" },
      { key: "Built-up area", value: "[Area]" },
      { key: "Duration", value: "[Duration]" },
      { key: "Structural system", value: "[System used]" },
    ],
  },
  {
    slug: "project-02",
    index: "02",
    placeholder: true,
    title: "[Project Title]",
    category: "Building · Renovation",
    location: "[Location]",
    year: "[Year]",
    scope: ["building", "renovation", "electrical", "plumbing", "finishing"],
    overview: [
      "[Project summary — the existing structure, the condition it was found in, and the agreed outcome.]",
      "[A second paragraph on what was retained, what was replaced and how the works were sequenced while the building remained in use.]",
    ],
    image: "project-02.webp",
    plate: "section",
    gallery: [
      { src: "project-02-01.webp", caption: "[Before / condition survey]", plate: "section" },
      { src: "project-02-02.webp", caption: "[Strip-out]", plate: "masonry" },
      { src: "project-02-03.webp", caption: "[Completed]", plate: "detail" },
    ],
    facts: [
      { key: "Type", value: "[Project type]" },
      { key: "Plot area", value: "[Area]" },
      { key: "Built-up area", value: "[Area]" },
      { key: "Duration", value: "[Duration]" },
      { key: "Structural system", value: "[System used]" },
    ],
  },
  {
    slug: "project-03",
    index: "03",
    placeholder: true,
    title: "[Project Title]",
    category: "Electrical · Plumbing",
    location: "[Location]",
    year: "[Year]",
    scope: ["electrical", "plumbing"],
    overview: [
      "[Project summary — the services scope, the existing services that had to be retained and the working hours available.]",
      "[A second paragraph on routing, coordination and how the services were tested and handed back.]",
    ],
    image: "project-03.webp",
    plate: "circuit",
    gallery: [
      { src: "project-03-01.webp", caption: "[Containment routing]", plate: "circuit" },
      { src: "project-03-02.webp", caption: "[First fix]", plate: "pipe" },
      { src: "project-03-03.webp", caption: "[Fittings installed]", plate: "detail" },
    ],
    facts: [
      { key: "Type", value: "[Project type]" },
      { key: "Points of use", value: "[Count]" },
      { key: "Duration", value: "[Duration]" },
    ],
  },
  {
    slug: "project-04",
    index: "04",
    placeholder: true,
    title: "[Project Title]",
    category: "Tiling · Finishing",
    location: "[Location]",
    year: "[Year]",
    scope: ["tile-laying", "finishing"],
    overview: [
      "[Project summary — the surfaces, the tile formats and the areas covered.]",
      "[A second paragraph on set-out, falls, wet areas and how the final surfaces were brought to a consistent plane.]",
    ],
    image: "project-04.webp",
    plate: "tile",
    gallery: [
      { src: "project-04-01.webp", caption: "[Set-out]", plate: "tile" },
      { src: "project-04-02.webp", caption: "[Laying]", plate: "detail" },
      { src: "project-04-03.webp", caption: "[Completed surface]", plate: "section" },
    ],
    facts: [
      { key: "Type", value: "[Project type]" },
      { key: "Surface area", value: "[Area]" },
      { key: "Tile format", value: "[Format]" },
      { key: "Duration", value: "[Duration]" },
    ],
  },
];

/** Resolves a service slug to its display title, for scope chips. */
export function scopeLabel(slug: string, all: Service[]): string {
  return all.find((s) => s.slug === slug)?.title ?? slug;
}

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export const projectSlugs = projects.map((p) => p.slug);