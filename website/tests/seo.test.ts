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
  assert.match(layout, /property="og:title"/);
  assert.match(layout, /property="og:description"/);
  assert.match(layout, /property="og:url"/);
  assert.match(layout, /property="og:type"/);
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
  const llms = read("public/llms.txt");
  assert.match(llms, /https:\/\/taicoev\.com\/solutions\/mobile-ev-charger-roadside-rescue\//);
  assert.doesNotMatch(llms, /https:\/\/taicoev\.com\/solutions\/emergency-ev-charging\//);
});

test("roadside rescue solution owns one canonical route and redirects the legacy slug", () => {
  const page = read("src/pages/solutions/[slug].astro");
  const redirects = read("public/_redirects");
  const solutions = read("src/data/solutions.ts");

  assert.match(page, /canonicalPath={`\/solutions\/\$\{solution\.slug\}\/`}/);
  assert.match(page, /getSolutionStructuredData\(solution, Astro\.site \?\? "https:\/\/taicoev\.com", faq\)/);
  assert.match(page, /aria-label="Breadcrumb"/);
  assert.match(page, /id="recommended-configurations"/);
  assert.match(page, /Request System Configuration/);
  assert.match(page, /Explore TKMC Systems/);
  assert.match(page, /details class=/);
  assert.match(solutions, /slug: "mobile-ev-charger-roadside-rescue"/);
  assert.doesNotMatch(solutions, /slug: "emergency-ev-charging"/);
  assert.match(redirects, /\/solutions\/emergency-ev-charging\/ \/solutions\/mobile-ev-charger-roadside-rescue\/ 301/);
});

test("resource articles use one validated Markdown collection and real public routes", () => {
  const config = read("src/content.config.ts");
  const indexPage = read("src/pages/resources/articles/index.astro");
  const detailPage = read("src/pages/resources/articles/[slug].astro");
  const navigation = read("src/data/navigation.ts");
  const llms = read("public/llms.txt");
  const articleFiles = [
    "src/content/articles/mobile-ev-charging-guide.md",
    "src/content/articles/kw-vs-kwh-mobile-ev-charging.md",
    "src/content/articles/roadside-ev-rescue-charging-workflow.md",
  ];

  assert.match(config, /defineCollection/);
  assert.match(config, /glob\(\{ pattern: "\*\*\/\*\.md", base: "\.\/src\/content\/articles" \}\)/);
  assert.match(indexPage, /getCollection\("articles"\)/);
  assert.match(detailPage, /render\(article\)/);
  assert.match(detailPage, /"@type": "Article"/);
  assert.match(detailPage, /getProduct\(slug\)/);
  assert.match(navigation, /href: "\/resources\/articles\/"/);

  for (const articleFile of articleFiles) {
    assert.equal(existsSync(join(websiteRoot, articleFile)), true, articleFile);
  }
  assert.match(llms, /\/resources\/articles\/mobile-ev-charging-guide\//);
  assert.match(llms, /\/resources\/articles\/kw-vs-kwh-mobile-ev-charging\//);
  assert.match(llms, /\/resources\/articles\/roadside-ev-rescue-charging-workflow\//);
});

test("resource articles expose generated navigation, quick answers, visible FAQs, and specific CTAs", () => {
  const config = read("src/content.config.ts");
  const detailPage = read("src/pages/resources/articles/[slug].astro");
  const articleFiles = [
    "src/content/articles/mobile-ev-charging-guide.md",
    "src/content/articles/kw-vs-kwh-mobile-ev-charging.md",
    "src/content/articles/roadside-ev-rescue-charging-workflow.md",
  ];

  assert.match(config, /quickAnswer: z\.string\(\)\.optional\(\)/);
  assert.match(config, /cta: z\.object\(\{ title: z\.string\(\), body: z\.string\(\) \}\)\.optional\(\)/);
  assert.match(config, /faq: z\.array\(z\.object\(\{ question: z\.string\(\), answer: z\.string\(\) \}\)\)\.default\(\[\]\)/);
  assert.match(detailPage, /const \{ Content, headings \} = await render\(article\)/);
  assert.match(detailPage, /headings\.filter\(\(heading\) => heading\.depth === 2\)/);
  assert.match(detailPage, /aria-label="On this page"/);
  assert.match(detailPage, /lg:sticky lg:top-24/);
  assert.match(detailPage, /id="quick-answer"/);
  assert.match(detailPage, /id="faq"/);
  assert.match(detailPage, /"@type": "FAQPage"/);
  assert.match(detailPage, /mainEntity: article\.data\.faq\.map/);
  assert.match(detailPage, /article\.data\.faq\.map\(\(item\) => <details/);
  assert.match(detailPage, /title=\{ctaTitle\} body=\{ctaBody\}/);

  for (const articleFile of articleFiles) {
    const article = read(articleFile);
    assert.match(article, /^quickAnswer:/m, articleFile);
    assert.match(article, /^cta:/m, articleFile);
    assert.match(article, /^faq:/m, articleFile);
    assert.doesNotMatch(article, /15 minutes adds approximately 50 km of range/);
  }
});
