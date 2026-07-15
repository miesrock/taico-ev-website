# TAICO EV Website Project

English B2B website for **TAICO EV** — mobile EV charging and energy solutions, brand domain `taicoev.com`.

## Decisions (locked)

| Item | Choice |
|------|--------|
| Brand site | Independent: `taicoev.com` (not a product tab under taicopower.com) |
| Stack | Astro + TypeScript + Tailwind CSS |
| Hosting | GitHub + Cloudflare Pages (later) |
| Language v1 | English only |
| Positioning | Solutions first, product models second |

Brand line:

> **Power Electric Mobility Beyond the Grid.**

## Folder map

```text
.
├── docs/           # Strategy, handoff, catalogs, case sources
├── assets/images/  # Source photos (not yet optimized for web)
├── website/        # Astro site source code
├── AGENTS.md       # Rules for AI / human collaborators
└── README.md       # This file
```

## Key docs

- `docs/handoff.md` — full project brief (IA, SEO, stack, page plan)
- `docs/TAICO_Mobile_Charging_Strategy.md` — market strategy
- Product catalogs & cases under `docs/`

## Local website (after scaffold)

```sh
cd website
npm install
npm run dev
```

Open the URL printed in the terminal (usually `http://localhost:4321`).

## Roadmap (current stage)

1. [x] Align project decisions
2. [x] Organize folders + copy handoff
3. [x] Scaffold Astro + Tailwind
4. [x] Layout shell + Home placeholder
5. [x] Visual system (Analogue Waves / dark tech) + 3 Solutions pages
6. [x] Product pages (G2V / M75 / H200) + TAICO-branded heroes
7. [x] Case study pages + photorealistic scene visuals
8. [ ] Real contact form
9. [ ] GitHub + Cloudflare Pages + DNS
