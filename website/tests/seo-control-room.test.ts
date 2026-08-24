import assert from "node:assert/strict";
import test from "node:test";
import {
  buildControlRoomPayload,
  buildOpportunities,
  dateWindow,
  latestCompleteDate,
  metricSummary,
  readControlRoom,
} from "../src/lib/seo-control-room.ts";
import { onRequest } from "../functions/api/seo/control-room.ts";
import { exportPKCS8, generateKeyPair } from "jose";
import { syncOnce } from "../seo-sync/src/index.ts";

class MemoryStatement {
  private values: unknown[] = [];
  private readonly database: MemorySeoDb;
  private readonly query: string;

  constructor(database: MemorySeoDb, query: string) {
    this.database = database;
    this.query = query;
  }

  bind(...values: unknown[]) {
    this.values = values;
    return this;
  }

  async run() {
    this.database.run(this.query, this.values);
    return { meta: { changes: 1 } };
  }

  async first<T>() {
    return this.database.first(this.query, this.values) as T | null;
  }

  async all<T>() {
    return { results: this.database.all(this.query, this.values) as T[] };
  }
}

class MemorySeoDb {
  snapshots = new Map<string, Record<string, unknown>>();
  metrics = new Map<string, Record<string, unknown>[]>();
  indexes = new Map<string, Record<string, unknown>[]>();
  sitemaps = new Map<string, Record<string, unknown>[]>();

  prepare(query: string) {
    return new MemoryStatement(this, query);
  }

  async batch(statements: MemoryStatement[]) {
    await Promise.all(statements.map((statement) => statement.run()));
    return [];
  }

  first(query: string, values: unknown[]) {
    if (query.includes("SELECT * FROM seo_snapshots")) {
      return [...this.snapshots.values()].sort((a, b) => String(b.data_date).localeCompare(String(a.data_date)))[0] || null;
    }
    if (query.includes("SELECT data_date FROM seo_snapshots WHERE status = 'complete'")) {
      const row = [...this.snapshots.values()]
        .filter((item) => item.status === "complete")
        .sort((a, b) => String(b.data_date).localeCompare(String(a.data_date)))[0];
      return row ? { data_date: row.data_date } : null;
    }
    return null;
  }

  all(query: string, values: unknown[]) {
    const date = String(values[0] || "");
    if (query.includes("seo_query_page_metrics")) return this.metrics.get(date) || [];
    if (query.includes("seo_index_status")) {
      return (this.indexes.get(date) || []).map((row) => ({
        snapshot_date: date,
        url: row.url,
        verdict: row.verdict,
        coverageState: row.coverageState,
        indexingState: row.indexingState,
        googleCanonical: row.googleCanonical,
        userCanonical: row.userCanonical,
        lastCrawlTime: row.lastCrawlTime,
      }));
    }
    if (query.includes("seo_sitemap_status")) {
      return (this.sitemaps.get(date) || []).map((row) => ({
        snapshot_date: date,
        path: row.path,
        isPending: row.isPending,
        isSitemapIndex: row.isSitemapIndex,
        submitted: row.submitted,
        lastDownloaded: row.lastDownloaded,
        lastSubmitted: row.lastSubmitted,
        errors: row.errors,
        warnings: row.warnings,
        contents: row.contents,
      }));
    }
    return [];
  }

  run(query: string, values: unknown[]) {
    if (query.includes("INSERT INTO seo_snapshots")) {
      const [data_date, fetched_at, status, current_clicks, current_impressions, current_ctr, current_position, previous_clicks, previous_impressions, previous_ctr, previous_position, error_code] = values;
      this.snapshots.set(String(data_date), { data_date, fetched_at, status, current_clicks, current_impressions, current_ctr, current_position, previous_clicks, previous_impressions, previous_ctr, previous_position, error_code });
      return;
    }
    const date = String(values[0] || "");
    if (query.includes("DELETE FROM seo_query_page_metrics WHERE snapshot_date =")) { this.metrics.delete(date); return; }
    if (query.includes("DELETE FROM seo_index_status WHERE snapshot_date =")) { this.indexes.delete(date); return; }
    if (query.includes("DELETE FROM seo_sitemap_status WHERE snapshot_date =")) { this.sitemaps.delete(date); return; }
    if (query.includes("INSERT OR REPLACE INTO seo_query_page_metrics")) {
      const [snapshot_date, queryValue, page, clicks, impressions, ctr, position] = values;
      const rows = this.metrics.get(String(snapshot_date)) || [];
      const filtered = rows.filter((row) => !(row.query === queryValue && row.page === page));
      filtered.push({ snapshot_date, query: queryValue, page, clicks, impressions, ctr, position });
      this.metrics.set(String(snapshot_date), filtered);
      return;
    }
    if (query.includes("INSERT OR REPLACE INTO seo_index_status")) {
      const [snapshot_date, url, verdict, coverageState, indexingState, googleCanonical, userCanonical, lastCrawlTime] = values;
      const rows = this.indexes.get(String(snapshot_date)) || [];
      this.indexes.set(String(snapshot_date), [...rows.filter((row) => row.url !== url), { snapshot_date, url, verdict, coverageState, indexingState, googleCanonical, userCanonical, lastCrawlTime }]);
      return;
    }
    if (query.includes("INSERT OR REPLACE INTO seo_sitemap_status")) {
      const [snapshot_date, path, isPending, isSitemapIndex, submitted, lastDownloaded, lastSubmitted, errors, warnings, contents] = values;
      this.sitemaps.set(String(snapshot_date), [{ snapshot_date, path, isPending, isSitemapIndex, submitted, lastDownloaded, lastSubmitted, errors, warnings, contents }]);
    }
  }
}

test("Search Console windows use the latest complete date and 28-day boundaries", () => {
  assert.equal(latestCompleteDate([
    { keys: ["2026-08-24"] },
    { keys: ["2026-08-23"] },
    { keys: ["2026-08-22"] },
  ], new Date("2026-08-24T08:00:00Z")), "2026-08-22");
  assert.deepEqual(dateWindow("2026-08-22"), { startDate: "2026-07-26", endDate: "2026-08-22" });
  assert.deepEqual(dateWindow("2026-07-25"), { startDate: "2026-06-28", endDate: "2026-07-25" });
});

test("Search Console summaries weight average position by impressions", () => {
  assert.deepEqual(metricSummary([
    { clicks: 2, impressions: 10, position: 4 },
    { clicks: 1, impressions: 30, position: 20 },
  ]), { clicks: 3, impressions: 40, ctr: 0.075, position: 16 });
});

test("opportunities filter brand queries and classify deterministic long-tail actions", () => {
  const opportunities = buildOpportunities([
    { query: "mobile ev charger fleet", page: "/", clicks: 3, impressions: 183, ctr: 3 / 183, position: 24 },
    { query: "portable dc fast charger", page: "/products/category/mobile-charging/", clicks: 1, impressions: 96, ctr: 1 / 96, position: 38 },
    { query: "mobile charger cost", page: "/", clicks: 0, impressions: 47, ctr: 0, position: 61 },
    { query: "taico mobile charger", page: "/", clicks: 10, impressions: 100, ctr: 0.1, position: 3 },
    { query: "low volume mobile", page: "/", clicks: 0, impressions: 19, ctr: 0, position: 20 },
  ], "2026-08-22");
  assert.equal(opportunities.length, 3);
  assert.deepEqual(opportunities.map((item) => item.action), ["BUILD", "IMPROVE", "ARTICLE"]);
  assert.equal(opportunities[0].targetPath, "/solutions/mobile-ev-charging-for-fleets/");
  assert.equal(opportunities[1].targetPath, "/products/category/mobile-charging/");
  assert.equal(opportunities[2].targetPath, "/resources/articles/mobile-ev-charger-cost-factors/");
});

test("empty control room payload keeps a safe no-data contract", () => {
  const payload = buildControlRoomPayload(null, [], [], null);
  assert.equal(payload.status, "empty");
  assert.equal(payload.search, null);
  assert.equal(payload.indexing.checked, 0);
  assert.deepEqual(payload.opportunities, []);
});

test("partial snapshots fill missing inspection URLs and sitemap from the latest complete snapshot", async () => {
  const database = new MemorySeoDb();
  database.snapshots.set("2026-08-24", {
    data_date: "2026-08-24",
    fetched_at: "2026-08-24T01:00:00.000Z",
    status: "partial",
    current_clicks: 4,
    current_impressions: 100,
    current_ctr: 0.04,
    current_position: 14,
    previous_clicks: 2,
    previous_impressions: 80,
    previous_ctr: 0.025,
    previous_position: 17,
    error_code: "INSPECTION_OR_SITEMAP_PARTIAL",
  });
  database.snapshots.set("2026-08-20", {
    data_date: "2026-08-20",
    fetched_at: "2026-08-20T01:00:00.000Z",
    status: "complete",
    current_clicks: 1,
    current_impressions: 20,
    current_ctr: 0.05,
    current_position: 10,
    previous_clicks: 1,
    previous_impressions: 10,
    previous_ctr: 0.1,
    previous_position: 11,
    error_code: null,
  });
  database.indexes.set("2026-08-24", [{ url: "/", verdict: "PASS", coverageState: "Indexed", indexingState: "INDEXING_ALLOWED", googleCanonical: "https://taicoev.com/", userCanonical: "https://taicoev.com/", lastCrawlTime: "2026-08-23T00:00:00Z" }]);
  database.indexes.set("2026-08-20", [{ url: "/", verdict: "PASS", coverageState: "Indexed", indexingState: "INDEXING_ALLOWED", googleCanonical: "https://taicoev.com/", userCanonical: "https://taicoev.com/", lastCrawlTime: "2026-08-19T00:00:00Z" }, { url: "/products/tkmc-800/", verdict: "PASS", coverageState: "Indexed", indexingState: "INDEXING_ALLOWED", googleCanonical: "https://taicoev.com/products/tkmc-800/", userCanonical: "https://taicoev.com/products/tkmc-800/", lastCrawlTime: "2026-08-18T00:00:00Z" }]);
  database.sitemaps.set("2026-08-20", [{ path: "https://taicoev.com/sitemap-index.xml", isPending: 0, isSitemapIndex: "1", submitted: "2026-08-18T00:00:00Z", lastDownloaded: "2026-08-19T00:00:00Z", lastSubmitted: "2026-08-18T00:00:00Z", errors: 0, warnings: 1, contents: "[]" }]);

  const payload = await readControlRoom(database);
  assert.equal(payload.status, "partial");
  assert.equal(payload.dataThrough, "2026-08-24");
  assert.equal(payload.indexing.pages.length, 2);
  assert.equal(payload.indexing.pages[1].url, "/products/tkmc-800/");
  assert.equal("snapshot_date" in payload.indexing.pages[0], false);
  assert.equal(payload.sitemap?.isPending, false);
  assert.equal(payload.sitemap?.isSitemapIndex, true);
  assert.equal("snapshot_date" in (payload.sitemap || {}), false);
});

test("full and stale payloads preserve exact public shapes", () => {
  const payload = buildControlRoomPayload({
    data_date: "2020-01-01",
    fetched_at: "2020-01-02T00:00:00Z",
    status: "complete",
    current_clicks: 2,
    current_impressions: 40,
    current_ctr: 0.05,
    current_position: 12,
    previous_clicks: 1,
    previous_impressions: 20,
    previous_ctr: 0.05,
    previous_position: 15,
    error_code: null,
  }, [{ query: "mobile charger", page: "/", clicks: 2, impressions: 40, ctr: 0.05, position: 12 }], [{
    url: "/",
    verdict: "PASS",
    coverageState: "Indexed",
    indexingState: "INDEXING_ALLOWED",
    googleCanonical: "https://taicoev.com/",
    userCanonical: "https://taicoev.com/",
    lastCrawlTime: "2020-01-01T00:00:00Z",
  }], {
    path: "https://taicoev.com/sitemap-index.xml",
    isPending: "0" as unknown as boolean,
    isSitemapIndex: "1" as unknown as boolean,
    submitted: "2020-01-01T00:00:00Z",
    lastDownloaded: "2020-01-01T00:00:00Z",
    lastSubmitted: "2020-01-01T00:00:00Z",
    errors: 0,
    warnings: 0,
    contents: [],
  });
  assert.equal(payload.status, "complete");
  assert.equal(payload.stale, true);
  assert.equal(payload.indexing.pages[0].indexed, true);
  assert.equal(payload.sitemap?.isPending, false);
  assert.equal(payload.sitemap?.isSitemapIndex, true);
  assert.deepEqual(Object.keys(payload.indexing.pages[0]).sort(), ["coverageState", "googleCanonical", "indexed", "indexingState", "lastCrawlTime", "url", "userCanonical", "verdict"]);
});

test("sync Worker stores one partial same-date snapshot when inspection or sitemap calls fail", async () => {
  const { privateKey } = await generateKeyPair("RS256", { extractable: true });
  const privateKeyPem = await exportPKCS8(privateKey);
  const database = new MemorySeoDb();
  const fetcher = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url === "https://oauth2.googleapis.com/token") return new Response(JSON.stringify({ access_token: "test-token", expires_in: 3600 }), { headers: { "content-type": "application/json" } });
    if (url.includes("searchAnalytics/query")) {
      const body = JSON.parse(String(init?.body || "{}"));
      if (body.dimensions?.[0] === "date") return new Response(JSON.stringify({ rows: [{ keys: ["2026-08-22"] }] }), { headers: { "content-type": "application/json" } });
      if (body.dimensions?.length === 0) return new Response(JSON.stringify({ rows: [{ clicks: 2, impressions: 40, ctr: 0.05, position: 12 }] }), { headers: { "content-type": "application/json" } });
      return new Response(JSON.stringify({ rows: [{ keys: ["mobile charger", "https://taicoev.com/"], clicks: 2, impressions: 40, ctr: 0.05, position: 12 }] }), { headers: { "content-type": "application/json" } });
    }
    if (url.includes("urlInspection")) {
      const body = JSON.parse(String(init?.body || "{}"));
      if (body.inspectionUrl === "https://taicoev.com/") return new Response(JSON.stringify({ inspectionResult: { indexStatusResult: { verdict: "PASS", coverageState: "Indexed", indexingState: "INDEXING_ALLOWED", googleCanonical: body.inspectionUrl, userCanonical: body.inspectionUrl, lastCrawlTime: "2026-08-22T00:00:00Z" } } }), { headers: { "content-type": "application/json" } });
      return new Response("inspection failed", { status: 503 });
    }
    if (url.includes("/sitemaps")) return new Response("sitemap failed", { status: 503 });
    return new Response("unexpected", { status: 404 });
  };
  const env = { SEO_DB: database, GSC_CLIENT_EMAIL: "seo-test@example.iam.gserviceaccount.com", GSC_PRIVATE_KEY: privateKeyPem, GSC_PROPERTY: "sc-domain:taicoev.com" };
  const first = await syncOnce(env, fetcher, Date.parse("2026-08-24T01:00:00Z"));
  const second = await syncOnce(env, fetcher, Date.parse("2026-08-24T02:00:00Z"));
  assert.equal(first.status, "partial");
  assert.equal(second.status, "partial");
  assert.equal(database.snapshots.size, 1);
  assert.equal(database.snapshots.get("2026-08-22")?.status, "partial");
  assert.equal(database.indexes.get("2026-08-22")?.length, 1);
  assert.equal(database.sitemaps.has("2026-08-22"), false);

  const originalFetch = globalThis.fetch;
  let globalFetchCalls = 0;
  globalThis.fetch = async (input, init) => {
    globalFetchCalls += 1;
    return fetcher(input, init);
  };
  try {
    const defaultFetcherRun = await syncOnce(env, undefined, Date.parse("2026-08-25T01:00:00Z"));
    assert.equal(defaultFetcherRun.status, "partial");
  } finally {
    globalThis.fetch = originalFetch;
  }
  assert.ok(globalFetchCalls > 0);
});

test("SEO data endpoint is read-only, Access-gated, and never cacheable", async () => {
  const unauthorized = await onRequest({ request: new Request("https://taicoev.com/api/seo/control-room"), env: {} });
  assert.equal(unauthorized.status, 401);
  assert.equal(unauthorized.headers.get("cache-control"), "private, no-store");

  const wrongMethod = await onRequest({ request: new Request("https://taicoev.com/api/seo/control-room", { method: "POST" }), env: {} });
  assert.equal(wrongMethod.status, 405);
  assert.equal(wrongMethod.headers.get("allow"), "GET");
});
