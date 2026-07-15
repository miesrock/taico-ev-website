# Repository Guidelines

## What this repo is

TAICO EV independent website project (`taicoev.com`).  
OEM tech from Xiaofu (小夫); go-to-market brand is TAICO EV for overseas B2B.

## Structure

| Path | Purpose |
|------|---------|
| `docs/` | Strategy, handoff, catalogs, case study sources (PDF + MD) |
| `assets/images/` | Source images; optimize before shipping to the site |
| `website/` | Astro + TypeScript + Tailwind site |
| `README.md` | Human project overview |

Authoritative build brief: `docs/handoff.md`.

## Stack (v1)

- Astro + TypeScript + Tailwind CSS
- Content: Markdown / MDX via Astro Content Collections (when content is added)
- Deploy target: GitHub → Cloudflare Pages
- Language: English only for v1

## Working rules

1. **Solutions before products** in navigation and homepage.
2. Do not invent unverified case metrics, ROI numbers, or certifications.
3. Prefer descriptive English filenames for new web assets.
4. Keep Chinese source catalogs in `docs/`; public site copy is English.
5. Do not hand-edit PDFs when an editable Markdown source exists.

## Website commands

```sh
cd website
npm install
npm run dev      # local preview
npm run build    # production build
npm run preview  # preview build output
```

## Content review

- Match product model names and units to source docs.
- Flag TODO/TBD claims; never publish unconfirmed performance data.
- No confidential customer details or private contacts in the repo.

## Commits

Use concise imperative subjects, e.g. `feat: add dealership solution page`.  
Keep commits focused (content vs layout vs config).
