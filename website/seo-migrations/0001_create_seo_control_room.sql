-- Independent SEO telemetry database. It must never be bound to LEADS_DB.
CREATE TABLE IF NOT EXISTS seo_snapshots (
  data_date TEXT PRIMARY KEY,
  fetched_at TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('complete', 'partial')),
  current_clicks REAL NOT NULL DEFAULT 0,
  current_impressions REAL NOT NULL DEFAULT 0,
  current_ctr REAL NOT NULL DEFAULT 0,
  current_position REAL NOT NULL DEFAULT 0,
  previous_clicks REAL NOT NULL DEFAULT 0,
  previous_impressions REAL NOT NULL DEFAULT 0,
  previous_ctr REAL NOT NULL DEFAULT 0,
  previous_position REAL NOT NULL DEFAULT 0,
  error_code TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS seo_query_page_metrics (
  snapshot_date TEXT NOT NULL,
  query TEXT NOT NULL,
  page TEXT NOT NULL,
  clicks REAL NOT NULL DEFAULT 0,
  impressions REAL NOT NULL DEFAULT 0,
  ctr REAL NOT NULL DEFAULT 0,
  position REAL NOT NULL DEFAULT 0,
  PRIMARY KEY (snapshot_date, query, page),
  FOREIGN KEY (snapshot_date) REFERENCES seo_snapshots(data_date) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS seo_index_status (
  snapshot_date TEXT NOT NULL,
  url TEXT NOT NULL,
  verdict TEXT NOT NULL DEFAULT 'UNKNOWN',
  coverage_state TEXT NOT NULL DEFAULT '',
  indexing_state TEXT NOT NULL DEFAULT '',
  google_canonical TEXT NOT NULL DEFAULT '',
  user_canonical TEXT NOT NULL DEFAULT '',
  last_crawl_time TEXT NOT NULL DEFAULT '',
  PRIMARY KEY (snapshot_date, url),
  FOREIGN KEY (snapshot_date) REFERENCES seo_snapshots(data_date) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS seo_sitemap_status (
  snapshot_date TEXT NOT NULL,
  path TEXT NOT NULL,
  is_pending INTEGER NOT NULL DEFAULT 0,
  is_sitemap_index INTEGER NOT NULL DEFAULT 0,
  submitted TEXT NOT NULL DEFAULT '',
  last_downloaded TEXT NOT NULL DEFAULT '',
  last_submitted TEXT NOT NULL DEFAULT '',
  errors INTEGER NOT NULL DEFAULT 0,
  warnings INTEGER NOT NULL DEFAULT 0,
  contents TEXT NOT NULL DEFAULT '[]',
  PRIMARY KEY (snapshot_date, path),
  FOREIGN KEY (snapshot_date) REFERENCES seo_snapshots(data_date) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_seo_snapshots_fetched_at ON seo_snapshots(fetched_at);
CREATE INDEX IF NOT EXISTS idx_seo_metrics_impressions ON seo_query_page_metrics(snapshot_date, impressions DESC);
