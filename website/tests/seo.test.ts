import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const websiteRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFileSync(join(websiteRoot, relativePath), "utf8");

test("sitemap integration keeps completion and error routes out of the index", () => {
  const config = read("astro.config.mjs");

  assert.match(config, /import sitemap from ["']@astrojs\/sitemap["']/);
  assert.match(config, /site:\s*["']https:\/\/taicoev\.com["']/);
  assert.match(config, /integrations:\s*\[[\s\S]*sitemap\(/);
  assert.match(config, /thank-you/);
  assert.match(config, /404/);
});

test("robots.txt points crawlers to the canonical sitemap", () => {
  assert.equal(
    read("public/robots.txt").trim(),
    "User-agent: *\nAllow: /\n\nSitemap: https://taicoev.com/sitemap-index.xml",
  );
});

test("Layout emits canonical, robots, and sitemap metadata without dropping site schemas", () => {
  const layout = read("src/layouts/Layout.astro");

  assert.match(layout, /canonicalPath\?/);
  assert.match(layout, /robots\?/);
  assert.match(layout, /rel="canonical"/);
  assert.match(layout, /name="robots"/);
  assert.match(layout, /rel="sitemap" href="\/sitemap-index\.xml"/);
  assert.match(layout, /"@type": "Organization"/);
  assert.match(layout, /"@type": "WebSite"/);
  assert.match(layout, /search = ""/);
  assert.match(layout, /hash = ""/);
});

test("non-indexable pages opt out explicitly and the 404 page is real", () => {
  const thankYou = read("src/pages/thank-you.astro");
  const notFoundPath = join(websiteRoot, "src/pages/404.astro");
  const notFound = read("src/pages/404.astro");

  assert.match(thankYou, /robots="noindex, nofollow"/);
  assert.equal(existsSync(notFoundPath), true);
  assert.match(notFound, /robots="noindex, follow"/);
  assert.match(notFound, /href="\/"/);
  assert.match(notFound, /href="\/products\/"/);
  assert.match(notFound, /href="\/#solutions"/);
});

test("llms.txt lists only real solution routes", () => {
  assert.doesNotMatch(read("public/llms.txt"), /^- https:\/\/taicoev\.com\/solutions\/ —/m);
});
