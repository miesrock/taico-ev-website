# TAICO EV design system

## Product and UX

TAICO EV is an English-language B2B site for mobile and stationary energy storage charging systems. The primary visitor needs to identify a catalog-supported solution, compare a small product range, inspect exact specifications, and request a configuration discussion. Keep every performance or application claim tied to the catalog-backed site content; do not add customer logos, metrics, certifications, industries, or use cases not present in the source.

## Visual source of truth

Use the existing dark analogue-waves system only. It pairs an almost-black space background with restrained cyan, blue, and violet energy signals. Sora is the body typeface, Orbitron is reserved for display headings, and JetBrains Mono is reserved for technical labels, model names, catalog references, and data. The layout is spacious, with a six-column desktop container, 16/24 px horizontal gutters, 64/80 px section rhythm, pill CTAs, and 16/24 px card radii.

## Tokens

- Background: `#04060c`, `#070b16`; panels: `#0b1220`, `#101a2e`.
- Text: `#e8eefc`; muted text: `#94a3b8`; faint text: `#64748b`.
- Accents: cyan `#22d3ee`, blue `#3b82f6`, violet `#8b5cf6`, mint `#34d399`, pink `#f472b6`.
- Cards use translucent dark gradients, a 1 px low-contrast border, subtle backdrop blur, and modest cyan edge glow.
- Primary buttons use the existing cyan-to-blue-to-violet gradient; secondary buttons are transparent dark outlined pills.
- Light mode preserves the same information hierarchy with the defined light-theme tokens.

## Motion and accessibility

Use short, understated hover feedback only. Retain the existing reduced-motion behaviour: no smooth scroll, no transitions, and no hover movement when the user requests reduced motion. Preserve visible keyboard focus, readable contrast, semantic headings, and non-decorative image alt text.

## Design constraints

- Do not introduce gradients, colors, fonts, or visual motifs outside this system.
- Avoid generic EV imagery, dashboard widgets, fake statistics, reviews, or invented trust badges.
- Keep the home page solution-led; product detail pages must privilege model, capacity, output, catalog specifications, and precise application fit.
- On mobile, favor one clear conversion action per viewport and avoid dense multi-column information.
