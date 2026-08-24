import { keywordTargets } from "../data/seo-preview.ts";

export const SEARCH_CONSOLE_PROPERTY = "sc-domain:taicoev.com";
export const SITE_ORIGIN = "https://taicoev.com";
export const SITEMAP_URL = `${SITE_ORIGIN}/sitemap-index.xml`;
export const SNAPSHOT_RETENTION = 52;
export const STALE_AFTER_DAYS = 10;

export const CONTROL_ROOM_PAGES = [
  "/",
  "/products/category/mobile-charging/",
  "/products/tkmc-800/",
  "/products/tkmc-1500/",
  "/solutions/mobile-ev-charger-roadside-rescue/",
  "/resources/articles/mobile-ev-charging-guide/",
  "/resources/articles/kw-vs-kwh-mobile-ev-charging/",
  "/resources/articles/roadside-ev-rescue-charging-workflow/",
] as const;

export type SeoSyncStatus = "complete" | "partial";

export type SearchMetric = {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type QueryPageMetric = SearchMetric & {
  query: string;
  page: string;
};

export type IndexStatus = {
  url: string;
  verdict: string;
  coverageState: string;
  indexingState: string;
  googleCanonical: string;
  userCanonical: string;
  lastCrawlTime: string;
};

export type SitemapStatus = {
  path: string;
  isPending: boolean;
  isSitemapIndex: boolean;
  submitted: string;
  lastDownloaded: string;
  lastSubmitted: string;
  errors: number;
  warnings: number;
  contents: Array<{ type: string; submitted: number; indexed: number }>;
};

export type OpportunityAction = "BUILD" | "IMPROVE" | "ARTICLE" | "REVIEW";

export type Opportunity = {
  query: string;
  position: number;
  impressions: number;
  clicks: number;
  ctr: number;
  action: OpportunityAction;
  targetPath: string;
  reason: string;
  score: number;
  dataThrough: string;
};

export type SnapshotRow = {
  data_date: string;
  fetched_at: string;
  status: SeoSyncStatus;
  current_clicks: number;
  current_impressions: number;
  current_ctr: number;
  current_position: number;
  previous_clicks: number;
  previous_impressions: number;
  previous_ctr: number;
  previous_position: number;
  error_code: string | null;
};

export type SeoStatement = {
  bind(...values: unknown[]): SeoStatement;
  run(): Promise<{ meta?: { changes?: number } }>;
  first<T>(): Promise<T | null>;
  all<T>(): Promise<{ results: T[] }>;
};

export type SeoDatabase = {
  prepare(query: string): SeoStatement;
};

export type StoredMetricRow = QueryPageMetric & { snapshot_date: string };

export type StoredIndexRow = IndexStatus & { snapshot_date: string };

export type StoredSitemapRow = Omit<SitemapStatus, "contents"> & { snapshot_date: string; contents: SitemapStatus["contents"] | string };

export type ControlRoomPayload = {
  version: 1;
  property: string;
  status: "empty" | SeoSyncStatus;
  dataThrough: string | null;
  lastSync: string | null;
  stale: boolean;
  search: {
    current: SearchMetric;
    previous: SearchMetric;
    delta: { clicks: number; impressions: number; ctr: number; position: number };
  } | null;
  indexing: {
    checked: number;
    indexed: number;
    pages: Array<IndexStatus & { indexed: boolean }>;
  };
  sitemap: SitemapStatus | null;
  opportunities: Opportunity[];
  metrics: QueryPageMetric[];
};

export type GscDateRow = { keys?: string[] };

export type GscMetricRow = {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
};

function textValue(value: unknown) {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

function databaseBoolean(value: unknown) {
  return value === true || value === 1 || value === "1" || value === "true";
}

export function normalizeIndexStatus(value: Partial<IndexStatus>): IndexStatus {
  return {
    url: textValue(value.url),
    verdict: textValue(value.verdict),
    coverageState: textValue(value.coverageState),
    indexingState: textValue(value.indexingState),
    googleCanonical: textValue(value.googleCanonical),
    userCanonical: textValue(value.userCanonical),
    lastCrawlTime: textValue(value.lastCrawlTime),
  };
}

export function normalizeSitemapStatus(value: Partial<SitemapStatus>): SitemapStatus {
  const contents = Array.isArray(value.contents)
    ? value.contents.map((item) => ({
      type: textValue(item?.type),
      submitted: finiteNumber(item?.submitted),
      indexed: finiteNumber(item?.indexed),
    }))
    : [];
  return {
    path: textValue(value.path),
    isPending: databaseBoolean(value.isPending),
    isSitemapIndex: databaseBoolean(value.isSitemapIndex),
    submitted: textValue(value.submitted),
    lastDownloaded: textValue(value.lastDownloaded),
    lastSubmitted: textValue(value.lastSubmitted),
    errors: finiteNumber(value.errors),
    warnings: finiteNumber(value.warnings),
    contents,
  };
}

const BRAND_QUERY = /\b(?:taico|tico\s+electric)\b/i;
const SCENARIO_QUERY = /\b(?:fleet|roadside|dealer(?:ship)?|rental|service)\b/i;
const ARTICLE_QUERY = /\b(?:cost|price|how\s+much|vs\.?|guide|how|what|why)\b/i;
const PRODUCT_QUERY = /\b(?:mobile|portable|dc\s+fast|battery[ -]+powered)\b/i;

function finiteNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function shiftDate(value: string, days: number) {
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.valueOf())) throw new Error(`Invalid ISO date: ${value}`);
  date.setUTCDate(date.getUTCDate() + days);
  return isoDate(date);
}

export function dateWindow(endDate: string, length = 28) {
  return {
    startDate: shiftDate(endDate, -(length - 1)),
    endDate,
  };
}

export function latestCompleteDate(rows: GscDateRow[], now = new Date()) {
  const latestAllowed = shiftDate(isoDate(now), -2);
  return rows
    .map((row) => row.keys?.[0] || "")
    .filter((value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && value <= latestAllowed)
    .sort((a, b) => b.localeCompare(a))[0] || null;
}

export function metricSummary(rows: Array<Pick<GscMetricRow, "clicks" | "impressions" | "position">>): SearchMetric {
  const clicks = rows.reduce((sum, row) => sum + finiteNumber(row.clicks), 0);
  const impressions = rows.reduce((sum, row) => sum + finiteNumber(row.impressions), 0);
  const weightedPosition = rows.reduce((sum, row) => sum + finiteNumber(row.position) * finiteNumber(row.impressions), 0);
  return {
    clicks,
    impressions,
    ctr: impressions > 0 ? clicks / impressions : 0,
    position: impressions > 0 ? weightedPosition / impressions : 0,
  };
}

export function mapGscMetricRows(rows: GscMetricRow[], snapshotDate: string): StoredMetricRow[] {
  return rows.flatMap((row) => {
    const query = row.keys?.[0]?.trim();
    const page = row.keys?.[1]?.trim();
    if (!query || !page) return [];
    const clicks = finiteNumber(row.clicks);
    const impressions = finiteNumber(row.impressions);
    return [{
      snapshot_date: snapshotDate,
      query,
      page,
      clicks,
      impressions,
      ctr: impressions > 0 ? clicks / impressions : finiteNumber(row.ctr),
      position: finiteNumber(row.position),
    }];
  });
}

function normalizedQuery(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function ownerForQuery(query: string) {
  const normalized = normalizedQuery(query);
  return keywordTargets.find((target) => normalizedQuery(target.query) === normalized)?.ownerPath || null;
}

function groupedQueryMetrics(rows: QueryPageMetric[]) {
  const groups = new Map<string, QueryPageMetric[]>();
  for (const row of rows) {
    const existing = groups.get(row.query) || [];
    existing.push(row);
    groups.set(row.query, existing);
  }
  return [...groups.entries()].map(([query, queryRows]) => {
    const summary = metricSummary(queryRows);
    return { query, rows: queryRows, ...summary };
  });
}

export function buildOpportunities(rows: QueryPageMetric[], dataThrough: string, limit = 10): Opportunity[] {
  const opportunities = groupedQueryMetrics(rows).flatMap((item): Opportunity[] => {
    if (item.impressions < 20 || BRAND_QUERY.test(item.query)) return [];
    const ownerPath = ownerForQuery(item.query);
    const position = item.position;
    let action: OpportunityAction;
    let targetPath: string;
    let reason: string;

    if (ownerPath && position >= 8 && position <= 40) {
      action = "IMPROVE";
      targetPath = ownerPath;
      reason = `Existing owner is ranking at position ${Math.round(position)}; improve relevance and conversion signals.`;
    } else if (position > 0 && position <= 7 && item.impressions >= 50 && item.ctr < 0.02) {
      action = "IMPROVE";
      targetPath = ownerPath || "/";
      reason = "The page already ranks well but the snippet CTR is below 2%; test a clearer title and description.";
    } else if (position >= 41 && position <= 80 && item.impressions >= 50) {
      action = "IMPROVE";
      targetPath = ownerPath || (PRODUCT_QUERY.test(item.query) ? "/products/category/mobile-charging/" : "/");
      reason = "The query has demand but sits beyond page-one range; strengthen page relevance and internal links.";
    } else if (!ownerPath && SCENARIO_QUERY.test(item.query)) {
      action = "BUILD";
      targetPath = "/solutions/mobile-ev-charging-for-fleets/";
      reason = "Unowned scenario demand is a candidate for a dedicated solution page.";
    } else if (!ownerPath && ARTICLE_QUERY.test(item.query)) {
      action = "ARTICLE";
      targetPath = "/resources/articles/mobile-ev-charger-cost-factors/";
      reason = "Unowned informational demand is a candidate for a focused explanatory article.";
    } else if (!ownerPath && PRODUCT_QUERY.test(item.query)) {
      action = "IMPROVE";
      targetPath = "/products/category/mobile-charging/";
      reason = "Product-intent demand should be consolidated on the mobile charging category page.";
    } else {
      action = "REVIEW";
      targetPath = ownerPath || "/";
      reason = "Review the query and assign it to an existing page before creating new content.";
    }

    const rankingPotential = position > 0 ? Math.max(0, Math.min(1, (81 - position) / 80)) : 0.25;
    return [{
      query: item.query,
      position,
      impressions: item.impressions,
      clicks: item.clicks,
      ctr: item.ctr,
      action,
      targetPath,
      reason,
      score: item.impressions * rankingPotential,
      dataThrough,
    }];
  });

  return opportunities
    .sort((a, b) => b.score - a.score || b.impressions - a.impressions || a.query.localeCompare(b.query))
    .slice(0, limit);
}

function deltaMetric(current: number, previous: number) {
  return current - previous;
}

export function buildControlRoomPayload(
  snapshot: SnapshotRow | null,
  metrics: QueryPageMetric[],
  indexes: IndexStatus[],
  sitemap: SitemapStatus | null,
  property = SEARCH_CONSOLE_PROPERTY,
): ControlRoomPayload {
  const normalizedSitemap = sitemap ? normalizeSitemapStatus(sitemap) : null;
  if (!snapshot) {
    return {
      version: 1,
      property,
      status: "empty",
      dataThrough: null,
      lastSync: null,
      stale: true,
      search: null,
      indexing: { checked: 0, indexed: 0, pages: [] },
      sitemap: normalizedSitemap,
      opportunities: [],
      metrics: [],
    };
  }

  const pages = indexes.map(normalizeIndexStatus).map((item) => ({ ...item, indexed: item.verdict.toUpperCase() === "PASS" }));
  const current: SearchMetric = {
    clicks: snapshot.current_clicks,
    impressions: snapshot.current_impressions,
    ctr: snapshot.current_ctr,
    position: snapshot.current_position,
  };
  const previous: SearchMetric = {
    clicks: snapshot.previous_clicks,
    impressions: snapshot.previous_impressions,
    ctr: snapshot.previous_ctr,
    position: snapshot.previous_position,
  };
  const ageDays = Math.max(0, Math.floor((Date.now() - Date.parse(`${snapshot.data_date}T00:00:00Z`)) / 86_400_000));
  return {
    version: 1,
    property,
    status: snapshot.status,
    dataThrough: snapshot.data_date,
    lastSync: snapshot.fetched_at,
    stale: ageDays > STALE_AFTER_DAYS,
    search: {
      current,
      previous,
      delta: {
        clicks: deltaMetric(current.clicks, previous.clicks),
        impressions: deltaMetric(current.impressions, previous.impressions),
        ctr: deltaMetric(current.ctr, previous.ctr),
        position: deltaMetric(current.position, previous.position),
      },
    },
    indexing: {
      checked: pages.length,
      indexed: pages.filter((page) => page.indexed).length,
      pages,
    },
    sitemap: normalizedSitemap,
    opportunities: buildOpportunities(metrics, snapshot.data_date),
    metrics: [...metrics]
      .sort((a, b) => b.impressions - a.impressions || a.query.localeCompare(b.query))
      .slice(0, 100),
  };
}

async function selectLatestSnapshot(database: SeoDatabase) {
  return database.prepare("SELECT * FROM seo_snapshots ORDER BY data_date DESC LIMIT 1").first<SnapshotRow>();
}

export async function readControlRoom(database: SeoDatabase, property = SEARCH_CONSOLE_PROPERTY) {
  const snapshot = await selectLatestSnapshot(database);
  if (!snapshot) return buildControlRoomPayload(null, [], [], null, property);

  const metricRows = await database
    .prepare("SELECT snapshot_date, query, page, clicks, impressions, ctr, position FROM seo_query_page_metrics WHERE snapshot_date = ?1")
    .bind(snapshot.data_date)
    .all<StoredMetricRow>();
  let indexRows = await database
    .prepare("SELECT snapshot_date, url, verdict, coverage_state AS coverageState, indexing_state AS indexingState, google_canonical AS googleCanonical, user_canonical AS userCanonical, last_crawl_time AS lastCrawlTime FROM seo_index_status WHERE snapshot_date = ?1")
    .bind(snapshot.data_date)
    .all<StoredIndexRow>();
  let lastGood: { data_date: string } | null = null;
  if (snapshot.status === "partial") {
    lastGood = await database.prepare("SELECT data_date FROM seo_snapshots WHERE status = 'complete' ORDER BY data_date DESC LIMIT 1").first<{ data_date: string }>();
  }
  const currentIndexMap = new Map<string, IndexStatus>();
  for (const row of indexRows.results) {
    const normalized = normalizeIndexStatus(row);
    if (normalized.url) currentIndexMap.set(normalized.url, normalized);
  }
  if (snapshot.status === "partial" && lastGood) {
    const fallbackRows = await database
      .prepare("SELECT snapshot_date, url, verdict, coverage_state AS coverageState, indexing_state AS indexingState, google_canonical AS googleCanonical, user_canonical AS userCanonical, last_crawl_time AS lastCrawlTime FROM seo_index_status WHERE snapshot_date = ?1")
      .bind(lastGood.data_date)
      .all<StoredIndexRow>();
    for (const row of fallbackRows.results) {
      const normalized = normalizeIndexStatus(row);
      if (normalized.url && !currentIndexMap.has(normalized.url)) currentIndexMap.set(normalized.url, normalized);
    }
  }
  const indexes = [...currentIndexMap.values()];
  let sitemapRows = await database
    .prepare("SELECT snapshot_date, path, is_pending AS isPending, is_sitemap_index AS isSitemapIndex, submitted, last_downloaded AS lastDownloaded, last_submitted AS lastSubmitted, errors, warnings, contents FROM seo_sitemap_status WHERE snapshot_date = ?1 LIMIT 1")
    .bind(snapshot.data_date)
    .all<StoredSitemapRow>();
  if (sitemapRows.results.length === 0 && !lastGood) {
    lastGood = await database.prepare("SELECT data_date FROM seo_snapshots WHERE status = 'complete' ORDER BY data_date DESC LIMIT 1").first<{ data_date: string }>();
  }
  if (sitemapRows.results.length === 0 && lastGood) {
    sitemapRows = await database
      .prepare("SELECT snapshot_date, path, is_pending AS isPending, is_sitemap_index AS isSitemapIndex, submitted, last_downloaded AS lastDownloaded, last_submitted AS lastSubmitted, errors, warnings, contents FROM seo_sitemap_status WHERE snapshot_date = ?1 LIMIT 1")
      .bind(lastGood.data_date)
      .all<StoredSitemapRow>();
  }
  let sitemap: SitemapStatus | null = null;
  if (sitemapRows.results[0]) {
    const row = sitemapRows.results[0];
    let contents = row.contents;
    if (typeof contents === "string") {
      try { contents = JSON.parse(contents); } catch { contents = []; }
    }
    sitemap = normalizeSitemapStatus({ ...row, contents: Array.isArray(contents) ? contents : [] });
  }
  const metrics = metricRows.results.map((row) => ({
    query: row.query,
    page: row.page,
    clicks: row.clicks,
    impressions: row.impressions,
    ctr: row.ctr,
    position: row.position,
  }));
  return buildControlRoomPayload(snapshot, metrics, indexes, sitemap, property);
}
