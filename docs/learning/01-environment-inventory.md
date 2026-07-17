# Environment Inventory

Started: 2026-07-16
Last updated: 2026-07-17

## Safety boundary

- Learning branch: `codex/learning-environment`
- Production branch `main` remains unchanged.
- No remote branch has been created or pushed.
- No Cloudflare, DNS, domain, HTTPS, or production settings were changed.
- Local PDF: `docs/local-catalogs/TAICO_MC-2026_Catalog （1.3）_.pdf`
- Existing `.gitignore` rule `docs/**/*.pdf` keeps PDFs under `docs/` out of Git.

## Repository location

- Working directory: `/Users/zaoyi/Desktop/移动充电桩`
- Git repository root: `/Users/zaoyi/Desktop/移动充电桩`

## Git

- Version: `2.50.1 (Apple Git-155)`
- Executable: `/usr/bin/git`

## Node.js and npm

- Node.js: `v22.22.3`
- Node.js executable: `/Users/zaoyi/.hermes/node/bin/node`
- npm: `10.9.8`
- npm executable: `/Users/zaoyi/.hermes/node/bin/npm`
- The project requires Node.js `>=22.12.0`, so the current version satisfies the requirement.

## Website package manifest

The website project is under `website/`. Its `package.json` declares:

- Module system: ES modules (`"type": "module"`)
- Development server: `npm run dev` -> `astro dev`
- Production build: `npm run build` -> `astro build`
- Local production preview: `npm run preview` -> `astro preview`
- Deployment: `npm run deploy` builds and deploys through Wrangler
- Runtime dependencies: Astro, Tailwind CSS, and the Tailwind Vite integration
- Development dependency: Wrangler

Do not run `npm run deploy` during this learning stage because it can affect the Cloudflare Pages project.

## Installed dependency check

- `website/package-lock.json` and `website/node_modules/` are present.
- The declared top-level packages are installed at the versions recorded by the project.
- `npm list --depth=0` labels several `@emnapi` / `@napi-rs` WASM packages as `extraneous`.
- The lock file shows that these packages belong to the optional `@astrojs/compiler-binding-wasm32-wasi` path.
- This is an optional Astro compiler fallback that is not active on the current macOS platform; no cleanup was performed.
- Do not run `npm prune`, reinstall dependencies, or delete `node_modules` during this inventory stage.

## Project structure

- `website/src/pages/`: file-based Astro routes; `index.astro` is the home page.
- `website/src/layouts/`: shared page shells and metadata structure.
- `website/src/components/`: reusable interface sections.
- `website/src/data/`: structured product, solution, and case data.
- `website/src/styles/`: global styles.
- `website/src/assets/`: source assets processed by Astro.
- `website/public/`: static files copied to the built site without Astro asset processing.
- `website/node_modules/`, `website/.astro/`, and `website/dist/` are generated or local-only paths and are ignored by Git.

## Build and deployment configuration

- `.nvmrc` requests Node.js major version 22.
- `astro.config.mjs` declares `https://taicoev.com` as the production site URL.
- Astro uses trailing slashes and the Tailwind Vite integration.
- No explicit Astro output mode is set, so the default static output applies.
- `tsconfig.json` extends Astro's strict TypeScript configuration.
- `wrangler.jsonc` names the Cloudflare Pages project `taico-ev` and points deployment at `website/dist/`.
- `public/_headers` defines security headers and long-lived caching for hashed Astro assets.
- `public/_redirects` contains comments only; no redirect currently takes effect.
- No static `robots.txt` was found at the top level of `public/`; no change was made.

## Git remote and sensitive-file check

- Remote `origin`: `https://github.com/miesrock/taico-ev-website.git`
- Local `main` tracks `origin/main`.
- `codex/learning-environment` is local-only and has no upstream branch.
- No tracked `.env` or `.env.*` file was found in the current Git index.
- Ignore rules do not retroactively untrack a file that was already committed, which is why the tracked-file check matters.

## Local runtime verification

- `npm run dev` started successfully and served the site at `http://localhost:4321/`.
- The first `npm run build` invocation remained silent after starting `astro build` and was interrupted after an extended wait.
- Astro CLI and project information checks succeeded with Astro `7.0.9`, Node.js `22.22.3`, npm, macOS arm64, static output, and no adapter.
- Source inspection found no build-time network request or asynchronous wait in the dynamic route generators; they map local data arrays.
- A diagnostic build with temporary telemetry disablement and Astro debug logging completed successfully.
- The successful build generated 13 static pages in 13.23 seconds.
- The exact cause of the first hang was not proven. A transient local tool or cache initialization state is possible, but this remains an inference.
- Build output remained in ignored generated paths and was not deployed.

## Safety incident and recovery

- A later Git status check found comment-only edits in `website/src/pages/index.astro` made separately in Cursor.
- After the user confirmed they were not to be retained in this learning stage, only that file was restored from `HEAD` with `git restore`.
- Final verification showed no business-source changes; only `docs/learning/` remains untracked.

## Concepts learned

- `pwd` prints the current working directory.
- `git rev-parse --show-toplevel` asks Git for the repository root.
- `git status --short --branch` shows the active branch and concise working-tree changes.
- `??` means untracked; `D` means a tracked file is missing from its recorded location.
- A Git branch is a movable reference to a commit, not a second physical copy of the project.
- Node.js runs JavaScript tooling; npm manages packages and runs scripts.
- The shell resolves commands to executables using its command search path.
- Git tracks files, not empty directories.
