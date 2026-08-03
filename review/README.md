# TAICO EV — GPT Review Bundle

This archive is prepared for an independent review of the catalog-driven product
exploration update on commit `b32f315`.

## Included

- `website/src/` — Astro routes, components, data, layouts, and styles
- `website/tests/` — Node test coverage for product catalog relationships
- `website/public/_redirects` and `website/public/products/` — redirects and the
  catalog-derived WebP product/application imagery
- `website/package.json`, `website/package-lock.json`, `website/astro.config.mjs`,
  and `website/tsconfig.json` — build context
- `docs/handoff.md` — project constraints
- `docs/local-catalogs/TAICO_MC-2026_Catalog （1.3）_.pdf` — product fact source

## Excluded

`node_modules`, generated build output, Git metadata, and unrelated planning files.

## Suggested review prompt

Review this Astro website change as a strict B2B product-site code and content
review. The catalog PDF is the sole public product fact source. Verify that all
eight TKMC products are data-driven across menus, routes, product pages,
solutions, applications, and comparison; check catalog specs and application
claims; assess desktop mega-menu and mobile dialog accessibility; identify broken
links, build/type risks, and stale product/case references. Report findings by
Critical, High, Medium, and Low severity with file paths, line numbers, concrete
minimal fixes, and an APPROVE / REQUEST CHANGES / COMMENT recommendation.
