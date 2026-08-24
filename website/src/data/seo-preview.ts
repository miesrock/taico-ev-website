export type KeywordTarget = {
  query: string;
  ownerPath: string;
  supportingArticleSlug: string;
  intent: "guide" | "technical" | "workflow";
};

export const keywordTargets: readonly KeywordTarget[] = [
  { query: "mobile EV charger buyer's guide", ownerPath: "/resources/articles/mobile-ev-charging-guide/", supportingArticleSlug: "mobile-ev-charging-guide", intent: "guide" },
  { query: "how to choose a mobile EV charger", ownerPath: "/resources/articles/mobile-ev-charging-guide/", supportingArticleSlug: "mobile-ev-charging-guide", intent: "guide" },
  { query: "how to choose a mobile EV charging solution", ownerPath: "/resources/articles/mobile-ev-charging-guide/", supportingArticleSlug: "mobile-ev-charging-guide", intent: "guide" },
  { query: "commercial mobile EV charger", ownerPath: "/products/category/mobile-charging/", supportingArticleSlug: "mobile-ev-charging-guide", intent: "guide" },
  { query: "battery powered mobile EV charger", ownerPath: "/products/category/mobile-charging/", supportingArticleSlug: "mobile-ev-charging-guide", intent: "guide" },
  { query: "portable DC fast charger", ownerPath: "/products/category/mobile-charging/", supportingArticleSlug: "mobile-ev-charging-guide", intent: "guide" },
  { query: "mobile DC fast charging", ownerPath: "/products/category/mobile-charging/", supportingArticleSlug: "mobile-ev-charging-guide", intent: "guide" },
  { query: "mobile EV charging for fleets", ownerPath: "/resources/articles/mobile-ev-charging-guide/", supportingArticleSlug: "mobile-ev-charging-guide", intent: "guide" },
  { query: "mobile EV charging without fixed grid infrastructure", ownerPath: "/solutions/mobile-ev-charger-roadside-rescue/", supportingArticleSlug: "mobile-ev-charging-guide", intent: "guide" },
  { query: "kW vs kWh mobile EV charging", ownerPath: "/resources/articles/kw-vs-kwh-mobile-ev-charging/", supportingArticleSlug: "kw-vs-kwh-mobile-ev-charging", intent: "technical" },
  { query: "mobile EV charger power vs capacity", ownerPath: "/resources/articles/kw-vs-kwh-mobile-ev-charging/", supportingArticleSlug: "kw-vs-kwh-mobile-ev-charging", intent: "technical" },
  { query: "how many kWh does a mobile EV charger need", ownerPath: "/resources/articles/kw-vs-kwh-mobile-ev-charging/", supportingArticleSlug: "kw-vs-kwh-mobile-ev-charging", intent: "technical" },
  { query: "how roadside EV charging works", ownerPath: "/resources/articles/roadside-ev-rescue-charging-workflow/", supportingArticleSlug: "roadside-ev-rescue-charging-workflow", intent: "workflow" },
  { query: "roadside EV rescue charging workflow", ownerPath: "/resources/articles/roadside-ev-rescue-charging-workflow/", supportingArticleSlug: "roadside-ev-rescue-charging-workflow", intent: "workflow" },
  { query: "emergency EV charging service", ownerPath: "/solutions/mobile-ev-charger-roadside-rescue/", supportingArticleSlug: "roadside-ev-rescue-charging-workflow", intent: "workflow" },
  { query: "EV roadside assistance charging workflow", ownerPath: "/resources/articles/roadside-ev-rescue-charging-workflow/", supportingArticleSlug: "roadside-ev-rescue-charging-workflow", intent: "workflow" },
] as const;

const stopWords = new Set(["a", "an", "and", "does", "for", "in", "of", "the", "to"]);

export function normalizeSearchText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function scoreKeywordCoverage(query: string, pageText: string) {
  const normalizedQuery = normalizeSearchText(query);
  const normalizedPage = normalizeSearchText(pageText);
  const tokens = [...new Set(normalizedQuery.split(" ").filter((token) => token && !stopWords.has(token)))];
  const matched = tokens.filter((token) => normalizedPage.includes(token));
  const ratio = tokens.length === 0 ? 0 : matched.length / tokens.length;
  const status = normalizedPage.includes(normalizedQuery)
    ? "exact"
    : ratio >= 0.8
      ? "strong"
      : ratio >= 0.5
        ? "partial"
        : "gap";

  return { status, ratio, matched: matched.length, total: tokens.length } as const;
}
