# Shreekumar Builders

Marketing site for Shreekumar Builders: electrical-led, with plumbing, building,
tiling, renovation and finishing. Next.js 15 (App Router) · Tailwind CSS v4 · GSAP + Lenis.

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck && npm run lint && npm run build
```

## Fill in the real content

Nothing is invented. Placeholders are marked in the UI and live here:

| What | File |
| --- | --- |
| Phone / WhatsApp / email / address (also enables the enquiry form) | `lib/data/site.ts` |
| Projects (titles, locations, years, facts) | `lib/data/projects.ts` |
| Services and process copy | `lib/data/services.ts`, `lib/data/process.ts` |
| Photography (replaces illustrations automatically) | `public/images/` (see its README) |

## Structure

- `app/` routes: `/`, `/services[/slug]`, `/projects[/slug]`, `/process`, `/about`, `/contact`
- `components/sections/` page sections · `components/layout/` navbar, footer, page header
- `components/ui/` illustrations, `SmartImage`, small primitives
- `components/fx/` motion: `ScrollFX` (parallax/reveals) and `Interactions` (cursor, tilt, magnetic buttons)

## Motion system

Pages stay server-rendered and opt in with data attributes (all handled in
`components/fx/ScrollFX.tsx`):

`data-parallax` · `data-parallax-x` · `data-spin` · `data-rotate` · `data-scale` ·
`data-mouse` · `data-skew` · `data-progress` · `data-reveal` · `data-split` · `data-delay`

Interactions: `data-tilt` (3D card tilt), `data-cursor="Label"` (cursor label),
`.btn` (magnetic). The hero bulb is draggable and switches on and off; the badge spins on hover.

Only transforms are animated. Effects switch on via `html.fx` (set by an inline
script when motion is allowed) and are never applied under
`prefers-reduced-motion`; if the script fails the page is fully visible.
