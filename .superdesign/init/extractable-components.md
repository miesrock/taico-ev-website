# Extractable components

## Header
- Source: `website/src/components/Header.astro`
- Category: layout
- Description: Responsive global navigation with mega-menu, mobile dialog, and theme toggle.
- Extractable props: none; it derives current catalog navigation from local data.
- Hardcoded: TAICO logo, navigation labels, dark/light theme affordance, CTA copy.

## Footer
- Source: `website/src/components/Footer.astro`
- Category: layout
- Description: Six-column global footer with live catalog/application/resource links.
- Extractable props: none; it derives current catalog links from local data.
- Hardcoded: brand mark, footer labels, copyright treatment.

## CtaBand
- Source: `website/src/components/CtaBand.astro`
- Category: basic
- Description: Conversion CTA card reused on key routes.
- Extractable props: title, body, href, label.
- Hardcoded: secondary comparison link, waveform-style glows, button styles.

## WaveField
- Source: `website/src/components/WaveField.astro`
- Category: basic
- Description: Decorative analogue-wave backdrop used in route heroes.
- Extractable props: class, intensity.
- Hardcoded: waveform SVG geometry, accent gradients, grid overlay.

