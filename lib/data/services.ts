import type { PlateVariant } from "@/components/ui/TechnicalPlate";

/**
 * SERVICES
 * Copy describes the work we can be held responsible for.
 * No certifications, guarantees or technical claims are asserted
 * beyond standard trade practice.
 */

export type Service = {
  index: string;
  title: string;
  slug: string;
  /** One-line positioning used in the capability index. */
  summary: string;
  /** Body copy for the service detail page. */
  body: string[];
  /** Bullet scope, phrased as activities rather than promises. */
  scope: string[];
  /** Photographs expected for this service — drop files with these names
   *  into /public/images and they replace the technical plate automatically. */
  image: string;
  plate: PlateVariant;
};

export const services: Service[] = [
  {
    index: "01",
    title: "Building",
    slug: "building",
    summary:
      "Structural and general building work — from setting-out and foundations to load-bearing masonry and structural concrete.",
    body: [
      "A building is only as good as what sits under the finish. We start at set-out: grid lines, levels and dimensions agreed before anything is cut, so that every trade downstream inherits a correct datum.",
      "Masonry is laid to line and level with joints filled and faced consistently. Structural concrete is placed with formwork checked for line, cover and support before the pour, then cured and struck on schedule.",
      "Because electrical and plumbing are planned alongside the structure rather than after it, conduits, sleeves and service routes are resolved before walls are closed.",
    ],
    scope: [
      "Setting-out and dimensional control",
      "Foundations and structural work",
      "Load-bearing masonry",
      "Structural RCC — formwork, reinforcement, pouring",
      "Slabs, lintels and structural openings",
      "Wall building and blockwork",
    ],
    image: "building-construction.webp",
    plate: "masonry",
  },
  {
    index: "02",
    title: "Electrical",
    slug: "electrical",
    summary:
      "Wiring, distribution, lighting and fittings — planned on the same drawing as the building itself.",
    body: [
      "Electrical work is planned before walls are built, not chased into them. Conduit runs, DB positions, switch and socket heights and lighting circuits are set out on the same drawing as the structure.",
      "Wiring is dressed and clipped to standard, junctions are accessible, and boards are mounted square and level with labelling that matches the circuit schedule.",
      "Fixtures, switches and lighting are installed to line, with terminations made properly and the installation checked before finishes go on.",
    ],
    scope: [
      "Conduit routing and concealed wiring",
      "Distribution boards and switchgear",
      "Lighting, sockets and switching",
      "Point-of-use connections and fittings",
      "Earthing and protective bonding",
      "Testing before handover",
    ],
    image: "electrical-installation.webp",
    plate: "circuit",
  },
  {
    index: "03",
    title: "Plumbing",
    slug: "plumbing",
    summary:
      "Water lines, drainage and sanitary systems — set to falls that actually discharge.",
    body: [
      "Water lines are run with proper falls, proper support and proper access points. Drainage is set out so that gradients work from the first fix rather than being corrected later.",
      "Sanitary units are installed square, level and sealed. Pipework is pressure-tested or flow-checked as appropriate, and every connection is made accessible for future service.",
      "Hot water routing is planned alongside lighting and electrical so that the ceiling and wall build-ups line up on the first attempt.",
    ],
    scope: [
      "Water supply lines and isolation",
      "Soil, waste and rainwater drainage",
      "Sanitary fixtures and fittings",
      "Overhead and concealed water lines",
      "Floor traps and set falls",
      "Commissioning and leak checks",
    ],
    image: "plumbing-work.webp",
    plate: "pipe",
  },
  {
    index: "04",
    title: "Tile Laying",
    slug: "tile-laying",
    summary:
      "Floor, wall and bathroom tiling — set out from the centreline so joints land where they should.",
    body: [
      "Tiling starts with a set-out. Lines are planned so joints land symmetrically and cut pieces are pushed to the edges of the room where they are least visible.",
      "Surfaces are checked for flatness and falls before adhesive is laid. Wet areas are laid to fall toward the drain, and movement joints are placed where the material needs them.",
      "Grout is finished evenly and edges are trimmed clean. A tiled floor should read as one continuous plane — that is entirely down to the setting-out.",
    ],
    scope: [
      "Floor and wall tiling",
      "Bathroom and wet-area surfaces",
      "Bond patterns and set-out planning",
      "Fall control toward drainage",
      "Movement joints and trims",
      "Grouting, sealing and edge finishing",
    ],
    image: "tile-installation.webp",
    plate: "tile",
  },
  {
    index: "05",
    title: "Renovation",
    slug: "renovation",
    summary:
      "Strip-out, rebuild and reinstatement — working out what can stay before anything is removed.",
    body: [
      "Renovation begins with an honest survey: what is sound, what is not, and what can be retained. Removing sound material costs money and time for no benefit.",
      "Strip-out is done in a controlled order — services first, then finishes, then structure — and the resulting condition is assessed before rebuild starts.",
      "Rebuild brings the opening up to standard and finishes the reinstatement back to a clean, usable state with no loose ends.",
    ],
    scope: [
      "Condition survey and retain / replace decisions",
      "Controlled demolition and strip-out",
      "Structural alteration and rebuilding",
      "Service replacement and rerouting",
      "Making good and reinstatement",
      "Full back-of-house reinstatement",
    ],
    image: "renovation-works.webp",
    plate: "section",
  },
  {
    index: "06",
    title: "Finishing",
    slug: "finishing",
    summary:
      "Final surfaces, fixtures and detail — the last five per cent that decides how the work reads.",
    body: [
      "Finishing is where workmanship is judged. Paint lines, edges, joints between materials and the alignment of fixtures are what separate a completed building from a nearly completed one.",
      "We complete on a snag list, methodically, and leave the site clean. Fixtures are installed square, surfaces are wiped down, and access panels are reachable.",
      "Handover is a documented conversation, not a dropped set of keys.",
    ],
    scope: [
      "Plastering and surface preparation",
      "Painting and decorative finishes",
      "Joinery and fixtures installation",
      "Skirting, trims and edge detailing",
      "Final clean and snag closure",
      "Handover walkthrough",
    ],
    image: "finishing-works.webp",
    plate: "detail",
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}

export const serviceSlugs = services.map((s) => s.slug);