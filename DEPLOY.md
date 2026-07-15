# Deploy TAICO EV to Cloudflare Pages

## Architecture

```text
Local edit → git push → GitHub → Cloudflare Pages build → taicoev.com
```

| Setting | Value |
|---------|--------|
| Repo root | monorepo root (this folder) |
| Cloudflare **Root directory** | `website` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | `22` (see `website/.nvmrc`) |
| Framework preset | Astro (or None) |

## 1. GitHub (already scripted)

```sh
cd "/Users/zaoyi/Desktop/移动充电桩"
git status
```

Remote should point at the GitHub repo created for this project.

## 2. Cloudflare Pages (dashboard — first time)

1. Open [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Authorize GitHub and select this repository.
3. Configure build:

   - **Production branch**: `main`
   - **Root directory**: `website`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Environment variable**: `NODE_VERSION` = `22`

4. Save and deploy. You will get a URL like `https://taico-ev.pages.dev`.

## 3. Custom domain `taicoev.com`

1. In the Pages project → **Custom domains** → add `taicoev.com` and `www.taicoev.com`.
2. If the domain is **already on Cloudflare DNS**:
   - Accept the suggested CNAME/records Cloudflare creates.
3. If the domain is **not** on Cloudflare yet:
   - Add the domain to Cloudflare (change nameservers at the registrar), **or**
   - Add the CNAME Cloudflare shows at your current DNS host.

Recommended DNS (when domain is on Cloudflare):

```text
taicoev.com   → CNAME  [your-project].pages.dev   (proxied)
www           → CNAME  [your-project].pages.dev   (proxied)
```

Enable **Always Use HTTPS**.

## 4. Everyday updates

```sh
cd "/Users/zaoyi/Desktop/移动充电桩/website"
# edit content...
cd ..
git add -A
git commit -m "update: describe change"
git push
```

Cloudflare rebuilds automatically on push to `main`.

## Notes

- Large OEM PDFs under `docs/` are gitignored (keep local only).
- Product/case images under `website/public/` are included in the deploy.
- Do not commit `.env` or API secrets.
