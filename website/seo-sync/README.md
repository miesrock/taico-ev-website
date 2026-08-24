# TAICO SEO sync Worker

This Worker is the server-side adapter between Google Search Console and the
separate `taico-ev-seo` D1 database. It is intentionally not part of the
Astro static build.

## Configure once

1. The `taico-ev-seo` D1 database ID is shared by both Wrangler configs;
   apply `../seo-migrations` before the first deploy.
2. Add the GSC service account as a Restricted user for
   `sc-domain:taicoev.com`.
3. Set Worker secrets without committing them:

   ```sh
   npx wrangler secret put GSC_CLIENT_EMAIL --config seo-sync/wrangler.jsonc
   npx wrangler secret put GSC_PRIVATE_KEY --config seo-sync/wrangler.jsonc
   npx wrangler secret put SEO_SYNC_TOKEN --config seo-sync/wrangler.jsonc
   ```

4. Connect `seo-sync/wrangler.jsonc` to Workers Builds and deploy from the
   same Git commit as the Pages site. Use `wrangler deploy --dry-run` only for
   local validation.

The cron expression `0 1 * * mon` is Monday 09:00 in China Standard Time.
`POST /run` is for the first sync or recovery; `GET /health` is a non-sensitive
health check. The Worker never requests indexing or publishes content.
