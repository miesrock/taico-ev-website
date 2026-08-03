# TAICO EV factual discovery plan

## Requirements

- Add global `Organization` and `WebSite` JSON-LD using only the verified domain, brand, logo, and sales email already present in the site data.
- Add `website/public/llms.txt` that describes the English v1 site and its catalog-backed product range without adding commercial hypotheses.
- Preserve the existing per-product `Product` and `BreadcrumbList` JSON-LD in `website/src/data/products.ts` and `website/src/pages/products/[slug].astro`.

## Acceptance criteria

1. Every built HTML page includes exactly one global JSON-LD block containing `Organization` and `WebSite`.
2. Product pages still include their existing `Product` and `BreadcrumbList` data, with no duplicated product schema.
3. `/llms.txt` builds as a static file and lists all eight current TKMC models, catalog version 1.3, public routes, and the fact boundary.
4. No schema or `llms.txt` text adds prices, stock, certifications, customers, ICPs, cases, metrics, addresses, social profiles, or staff identities.
5. `npm run test` and `npm run build` pass; built output is checked for the schema block and `dist/llms.txt`.

## Implementation

1. `website/src/data/site.ts` / `website/src/layouts/Layout.astro`: derive one global schema payload from site facts and inject it into the named head slot.
2. `website/public/llms.txt`: create a concise, route-oriented English fact file sourced from the current product, application, and solution data.
3. `website/tests/` and build output: add the smallest regression check necessary, then verify the generated pages and static file.

## Risks and mitigations

- **Overclaiming brand data:** use only values already in `website/src/data/site.ts` and public assets.
- **Schema duplication:** retain product schema injection solely in `[slug].astro`; global data belongs only in `Layout.astro`.
- **AI overreach from `llms.txt`:** explicitly mark the catalog v1.3 boundary and exclude unconfirmed commercial information.

## Verification

```sh
cd website
npm run test
npm run build
rg -n 'Organization|WebSite' dist/index.html
rg -n 'Product|BreadcrumbList' dist/products/tkmc-800/index.html
test -f dist/llms.txt
```
