import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { applications } from "../src/data/applications.ts";
import { getPublishedFamilies, productFamilies } from "../src/data/families.ts";
import { primaryNavigation } from "../src/data/navigation.ts";
import { getPublishedProducts, getProductsForApplication, getProductsForSolution } from "../src/data/products.ts";
import { solutions } from "../src/data/solutions.ts";
import {
  getApplicationsForProduct,
  getContentRelationIssues,
  getFamilyForProduct,
  getFamilyProducts,
  getFamilySelector,
  getSiblingProducts,
  getSolutionsForProduct,
  knowledgeHasCommercialRelation,
} from "../src/lib/content.ts";

const websiteRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath: string) => readFileSync(join(websiteRoot, relativePath), "utf8");

const articleFiles = readdirSync(join(websiteRoot, "src/content/articles"))
  .filter((name) => name.endsWith(".md"))
  .map((name) => join("src/content/articles", name));

function parseFrontmatter(source: string) {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(match, "article is missing frontmatter");
  return match[1];
}

function parseYamlList(frontmatter: string, key: string) {
  const match = frontmatter.match(new RegExp(`^${key}:\\n((?:  - .+\\n?)+)`, "m"));
  if (!match) return [];
  return [...match[1].matchAll(/- (.+)/g)].map((item) => item[1].trim());
}

function parseYamlString(frontmatter: string, key: string) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  return match?.[1]?.trim() ?? "";
}

test("product families are complete, unique, and published with products", () => {
  const families = getPublishedFamilies();
  const products = getPublishedProducts();

  assert.equal(productFamilies.length, 4);
  assert.equal(new Set(productFamilies.map((family) => family.slug)).size, 4);
  assert.deepEqual(families.map((family) => family.slug), [
    "mobile-charging",
    "charging-robot",
    "mobile-power",
    "stationary-charging",
  ]);

  for (const family of families) {
    assert.ok(family.seo.title.trim(), family.slug);
    assert.ok(family.seo.description.trim(), family.slug);
    assert.ok(family.overview.headline.trim(), family.slug);
    assert.ok(family.selectionGuide.length > 0, family.slug);
    assert.ok(getFamilyProducts(family.slug).length > 0, family.slug);
    assert.ok(family.comparisonFields.length > 0, family.slug);
  }

  for (const product of products) {
    assert.equal(getFamilyForProduct(product).slug, product.category);
  }

  assert.deepEqual(getContentRelationIssues(), []);
});

test("linking rules are derived from explicit entity relations", () => {
  const tkmc800 = getPublishedProducts().find((product) => product.slug === "tkmc-800");
  assert.ok(tkmc800);

  assert.equal(getFamilyForProduct(tkmc800).slug, "mobile-charging");
  assert.deepEqual(getFamilyProducts("mobile-charging").map((product) => product.model), ["TKMC-800", "TKMC-1500"]);
  assert.deepEqual(getSiblingProducts(tkmc800).map((product) => product.model), ["TKMC-1500"]);
  assert.deepEqual(getApplicationsForProduct(tkmc800).map((application) => application.slug), ["roadside-ev-rescue"]);
  assert.deepEqual(getSolutionsForProduct(tkmc800).map((solution) => solution.slug), ["mobile-ev-charger-roadside-rescue"]);
  assert.deepEqual(getProductsForApplication("roadside-ev-rescue").map((product) => product.model), ["TKMC-800", "TKMC-1500"]);
  assert.deepEqual(getProductsForSolution("mobile-ev-charger-roadside-rescue").map((product) => product.model), ["TKMC-800", "TKMC-1500"]);
  assert.equal("solutionSlugs" in tkmc800, false);

  const selector = getFamilySelector(getFamilyForProduct(tkmc800));
  assert.deepEqual(selector.map((item) => [item.useCase.title, item.product.model]), [
    ["Roadside EV rescue", "TKMC-800"],
    ["Higher energy demand", "TKMC-1500"],
  ]);
});

test("every published article relates to a commercial entity with resolvable slugs", () => {
  const familySlugs = new Set(getPublishedFamilies().map((family) => family.slug));
  const productSlugs = new Set(getPublishedProducts().map((product) => product.slug));
  const applicationSlugs = new Set(applications.map((application) => application.slug));

  assert.ok(articleFiles.length > 0);
  for (const articleFile of articleFiles) {
    const frontmatter = parseFrontmatter(read(articleFile));
    const relatedFamilies = parseYamlList(frontmatter, "relatedFamilies");
    const relatedApplications = parseYamlList(frontmatter, "relatedApplications");
    const relatedProducts = parseYamlList(frontmatter, "relatedProducts");
    const kind = parseYamlString(frontmatter, "kind");

    assert.match(kind, /^(buyer-guide|technical-knowledge)$/, articleFile);
    assert.equal(knowledgeHasCommercialRelation({ relatedFamilies, relatedApplications, relatedProducts }), true, articleFile);
    for (const slug of relatedFamilies) assert.ok(familySlugs.has(slug), `${articleFile} family ${slug}`);
    for (const slug of relatedApplications) assert.ok(applicationSlugs.has(slug), `${articleFile} application ${slug}`);
    for (const slug of relatedProducts) assert.ok(productSlugs.has(slug), `${articleFile} product ${slug}`);
    assert.equal(frontmatter.includes("relatedProductSlugs"), false, articleFile);
    assert.equal(frontmatter.includes("relatedSolutionSlug"), false, articleFile);
  }
});

test("public navigation and routes keep Applications off the primary IA", () => {
  assert.deepEqual(primaryNavigation.map((item) => item.key), ["products", "solutions", "resources"]);
  assert.equal(existsSync(join(websiteRoot, "src/pages/products/index.astro")), true);
  assert.equal(existsSync(join(websiteRoot, "src/pages/products/[slug].astro")), true);
  assert.equal(existsSync(join(websiteRoot, "src/pages/products/category/[slug].astro")), true);
  assert.equal(existsSync(join(websiteRoot, "src/pages/solutions/[slug].astro")), true);
  assert.equal(existsSync(join(websiteRoot, "src/pages/resources/articles/[slug].astro")), true);
  assert.equal(existsSync(join(websiteRoot, "src/pages/applications")), false);

  const redirects = read("public/_redirects");
  const config = read("astro.config.mjs");
  const header = read("src/components/Header.astro");
  const footer = read("src/components/Footer.astro");
  const familyPage = read("src/pages/products/category/[slug].astro");

  for (const application of applications) {
    assert.match(redirects, new RegExp(`/applications/${application.slug}/ /solutions/${application.solutionSlug}/ 301`));
    assert.match(config, new RegExp(`'/applications/${application.slug}': '/solutions/${application.solutionSlug}/'`));
  }
  assert.doesNotMatch(header, /data-menu-panel="applications"/);
  assert.doesNotMatch(footer, /href=\{`\/applications\//);
  assert.doesNotMatch(familyPage, /tkmc-800|TKMC-800|Roadside EV rescue/);
  assert.equal(solutions.length, applications.length);
});
