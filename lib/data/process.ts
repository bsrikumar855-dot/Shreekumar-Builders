import type { PlateVariant } from "@/components/ui/TechnicalPlate";

/**
 * PROCESS
 * The sequence a project moves through. Generic to the trade —
 * adjust the wording to match how the company actually works.
 */

export type ProcessStage = {
  index: string;
  title: string;
  /** Short verb used in the pinned timeline. */
  kicker: string;
  body: string;
  outputs: string[];
  plate: PlateVariant;
};

export const process: ProcessStage[] = [
  {
    index: "01",
    title: "Consult",
    kicker: "Listen",
    body: "We walk the site, understand what the space has to do, and establish what is actually possible within it. Budget expectations and the intended use are made explicit before anything is drawn.",
    outputs: ["Site walk-through", "Scope discussion", "Feasibility notes"],
    plate: "plan",
  },
  {
    index: "02",
    title: "Plan",
    kicker: "Draw",
    body: "Layouts, levels and service routes are set out on paper and agreed. Structural, electrical and plumbing positions are coordinated on the same drawing so nothing collides later.",
    outputs: ["Layout set-out", "Coordinated services drawing", "Material selection"],
    plate: "plan",
  },
  {
    index: "03",
    title: "Prepare",
    kicker: "Set out",
    body: "Grid lines, levels and reference marks are established on site and checked. Materials are ordered and staged. Access, storage and sequencing are planned so the work can proceed without obstruction.",
    outputs: ["Grid and level set-out", "Material staging", "Sequence programme"],
    plate: "section",
  },
  {
    index: "04",
    title: "Build",
    kicker: "Structure",
    body: "Foundations, structural concrete and masonry are executed to the agreed dimensions. Conduits, sleeves and pipe routes are installed within the structure before it is closed.",
    outputs: ["Foundations & structure", "Masonry to line and level", "First-fix services"],
    plate: "masonry",
  },
  {
    index: "05",
    title: "Install",
    kicker: "Services",
    body: "Electrical distribution, lighting and plumbing are terminated and fitted. Boards, sanitary units and fittings are installed square and level, and each system is checked in isolation.",
    outputs: ["Electrical termination", "Plumbing & sanitary", "Isolated system checks"],
    plate: "circuit",
  },
  {
    index: "06",
    title: "Finish",
    kicker: "Surface",
    body: "Plastering, tiling and painting are carried out to a controlled set-out. Edges, joints and fixture alignment are worked through in the order that keeps the finished surfaces consistent.",
    outputs: ["Plaster & screed", "Tiling & set-out", "Paint & fixtures"],
    plate: "tile",
  },
  {
    index: "07",
    title: "Handover",
    kicker: "Release",
    body: "A snag walkthrough is completed against a written list. Outstanding items are closed, the site is cleared, and the documentation for the systems is handed over.",
    outputs: ["Documented snag closure", "Final clean", "Handover walkthrough"],
    plate: "detail",
  },
];

export type Material = {
  index: string;
  name: string;
  /** How the company works with the material — no supply claims. */
  note: string;
  detail: string;
  tone: "concrete" | "stone" | "ceramic" | "steel" | "timber" | "glass";
};

export const materials: Material[] = [
  {
    index: "01",
    name: "Concrete",
    note: "Cured properly, struck on time.",
    detail:
      "Formwork is checked for line, cover and support before a pour. Curing and striking follow the mix and the weather, because a rushed strike is where cracks begin.",
    tone: "concrete",
  },
  {
    index: "02",
    name: "Stone",
    note: "Laid to bed, not to eye.",
    detail:
      "Stone is set out from a reference line and laid on a level bed. Joints are consistent, and the face is worked so the pattern reads as intentional rather than fitted around.",
    tone: "stone",
  },
  {
    index: "03",
    name: "Ceramic",
    note: "Set out from the centreline.",
    detail:
      "Tile set-out is planned before the first tile is laid. Cuts are pushed to edges, falls are directed to drains, and grout is finished to a single plane.",
    tone: "ceramic",
  },
  {
    index: "04",
    name: "Steel",
    note: "Cut, drilled, protected.",
    detail:
      "Steel sections are measured twice and cut once. Connections are made to the drawings, and surfaces are protected where trades continue to work around them.",
    tone: "steel",
  },
  {
    index: "05",
    name: "Timber",
    note: "Squared, sealed, fixed.",
    detail:
      "Timber is stored off the ground and used within its moisture expectations. It is squared, sealed at cuts and fixed to sound backing.",
    tone: "timber",
  },
  {
    index: "06",
    name: "Glass",
    note: "Measured after, not before.",
    detail:
      "Openings are checked and confirmed before glass is ordered. Glazing is fitted square with even beads and clean, correctly sized seals.",
    tone: "glass",
  },
];