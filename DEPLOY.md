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

The contact form is static HTML enhanced by `website/functions/api/leads.ts`. It only reports success after D1 has saved the lead; email notification is a follow-up task.

1. Create a D1 database and replace `REPLACE_WITH_D1_DATABASE_ID` in `website/wrangler.jsonc`:

   ```sh
   cd website
   npx wrangler d1 create taico-ev-leads
   npx wrangler d1 migrations apply taico-ev-leads --remote
   ```

2. In Pages → Settings → Functions, bind the database as `LEADS_DB` and add these values. Keep secrets out of Git:

   - Secret `TURNSTILE_SECRET_KEY`
   - Secret `EMAIL_API_TOKEN` with Cloudflare Email Sending permission
   - Variable `EMAIL_API_ACCOUNT_ID`
   - Variable `LEAD_NOTIFICATION_TO`
   - Variable `LEAD_NOTIFICATION_FROM` using a verified Email Service sender
   - Build variable `PUBLIC_TURNSTILE_SITE_KEY`
   - `ALLOWED_ORIGINS` for production and the exact preview/local origins being tested

   Cloudflare Email Service must have the sending domain onboarded before the first notification. Missing email configuration is recorded as `notification_status = 'failed'`; the inquiry remains in D1.

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
