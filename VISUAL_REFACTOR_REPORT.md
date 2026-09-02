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

## V1.1 Responsive QA

Inspected the production preview (`astro preview` of the current `visual-refactor-v1` build) at exact widths 375 / 768 / 1024 / 1440. Layout metrics plus clipped screenshots of hero, chapter nav, hero-object, EnergyFlow, editorial grid, scene banner, and TKMC range. Cookie banner dismissed before section shots.

| Width | Result | Issues found | Fixes |
|-------|--------|--------------|-------|
| 375   | PASS | Frosted hero copy, CTAs, and caption fit; 2-column chapter rail with CH-06 wrapping; stacked hero-object (text then image); vertical EnergyFlow; editorial 01→06; 4:5 scene crop keeps the charger in frame; product cards stack without overflow. Scene heading sits on the unit but contrast holds and the charger remains visible. | None required at this width. |
| 768   | PASS | Intended 2-column chapter rail; chips 2×2; vertical EnergyFlow with 4 capability labels on one row; 2-column product cards; scene heading sits in sky/left, charger fully visible. | None required at this width. |
| 1024  | PASS | After fix: scene banner is 1024px wide (was 1213px from `aspect-ratio` + `min-height`). Chapter rail 3×2; hero-object ~44/56; EnergyFlow horizontal with wrapping node labels; editorial 7+5 / 4+4+4. Hero-object image still bleeds ~125px past the content box; `body { overflow-x: clip }` prevents horizontal scroll. | Constrained `.scene-banner` with `width/max-width: 100%` and `height: auto` so aspect-ratio cannot expand past the viewport. |
| 1440  | PASS | 6-column chapter rail; 44/56 hero-object; horizontal EnergyFlow with single-line labels; Solution 01 dominant; 21:9 scene; 4-up product cards. Caption link was wrapping mid-phrase (`VIEW` / `PRODUCT →`). | `whitespace-nowrap` on `[data-hero-caption-link]` so “View product →” wraps as a unit. |

`prefers-reduced-motion: reduce` disables `.energy-line-pulse` (`animation-name: none`). No JS console errors. Hero carousel cycles all 3 slides via next/previous/dots with `textContent` / `setAttribute` only.

## V1.1 Fix Pass

### Hero DOM Safety

Carousel caption is explicit DOM (`[data-hero-caption-label]`, `[data-hero-caption-link]`). Slide changes set `textContent` and `href` / `title` attributes. Zero `innerHTML` / `insertAdjacentHTML` / `outerHTML` in homepage carousel JS. Verified all 3 slides: Mobile charging → TKMC-1000 → TKMC-2000, including wrap-around and dots. Commit: `77a0750` `fix(ui): avoid innerHTML in hero carousel`.

### GitHub Actions

- File: `.github/workflows/website.yml`
- Trigger before edit: `on: push` and `on: pull_request` (all branches). No change required.
- Working directory: `website/`. Steps: `npm ci`, `npm test`, `npm run build`.
- Run for TASK 1 HEAD `77a0750`: [Website CI #33613463958](https://github.com/miesrock/taico-ev-website/actions/runs/33613463958) — success. `npm test` pass, `npm run build` pass.

### Responsive QA

See table above. Code fixes: scene-banner overflow at 1024; caption nowrap. Commit: `8e36806` `fix(ui): resolve v1 responsive regressions`.

### EnergyFlow Capability Audit

Evidence from `website/src/data/products.ts` (Catalog v1.3) and family copy in `families.ts`:

| Claim | Repo evidence | Scope | Safe as universal? |
|-------|---------------|-------|--------------------|
| Storage | Every published model is an energy-storage charging system with `capacityKwh` | all models | yes |
| DC charging | Every model publishes DC 200–1000 V output, kW, and charging guns | all models | yes |
| PV input | TKMC-10000 catalog app “PV Storage Charger”; TKMC-2000 / 2600 “Solar PV-IN (optional)” | some models | no |
| Grid input | “Grid Complementary System” only on TKMC-2000 / 2600. AC 3-phase is a recharge mode on the range, not a documented live grid-input topology | some / inferred | no as “Grid” on every unit |
| AC output | Explicit on TKMC-2000P, TKMC-4000, TKMC-10000 only | some models | no |
| EV output | DC EV charging on every published model | all models | yes |

Copy now describes a family capability envelope: “Supported input options / Selected: PV / grid”, “Supported output options / DC charging / selected AC”, chips “Selected AC output” / “Selected PV input”, body “AC output or PV-storage capabilities available on selected configurations.” Disclaimer: not a wiring diagram. Commit: `5c0c919` `fix(content): qualify energy flow capability claims`.

Unresolved engineering confirmation: whether any single configuration operates PV and grid as simultaneous interchangeable inputs; whether AC output and DC charging run in parallel on models that publish both.

### Remaining Non-blocking Issues

- First-visit cookie banner overlaps hero caption and arrows until dismissed
- Hero-object illustration still bleeds past the 1024 content box (clipped, no scroll)
- Challenge chips remain legacy glass tiles
- TKMC range remains four equal glass cards
- Operating-constraint image has a baked-in pale field
- Scene heading on 375 overlays the charger body (charger still visible)

## Recommended V2

- Replace H02 with a transparent WebP/PNG of the same composition
- Flatten or index the four TKMC range cards
- Commission one verified engineering energy-flow drawing if the abstract path is too conservative
- Add `astro check` / lint to CI
- True srcset/responsive sources for the scene banner (current repo has no Astro `<Image />` pipeline)
