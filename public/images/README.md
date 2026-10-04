# Photography

Real site photography goes here. Filenames are defined in the data layer —
drop a file in and it replaces the technical drawing automatically, at build
time, with no code changes.

## How it works

`components/providers/ImageManifestProvider.tsx` reads this directory on the
server at render time. `components/ui/SmartImage.tsx` checks the filename:

- **File present** → the photograph is served through `next/image` (AVIF/WebP,
  responsive `sizes`, lazy-loaded), over the technical plate while it loads.
- **File absent** → the procedural `TechnicalPlate` drawing is shown instead.

Nothing is broken by a missing file, and nothing is fabricated.

## Required filenames

| Slot | Filename | Subject |
| --- | --- | --- |
| Home hero | `hero-construction.webp` | Documentary shot of work in progress. Light-to-mid tone; headline type overlaps its left edge. |
| Building | `building-construction.webp` | Masonry, structural concrete, set-out. |
| Electrical | `electrical-installation.webp` | Conduit routing, distribution board, first fix. |
| Plumbing | `plumbing-work.webp` | Pipe runs, drainage, sanitary fitting. |
| Tiling | `tile-installation.webp` | Set-out, laying, wet areas. |
| Renovation | `renovation-works.webp` | Strip-out, retained structure, making good. |
| Finishing | `finishing-works.webp` | Junctions, fixtures, completed surfaces. |
| About | `about-workshop.webp` | Tools, materials, a worker's hands. |
| Process | `process-01.webp` … `process-07.webp` | One per stage. |
| Projects | `project-01.webp` … `project-04.webp` | Per project. |
| Project galleries | `project-01-01.webp` … | Per gallery frame. |

## Recommendations

- 16:9 or larger, minimum 1600px on the long edge for full-bleed plates.
- AVIF or WebP. Keep each file under ~350 KB.
- No stock imagery of smiling contractors in hi-vis. Documentary beats
  promotional.
- Consistent grade across the set — same white balance, restrained contrast.
- Name files exactly as listed; anything else is ignored.

## Related

- `lib/data/services.ts` — service image filenames
- `lib/data/projects.ts` — project and gallery filenames
- `lib/data/process.ts` — process stage plates
- `lib/data/site.ts` — contact details (the other set of placeholders to fill)