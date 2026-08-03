# Routes

Astro file-based routes; all pages use `website/src/layouts/Layout.astro`.

| URL | Entry | Summary |
| --- | --- | --- |
| `/` | `website/src/pages/index.astro` | Solution-led homepage with hero, product formats, applications, and CTA. |
| `/products/` | `website/src/pages/products/index.astro` | Eight TKMC products grouped by deployment format. |
| `/products/:slug/` | `website/src/pages/products/[slug].astro` | Product detail, catalog specs, application image, related solutions/products. |
| `/solutions/:slug/` | `website/src/pages/solutions/[slug].astro` | Catalog-supported solution page with product matches. |
| `/applications/` | `website/src/pages/applications/index.astro` | Application index. |
| `/applications/:slug/` | `website/src/pages/applications/[slug].astro` | Application detail with matching products. |
| `/resources/` | `website/src/pages/resources/index.astro` | Product comparison and documentation-request entry. |
| `/resources/product-comparison/` | `website/src/pages/resources/product-comparison.astro` | Published capacity/output comparison table. |

No separate router configuration is used.

