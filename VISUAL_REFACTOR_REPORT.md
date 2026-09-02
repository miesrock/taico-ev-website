# TAICO EV Visual Refactor V1

## Objective

Raise the homepage from a pale card collection toward Technical Editorial + Industrial Product Showcase, without rewriting the design system, content, or SEO.

## Files Changed

- `website/src/pages/index.astro`
- `website/src/styles/global.css`
- `website/src/components/EnergyFlow.astro` (new)
- `website/src/components/SceneBanner.astro` (new)
- Baseline on this branch also includes prior hero/surface work in `PageHero.astro`, `Header.astro`, `Footer.astro`, `Layout.astro`, product/solution pages

## Components Changed

- Homepage operating-constraint block (no new component; classes on existing section)
- Homepage chapter index (semantic `<nav class="chapter-nav">`)
- `EnergyFlow` — dark technical rhythm break
- Solution exploration markup — same `solutions` data, editorial grid
- `SceneBanner` — full-bleed parking scene
- Shared CSS in `global.css` for the above

## Design Tokens Changed

Merged aliases onto the existing token system (did not replace it):

- `--surface-page`, `--surface-raised`, `--surface-dark`
- `--line-subtle`, `--line-strong`
- `--text-primary`, `--text-secondary`, `--text-inverse`
- `--accent-cyan`
- `--radius-sm|md|lg`
- `--space-section`, `--space-section-mobile`

Existing `--color-void`, `--color-wave-cyan`, `--color-ink`, fonts, and engineering grid remain canonical.

## Responsive Decisions

- Chapter rail: 6 columns ≥1280px, 3×2 at 1024px, 2-column on mobile (fits current site better than a snap scroller)
- Hero object: 44/56 desktop split; stacked text-then-visual on mobile; min visual height 300px
- Energy flow: vertical node stack below 1024px, horizontal path at desktop
- Solution grid: 01 spans 7 cols and 2 rows; 02/03 span 5; 04–06 span 4; single column on mobile
- Scene banner: ~21:9 desktop, 4:5 mobile with object-position shifted to keep the charger visible

## Image Assets Used

- Operating diagram: `/home/taico-h02-operating-constraint.webp` (baked-in pale field; not CSS-cut out; `data-product-visual` ready for a later transparent asset)
- Scene banner: `/home/taico-tkmc-800-ev-parking-hero.webp` (1280×720). Chosen because it shows a TAICO mobile charger connected to an EV in a parking environment, wide-croppable, no third-party stock

## Technical Assumptions Requiring Review

- Energy-flow diagram is abstract: ENERGY INPUT → TKMC STORAGE → OUTPUT / LOAD
- PV and grid are labeled as inputs, EV and AC load as outputs, without asserting a single electrical topology
- `TODO(engineering)` in `EnergyFlow.astro`: confirm whether PV/grid are interchangeable inputs and whether AC output is always parallel to DC charging
- AC output and PV input are catalog-supported as selected capabilities, not universal on every model

## Performance Notes

- No new UI libraries or WebGL
- Scene and product images keep width/height attributes
- Scene image is `loading="lazy"` (homepage LCP remains the existing hero carousel)
- Energy-line pulse is CSS-only, ≥4s, disabled under `prefers-reduced-motion`
- Hover motion on chapter titles and solution images is similarly gated
- `npm test` (66) and `npm run build` passed after each task
- No dedicated lint/typecheck script in `website/package.json`; `astro check` is not installed

## Remaining Visual Problems

- Challenge chips under the operating heading are still glass tiles (left in place to keep Task 01 scoped)
- TKMC range still uses four equal glass product cards
- Homepage carousel still uses a frosted copy panel (pre-existing; Task 01 did not restyle it)
- Operating-constraint illustration has a baked-in light background, so the new radial grid only reads around the image, not through it
- Scrolled-section screenshots in the agent browser were unreliable; desktop metrics for the hero-object split were 44%/56% with no horizontal overflow

## Recommended V2

- Replace H02 with a transparent WebP/PNG of the same composition
- Flatten or index the four TKMC range cards
- Commission one verified engineering energy-flow drawing if the abstract path is too conservative
- Add `astro check` / lint to CI
- True srcset/responsive sources for the scene banner (current repo has no Astro `<Image />` pipeline)
