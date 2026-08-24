import { importPKCS8, SignJWT } from "jose";
import {
  CONTROL_ROOM_PAGES,
  dateWindow,
  latestCompleteDate,
  mapGscMetricRows,
  metricSummary,
  SEARCH_CONSOLE_PROPERTY,
  shiftDate,
  SITE_ORIGIN,
  SITEMAP_URL,
  SNAPSHOT_RETENTION,
  type GscDateRow,
  type GscMetricRow,
  type IndexStatus,
  type SeoDatabase,
  type SeoStatement,
  type SitemapStatus,
} from "../../src/lib/seo-control-room.ts";

type WorkerEnv = {
  SEO_DB?: SeoDatabase & { batch?(statements: SeoStatement[]): Promise<unknown[]> };
  GSC_CLIENT_EMAIL?: string;
  GSC_PRIVATE_KEY?: string;
  SEO_SYNC_TOKEN?: string;
  GSC_PROPERTY?: string;
  SITE_ORIGIN?: string;
  SITEMAP_URL?: string;
};

type WorkerContext = { waitUntil(promise: Promise<unknown>): void };
type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

const defaultFetcher: Fetcher = (input, init) => globalThis.fetch(input, init);

const GOOGLE_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const SEARCH_ANALYTICS_URL = "https://www.googleapis.com/webmasters/v3/sites";
const INSPECTION_URL = "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect";
const SITEMAPS_URL = "https://www.googleapis.com/webmasters/v3/sites";
const PAGE_BATCH_SIZE = 100;

let googleTokenCache: { token: string; expiresAt: number } | null = null;
let activeRun = false;

function envValue(value: string | undefined, fallback = "") {
  return value?.trim() || fallback;
}

function normalizedPrivateKey(value: string) {
  return value.replace(/\\n/g, "\n").trim();
}

function safeError(error: unknown) {
  if (error instanceof Error) return error.name || "UPSTREAM_ERROR";
  return "UPSTREAM_ERROR";
}

async function googleAccessToken(env: WorkerEnv, fetcher: Fetcher, now = Date.now()) {
  const clientEmail = envValue(env.GSC_CLIENT_EMAIL);
  const privateKey = envValue(env.GSC_PRIVATE_KEY);
  if (!clientEmail || !privateKey) throw new Error("GSC_NOT_CONFIGURED");
  if (googleTokenCache && googleTokenCache.expiresAt > now + 60_000) return googleTokenCache.token;

  const issuedAt = Math.floor(now / 1000);
  const key = await importPKCS8(normalizedPrivateKey(privateKey), "RS256");
  const assertion = await new SignJWT({ scope: GOOGLE_SCOPE })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(clientEmail)
    .setAudience(GOOGLE_TOKEN_URL)
    .setIssuedAt(issuedAt)
    .setExpirationTime(issuedAt + 3600)
    .sign(key);

  const response = await fetcher(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
  });
  if (!response.ok) throw new Error("GSC_AUTH_FAILED");
  const payload = await response.json() as { access_token?: string; expires_in?: number };
  if (!payload.access_token) throw new Error("GSC_AUTH_FAILED");
  googleTokenCache = { token: payload.access_token, expiresAt: now + Math.max(60, Number(payload.expires_in) || 3600) * 1000 };
  return payload.access_token;
}

async function gscFetch<T>(
  env: WorkerEnv,
  fetcher: Fetcher,
  url: string,
  init: RequestInit = {},
  now = Date.now(),
): Promise<T> {
  const token = await googleAccessToken(env, fetcher, now);
  const headers = new Headers(init.headers);
  headers.set("authorization", `Bearer ${token}`);
  headers.set("accept", "application/json");
  const response = await fetcher(url, { ...init, headers });
  if (!response.ok) throw new Error(`GSC_HTTP_${response.status}`);
  return await response.json() as T;
}

function property(env: WorkerEnv) {
  return envValue(env.GSC_PROPERTY, SEARCH_CONSOLE_PROPERTY);
}

function encoded(value: string) {
  return encodeURIComponent(value);
}

async function searchAnalytics(
  env: WorkerEnv,
  fetcher: Fetcher,
  window: { startDate: string; endDate: string },
  dimensions: string[],
  startRow = 0,
  rowLimit = 25_000,
  now = Date.now(),
) {
  const url = `${SEARCH_ANALYTICS_URL}/${encoded(property(env))}/searchAnalytics/query`;
  return gscFetch<{ rows?: GscMetricRow[] }>(env, fetcher, url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...window, dimensions, dataState: "final", startRow, rowLimit }),
  }, now);
}

async function allQueryPageMetrics(
  env: WorkerEnv,
  fetcher: Fetcher,
  window: { startDate: string; endDate: string },
  now = Date.now(),
) {
  const rows: GscMetricRow[] = [];
  let startRow = 0;
  while (true) {
    const page = await searchAnalytics(env, fetcher, window, ["query", "page"], startRow, 25_000, now);
    const pageRows = page.rows || [];
    rows.push(...pageRows);
    if (pageRows.length < 25_000) break;
    startRow += pageRows.length;
  }
  return rows;
}

async function latestDataDate(env: WorkerEnv, fetcher: Fetcher, now = Date.now()) {
  const today = new Date(now);
  const window = { startDate: shiftDate(today.toISOString().slice(0, 10), -10), endDate: shiftDate(today.toISOString().slice(0, 10), -1) };
  const response = await searchAnalytics(env, fetcher, window, ["date"], 0, 1000, now);
  return latestCompleteDate(response.rows as GscDateRow[] || [], today);
}

async function inspectUrl(env: WorkerEnv, fetcher: Fetcher, path: string, now = Date.now()): Promise<IndexStatus> {
  const origin = envValue(env.SITE_ORIGIN, SITE_ORIGIN).replace(/\/$/, "");
  const url = `${origin}${path === "/" ? "/" : path}`;
  const response = await gscFetch<{
    inspectionResult?: {
      indexStatusResult?: {
        verdict?: string;
        coverageState?: string;
        indexingState?: string;
        googleCanonical?: string;
        userCanonical?: string;
        lastCrawlTime?: string;
      };
    };
  }>(env, fetcher, INSPECTION_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ inspectionUrl: url, siteUrl: property(env) }),
  }, now);
  const result = response.inspectionResult?.indexStatusResult;
  if (!result) throw new Error("INSPECTION_EMPTY");
  return {
    url: path,
    verdict: result.verdict || "UNKNOWN",
    coverageState: result.coverageState || "",
    indexingState: result.indexingState || "",
    googleCanonical: result.googleCanonical || "",
    userCanonical: result.userCanonical || "",
    lastCrawlTime: result.lastCrawlTime || "",
  };
}

async function readSitemap(env: WorkerEnv, fetcher: Fetcher, now = Date.now()): Promise<SitemapStatus> {
  const response = await gscFetch<{ sitemap?: Array<{
    path?: string;
    isPending?: boolean;
    isSitemapsIndex?: boolean;
    lastDownloaded?: string;
    lastSubmitted?: string;
    errors?: number;
    warnings?: number;
    contents?: Array<{ type?: string; submitted?: number; indexed?: number }>;
  }> }>(env, fetcher, `${SITEMAPS_URL}/${encoded(property(env))}/sitemaps`, {}, now);
  const configuredPath = envValue(env.SITEMAP_URL, SITEMAP_URL);
  const found = response.sitemap?.find((item) => item.path === configuredPath) || response.sitemap?.[0];
  if (!found) {
    return {
      path: configuredPath,
      isPending: false,
      isSitemapIndex: false,
      submitted: "",
      lastDownloaded: "",
      lastSubmitted: "",
      errors: 0,
      warnings: 0,
      contents: [],
    };
  }
  return {
    path: found.path || configuredPath,
    isPending: Boolean(found.isPending),
    isSitemapIndex: Boolean(found.isSitemapsIndex),
    submitted: found.path || configuredPath,
    lastDownloaded: found.lastDownloaded || "",
    lastSubmitted: found.lastSubmitted || "",
    errors: Number(found.errors) || 0,
    warnings: Number(found.warnings) || 0,
    contents: (found.contents || []).map((item) => ({ type: item.type || "", submitted: Number(item.submitted) || 0, indexed: Number(item.indexed) || 0 })),
  };
}

async function runBatch(database: SeoDatabase & { batch?(statements: SeoStatement[]): Promise<unknown[]> }, statements: SeoStatement[]) {
  for (let offset = 0; offset < statements.length; offset += PAGE_BATCH_SIZE) {
    const chunk = statements.slice(offset, offset + PAGE_BATCH_SIZE);
    if (database.batch) await database.batch(chunk);
    else await Promise.all(chunk.map((statement) => statement.run()));
  }
}

export async function persistSnapshot(
  database: SeoDatabase & { batch?(statements: SeoStatement[]): Promise<unknown[]> },
  input: {
    dataDate: string;
    fetchedAt: string;
    status: "complete" | "partial";
    current: ReturnType<typeof metricSummary>;
    previous: ReturnType<typeof metricSummary>;
    metrics: ReturnType<typeof mapGscMetricRows>;
    indexes: IndexStatus[];
    sitemap: SitemapStatus | null;
    errorCode: string | null;
  },
) {
  await database.prepare(`INSERT INTO seo_snapshots (
      data_date, fetched_at, status, current_clicks, current_impressions, current_ctr, current_position,
      previous_clicks, previous_impressions, previous_ctr, previous_position, error_code
    ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)
    ON CONFLICT(data_date) DO UPDATE SET
      fetched_at = excluded.fetched_at, status = excluded.status,
      current_clicks = excluded.current_clicks, current_impressions = excluded.current_impressions,
      current_ctr = excluded.current_ctr, current_position = excluded.current_position,
      previous_clicks = excluded.previous_clicks, previous_impressions = excluded.previous_impressions,
      previous_ctr = excluded.previous_ctr, previous_position = excluded.previous_position,
      error_code = excluded.error_code`).bind(
    input.dataDate,
    input.fetchedAt,
    input.status,
    input.current.clicks,
    input.current.impressions,
    input.current.ctr,
    input.current.position,
    input.previous.clicks,
    input.previous.impressions,
    input.previous.ctr,
    input.previous.position,
    input.errorCode,
  ).run();
  await database.prepare("DELETE FROM seo_query_page_metrics WHERE snapshot_date = ?1").bind(input.dataDate).run();
  await database.prepare("DELETE FROM seo_index_status WHERE snapshot_date = ?1").bind(input.dataDate).run();
  await database.prepare("DELETE FROM seo_sitemap_status WHERE snapshot_date = ?1").bind(input.dataDate).run();

  await runBatch(database, input.metrics.map((row) => database.prepare(`INSERT OR REPLACE INTO seo_query_page_metrics (
      snapshot_date, query, page, clicks, impressions, ctr, position
    ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)`).bind(
    row.snapshot_date, row.query, row.page, row.clicks, row.impressions, row.ctr, row.position,
  )));
  await runBatch(database, input.indexes.map((row) => database.prepare(`INSERT OR REPLACE INTO seo_index_status (
      snapshot_date, url, verdict, coverage_state, indexing_state, google_canonical, user_canonical, last_crawl_time
    ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)`).bind(
    input.dataDate, row.url, row.verdict, row.coverageState, row.indexingState, row.googleCanonical, row.userCanonical, row.lastCrawlTime,
  )));
  if (input.sitemap) {
    await database.prepare(`INSERT OR REPLACE INTO seo_sitemap_status (
      snapshot_date, path, is_pending, is_sitemap_index, submitted, last_downloaded, last_submitted, errors, warnings, contents
    ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)`).bind(
      input.dataDate,
      input.sitemap.path,
      input.sitemap.isPending ? 1 : 0,
      input.sitemap.isSitemapIndex ? 1 : 0,
      input.sitemap.submitted,
      input.sitemap.lastDownloaded,
      input.sitemap.lastSubmitted,
      input.sitemap.errors,
      input.sitemap.warnings,
      JSON.stringify(input.sitemap.contents),
    ).run();
  }

  // ponytail: a bounded subquery keeps the retention rule in one D1 statement; upgrade to a scheduled archive only if history becomes a product requirement.
  await database.prepare(`DELETE FROM seo_query_page_metrics WHERE snapshot_date NOT IN (
    SELECT data_date FROM seo_snapshots ORDER BY data_date DESC LIMIT ?1
  )`).bind(SNAPSHOT_RETENTION).run();
  await database.prepare(`DELETE FROM seo_index_status WHERE snapshot_date NOT IN (
    SELECT data_date FROM seo_snapshots ORDER BY data_date DESC LIMIT ?1
  )`).bind(SNAPSHOT_RETENTION).run();
  await database.prepare(`DELETE FROM seo_sitemap_status WHERE snapshot_date NOT IN (
    SELECT data_date FROM seo_snapshots ORDER BY data_date DESC LIMIT ?1
  )`).bind(SNAPSHOT_RETENTION).run();
  await database.prepare(`DELETE FROM seo_snapshots WHERE data_date NOT IN (
    SELECT data_date FROM seo_snapshots ORDER BY data_date DESC LIMIT ?1
  )`).bind(SNAPSHOT_RETENTION).run();
}

export async function syncOnce(env: WorkerEnv, fetcher: Fetcher = defaultFetcher, now = Date.now()) {
  if (activeRun) return { status: "busy" as const };
  activeRun = true;
  try {
    if (!env.SEO_DB) throw new Error("SEO_DB_NOT_CONFIGURED");
    const today = new Date(now);
    const dataDate = await latestDataDate(env, fetcher, now);
    if (!dataDate) throw new Error("GSC_NO_COMPLETE_DATA");
    const currentWindow = dateWindow(dataDate);
    const previousWindow = dateWindow(shiftDate(dataDate, -28));
    const [currentRows, previousRows, queryRows] = await Promise.all([
      searchAnalytics(env, fetcher, currentWindow, [], 0, 1, now),
      searchAnalytics(env, fetcher, previousWindow, [], 0, 1, now),
      allQueryPageMetrics(env, fetcher, currentWindow, now),
    ]);
    const current = metricSummary(currentRows.rows || []);
    const previous = metricSummary(previousRows.rows || []);
    const mappedMetrics = mapGscMetricRows(queryRows, dataDate);
    const inspectionResults = await Promise.all(CONTROL_ROOM_PAGES.map(async (path) => {
      try { return await inspectUrl(env, fetcher, path, now); } catch { return null; }
    }));
    let sitemap: SitemapStatus | null = null;
    try { sitemap = await readSitemap(env, fetcher, now); } catch { sitemap = null; }
    const indexes = inspectionResults.filter((result): result is IndexStatus => Boolean(result));
    const partial = indexes.length !== CONTROL_ROOM_PAGES.length || !sitemap;
    await persistSnapshot(env.SEO_DB, {
      dataDate,
      fetchedAt: today.toISOString(),
      status: partial ? "partial" : "complete",
      current,
      previous,
      metrics: mappedMetrics,
      indexes,
      sitemap,
      errorCode: partial ? "INSPECTION_OR_SITEMAP_PARTIAL" : null,
    });
    return { status: partial ? "partial" as const : "complete" as const, dataDate, indexedChecked: indexes.length };
  } finally {
    activeRun = false;
  }
}

function authorizedRun(request: Request, env: WorkerEnv) {
  const expected = envValue(env.SEO_SYNC_TOKEN);
  const authorization = request.headers.get("authorization") || "";
  const supplied = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : request.headers.get("x-seo-sync-token") || "";
  return Boolean(expected && supplied && constantTimeEqual(supplied, expected));
}

function constantTimeEqual(left: string, right: string) {
  const leftBytes = new TextEncoder().encode(left);
  const rightBytes = new TextEncoder().encode(right);
  const length = Math.max(leftBytes.length, rightBytes.length);
  let difference = leftBytes.length ^ rightBytes.length;
  for (let index = 0; index < length; index += 1) {
    difference |= (leftBytes[index] || 0) ^ (rightBytes[index] || 0);
  }
  return difference === 0;
}

export async function fetch(request: Request, env: WorkerEnv, context: WorkerContext) {
  const url = new URL(request.url);
  if (url.pathname === "/health" && request.method === "GET") {
    return new Response(JSON.stringify({ ok: true, worker: "taico-ev-seo-sync", cron: "0 1 * * mon" }), { headers: { "content-type": "application/json", "cache-control": "no-store" } });
  }
  if (url.pathname === "/run") {
    if (request.method !== "POST") return new Response(JSON.stringify({ ok: false, code: "METHOD_NOT_ALLOWED" }), { status: 405, headers: { allow: "POST", "content-type": "application/json" } });
    if (!authorizedRun(request, env)) return new Response(JSON.stringify({ ok: false, code: "AUTH_REQUIRED" }), { status: 401, headers: { "content-type": "application/json", "cache-control": "no-store" } });
    try {
      const result = await syncOnce(env);
      return new Response(JSON.stringify({ ok: true, ...result }), { headers: { "content-type": "application/json", "cache-control": "no-store" } });
    } catch (error) {
      console.error("seo.sync_failed", { code: safeError(error) });
      return new Response(JSON.stringify({ ok: false, code: "SYNC_FAILED" }), { status: 503, headers: { "content-type": "application/json", "cache-control": "no-store" } });
    }
  }
  return new Response(JSON.stringify({ ok: false, code: "NOT_FOUND" }), { status: 404, headers: { "content-type": "application/json", "cache-control": "no-store" } });
}

export async function scheduled(_controller: unknown, env: WorkerEnv, context: WorkerContext) {
  context.waitUntil(syncOnce(env).catch((error) => {
    console.error("seo.scheduled_sync_failed", { code: safeError(error) });
  }));
}

export default { fetch, scheduled };
