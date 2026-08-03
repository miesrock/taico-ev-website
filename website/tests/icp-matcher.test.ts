import assert from "node:assert/strict";
import test from "node:test";

import { icpRegistry } from "../src/data/icp.ts";
import { matchIcp } from "../src/lib/icp/index.ts";
import type { IcpMatchContext, IcpRegistry } from "../src/lib/icp/types.ts";

const roadsideContext = {
  companyType: "roadside_assistance",
  applicationSlug: "roadside-ev-rescue",
  productSlug: "tkmc-800",
} as const;

test("matches roadside context strongly without promoting it for public use", () => {
  const result = matchIcp(roadsideContext);
  assert.equal(result.decision, "matched");
  assert.deepEqual(result.matches[0].icpSlug, "roadside-assistance-provider");
  assert.equal(result.matches[0].fitScore, 90);
  assert.equal(result.matches[0].fitBand, "strong");
  assert.equal(result.matches[0].evidenceLevel, "E1");
  assert.equal(result.matches[0].eligibleForPublicUse, false);
});

test("a single product remains weak", () => {
  const result = matchIcp({ productSlug: "tkmc-800" });
  assert.equal(result.matches[0].fitBand, "weak");
  assert.equal(result.matches[0].fitScore, 20);
  assert.ok(result.matches.every((match) => match.fitBand !== "strong"));
});

test("ambiguous candidates use deterministic tie ordering", () => {
  const context = { productSlug: "tkmc-2000p" };
  const first = matchIcp(context);
  const second = matchIcp(context);
  assert.equal(first.decision, "ambiguous");
  assert.deepEqual(first, second);
  assert.deepEqual(first.matches.map((match) => match.icpSlug), ["mobile-ev-charging-service-provider", "temporary-power-provider"]);
});

test("an explicit conflict cannot create a high-confidence result", () => {
  const registry = structuredClone(icpRegistry) as unknown as IcpRegistry;
  const roadside = registry.relations.find((relation) => relation.icpSlug === "roadside-assistance-provider")! as unknown as {
    negativeSignals: [{ field: "companyType"; values: ["charging_operator"]; penalty: 60 }];
  };
  roadside.negativeSignals = [{ field: "companyType", values: ["charging_operator"], penalty: 60 }];

  const result = matchIcp({ companyType: "charging_operator", applicationSlug: "roadside-ev-rescue", productSlug: "tkmc-800" }, registry);
  assert.ok(result.matches.every((match) => match.fitBand !== "strong"));
  assert.ok(!result.matches.some((match) => match.icpSlug === "roadside-assistance-provider"));
});

test("empty scoreable context declines to judge", () => {
  assert.equal(matchIcp({ country: "Germany", rawText: "Need a charger" }).decision, "insufficient_context");
});

test("unknown controlled values return structured invalid input errors", () => {
  const result = matchIcp({
    companyType: "unknown" as unknown as IcpMatchContext["companyType"],
    productSlug: "tkmc-9999",
    applicationSlug: "unknown-application",
    solutionSlug: "unknown-solution",
  });
  assert.equal(result.decision, "invalid_input");
  assert.deepEqual(result.errors.map((error) => error.field), ["companyType", "applicationSlug", "productSlug", "solutionSlug"]);
  assert.deepEqual(result.matches, []);
});

test("rejected and E0 rules do not participate", () => {
  const registry = structuredClone(icpRegistry) as unknown as IcpRegistry;
  const roadside = registry.icps.find((icp) => icp.slug === "roadside-assistance-provider")! as { review: { status: "rejected"; reviewedAt: string; reviewedBy: string } };
  roadside.review = { status: "rejected", reviewedAt: "2026-07-31", reviewedBy: "Sales" };
  const automotive = registry.icps.find((icp) => icp.slug === "automotive-club")! as { evidenceLevel: "E0" };
  automotive.evidenceLevel = "E0";

  const result = matchIcp(roadsideContext, registry);
  assert.ok(!result.matches.some((match) => match.icpSlug === "roadside-assistance-provider" || match.icpSlug === "automotive-club"));
});

test("fit score and evidence level remain separate fields", () => {
  const match = matchIcp(roadsideContext).matches[0];
  assert.equal(match.fitScore, 90);
  assert.equal(match.evidenceLevel, "E1");
});

test("missing and unmatched signals are distinct", () => {
  const result = matchIcp({ companyType: "charging_operator", productSlug: "tkmc-800" });
  const roadside = result.matches.find((match) => match.icpSlug === "roadside-assistance-provider")!;
  assert.deepEqual(roadside.missingSignals, ["application", "solution"]);
  assert.deepEqual(roadside.unmatchedSignals, [{ type: "companyType", value: "charging_operator" }]);
});

test("same input always returns the same result", () => {
  assert.deepEqual(matchIcp(roadsideContext), matchIcp(roadsideContext));
});
