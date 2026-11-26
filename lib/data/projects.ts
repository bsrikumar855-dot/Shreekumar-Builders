import type { PlateVariant } from "@/components/ui/Illustration";
import type { Service } from "./services";

/**
 * PROJECTS
 * ---------------------------------------------------------------------------
 * !! REAL-PROJECT-DATA REQUIRED — ALL ENTRIES BELOW ARE PLACEHOLDERS !!
 *
 * No project names, clients, locations or years were supplied for this build,
 * so none have been invented. Every entry is flagged `placeholder: true` and
 * renders as a clearly marked placeholder card. The photographs and gallery
 * captions are real site photos; which job each belongs to still needs
 * confirming.
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
    category: "Electrical · Plumbing · Building · Tiling",
    location: "[Location]",
    year: "[Year]",
    scope: ["electrical", "plumbing", "building", "tile-laying", "finishing"],
    overview: [
      "[Project summary — two to three sentences describing the building, the client's brief, the constraints of the site and what was delivered.]",
      "[A second paragraph on the technical side: how the structure, services and finishes were coordinated, and which details required the most attention.]",
    ],
    image: "project-01.webp",
    plate: "frame",
    gallery: [
      { src: "project-01-01.webp", caption: "Drain sleeve set in blockwork", plate: "frame" },
      { src: "project-01-02.webp", caption: "Supply and drain runs at a wall corner", plate: "circuit" },
      { src: "project-01-03.webp", caption: "Drain pipe laid along the building edge", plate: "tile" },
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
    category: "Electrical · Building · Renovation",
    location: "[Location]",
    year: "[Year]",
    scope: ["electrical", "plumbing", "building", "renovation", "finishing"],
    overview: [
      "[Project summary — the existing structure, the condition it was found in, and the agreed outcome.]",
      "[A second paragraph on what was retained, what was replaced and how the works were sequenced while the building remained in use.]",
    ],
    image: "project-02.webp",
    plate: "section",
    gallery: [
      { src: "project-02-01.webp", caption: "Plaster stripped back to masonry", plate: "section" },
      { src: "project-02-02.webp", caption: "Wall chased for new pipework", plate: "masonry" },
      { src: "project-02-03.webp", caption: "Vertical supply lines on exposed wall", plate: "detail" },
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
      { src: "project-03-01.webp", caption: "Supply and drain pipes below floor level", plate: "circuit" },
      { src: "project-03-02.webp", caption: "Pipe stub-out ready for the fixture", plate: "pipe" },
      { src: "project-03-03.webp", caption: "Drain stub-out in blockwork", plate: "detail" },
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
      { src: "project-04-01.webp", caption: "Floor tiles laid", plate: "tile" },
      { src: "project-04-02.webp", caption: "Tiled wall with services chased", plate: "detail" },
      { src: "project-04-03.webp", caption: "Wall tiles cut back for pipework", plate: "section" },
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