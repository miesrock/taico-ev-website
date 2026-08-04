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

## Lead capture configuration

The contact form is native HTML enhanced by `website/functions/api/leads.ts`. JavaScript adds inline feedback, while the native form remains the progressive-enhancement/script-failure path and redirects to `/thank-you/` only after D1 has saved the lead. Turnstile still must pass in production; because Turnstile requires JavaScript, no-JavaScript users see the direct-email fallback instead of a bypass.

1. Create the D1 database if it does not already exist, then confirm its ID matches the `LEADS_DB` binding in `website/wrangler.jsonc`:

   ```sh
   cd website
   npx wrangler d1 create taico-ev-leads
   npx wrangler d1 migrations apply taico-ev-leads --remote
   ```

2. Treat `website/wrangler.jsonc` as the source of truth for the D1 binding and all non-secret runtime variables. Tencent Exmail SMTP is configured as follows:

   - `LEAD_NOTIFICATION_TO` = `sales12@taicopower.com`
   - `LEAD_NOTIFICATION_FROM` = `sales12@taicopower.com`
   - `SMTP_HOST` = `smtp.exmail.qq.com`
   - `SMTP_PORT` = `465` (implicit TLS)
   - `SMTP_USER` = `sales12@taicopower.com`

   Confirm `ALLOWED_ORIGINS` contains every production or preview origin being tested.

   In Pages → Settings → Variables and Secrets, add only the encrypted secrets:

   - Secret `TURNSTILE_SECRET_KEY`
   - Secret `SMTP_PASSWORD` using the Tencent Exmail client-specific password, not the web login password

   `PUBLIC_TURNSTILE_SITE_KEY` is an Astro build-time variable, not a Pages Function runtime variable. Supply it in the Git build environment if overriding the checked-in fallback site key.

   Missing SMTP configuration or a rejected SMTP login is recorded as `notification_status = 'failed'`; the inquiry remains in D1.

   For local Function testing, copy `website/.dev.vars.example` to `website/.dev.vars` and fill in the runtime credentials locally. The example intentionally leaves secrets blank.

3. Verify preview with a real Turnstile test key and a test inbox. No production deployment or credential is performed by this repository change.

### Query and recovery

Find leads whose notification still needs attention:

```sql
SELECT id, created_at, company, country, email, notification_status, notification_attempts, notification_error
FROM leads
WHERE notification_status != 'sent'
ORDER BY created_at DESC;
```

The same `submission_key` is idempotent. A failed notification allows one controlled retry; do not delete the row to retry it. Keep D1 as the inquiry source of truth and remove records only through the approved retention/privacy process.

### Rollback

- If the Function fails, roll the Pages deployment back to the last known-good deployment and keep the `leads` table.
- If Email Service fails, leave the form and D1 active; query failed rows and contact them manually.
- If D1 fails, the endpoint returns an error and never redirects to `/thank-you/`.
- Never drop the production database or delete saved leads as part of a code rollback.

## Notes

- Large OEM PDFs under `docs/` are gitignored (keep local only).
- Product/case images under `website/public/` are included in the deploy.
- Do not commit `.env` or API secrets.
