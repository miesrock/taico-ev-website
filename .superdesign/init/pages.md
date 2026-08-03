# Page dependency trees

## /
Entry: `website/src/pages/index.astro`
Dependencies:
- `website/src/layouts/Layout.astro`
  - `website/src/styles/global.css`
  - `website/src/components/Header.astro`
  - `website/src/components/Footer.astro`
- `website/src/components/WaveField.astro`
- `website/src/components/CtaBand.astro`
- `website/src/data/applications.ts`
- `website/src/data/products.ts`
- `website/src/data/solutions.ts`

## /products/
Entry: `website/src/pages/products/index.astro`
Dependencies:
- `website/src/layouts/Layout.astro`
- `website/src/components/WaveField.astro`
- `website/src/components/CtaBand.astro`
- `website/src/data/products.ts`

## /products/:slug/
Entry: `website/src/pages/products/[slug].astro`
Dependencies:
- `website/src/layouts/Layout.astro`
- `website/src/components/WaveField.astro`
- `website/src/components/CtaBand.astro`
- `website/src/data/products.ts`
- `website/src/data/solutions.ts`

## /solutions/:slug/
Entry: `website/src/pages/solutions/[slug].astro`
Dependencies:
- `website/src/layouts/Layout.astro`
- `website/src/components/WaveField.astro`
- `website/src/components/CtaBand.astro`
- `website/src/data/products.ts`
- `website/src/data/solutions.ts`

## /applications/
Entry: `website/src/pages/applications/index.astro`
Dependencies:
- `website/src/layouts/Layout.astro`
- `website/src/components/WaveField.astro`
- `website/src/data/applications.ts`

## /applications/:slug/
Entry: `website/src/pages/applications/[slug].astro`
Dependencies:
- `website/src/layouts/Layout.astro`
- `website/src/components/WaveField.astro`
- `website/src/components/CtaBand.astro`
- `website/src/data/applications.ts`
- `website/src/data/products.ts`
- `website/src/data/solutions.ts`

## /resources/
Entry: `website/src/pages/resources/index.astro`
Dependencies:
- `website/src/layouts/Layout.astro`
- `website/src/components/WaveField.astro`
- `website/src/components/CtaBand.astro`
- `website/src/data/navigation.ts`
- `website/src/data/site.ts`

## /resources/product-comparison/
Entry: `website/src/pages/resources/product-comparison.astro`
Dependencies:
- `website/src/layouts/Layout.astro`
- `website/src/components/CtaBand.astro`
- `website/src/data/products.ts`

