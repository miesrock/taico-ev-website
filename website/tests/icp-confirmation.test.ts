import assert from "node:assert/strict";
import test from "node:test";

import { icpRegistry } from "../src/data/icp.ts";
import { applyIcpSalesConfirmations, getIcpConfirmationIssues, matchIcp } from "../src/lib/icp/index.ts";
import type { IcpSalesConfirmation } from "../src/lib/icp/types.ts";

const roadsideContext = { companyType: "roadside_assistance", applicationSlug: "roadside-ev-rescue", productSlug: "tkmc-800" } as const;

function approvedConfirmation(relationId: string, evidenceId: string): IcpSalesConfirmation {
  return {
    id: `confirmation-${evidenceId}`,
    relationId,
    economicBuyer: "Mobility operations director",
    operatingUser: "Roadside response team",
    technicalEvaluator: "Fleet engineering",
    channelRole: "None",
    accountQualification: "Qualified EV roadside operation with deployment scope.",
    targetCountry: "Germany",
    productConfiguration: "TKMC-800 with required connector configuration.",
    commercialEvidence: {
      id: evidenceId,
      type: "sales_confirmation",
      source: "Sales call record",
      summary: "Sales confirmed the operating scenario and product relationship.",
      createdAt: "2026-07-31",
      supports: ["company_type", "application", "product_relation"],
    },
    review: { status: "approved", reviewedAt: "2026-07-31", reviewedBy: "Sales owner" },
  };
}

test("approved sales confirmation promotes one E1 relationship to E2 without changing fit or public eligibility", () => {
  const before = matchIcp(roadsideContext).matches[0];
  const applied = applyIcpSalesConfirmations(icpRegistry, [
    approvedConfirmation("rel-tkmc-800-1500-roadside-assistance", "ev-sales-roadside-001"),
  ]);
  const after = matchIcp(roadsideContext, applied.registry).matches[0];

  assert.deepEqual(applied.decisions.map((decision) => decision.action), ["promoted_to_E2"]);
  assert.equal(icpRegistry.relations[0].evidenceLevel, "E1");
  assert.equal(applied.registry.relations[0].evidenceLevel, "E2");
  assert.equal(after.fitScore, before.fitScore);
  assert.equal(after.evidenceLevel, "E2");
  assert.equal(after.eligibleForPublicUse, false);
});

test("incomplete approval cannot promote a relationship", () => {
  const incomplete = approvedConfirmation("rel-tkmc-800-1500-roadside-assistance", "ev-sales-roadside-002");
  delete incomplete.economicBuyer;
  delete incomplete.commercialEvidence;

  assert.ok(getIcpConfirmationIssues(icpRegistry, incomplete).includes("Missing economicBuyer."));
  assert.ok(getIcpConfirmationIssues(icpRegistry, incomplete).includes("Missing commercial evidence."));
  const applied = applyIcpSalesConfirmations(icpRegistry, [incomplete]);
  assert.deepEqual(applied.decisions.map((decision) => decision.action), ["invalid"]);
  assert.equal(applied.registry.relations[0].evidenceLevel, "E1");
});

test("rejected confirmation removes only that relationship from matching", () => {
  const rejected: IcpSalesConfirmation = {
    id: "confirmation-roadside-rejected",
    relationId: "rel-tkmc-800-1500-roadside-assistance",
    review: { status: "rejected", reviewedAt: "2026-07-31", reviewedBy: "Sales owner", notes: "No current commercial fit." },
  };
  const applied = applyIcpSalesConfirmations(icpRegistry, [rejected]);
  const result = matchIcp({ productSlug: "tkmc-800" }, applied.registry);

  assert.deepEqual(applied.decisions.map((decision) => decision.action), ["rejected"]);
  assert.ok(!result.matches.some((match) => match.icpSlug === "roadside-assistance-provider"));
});

test("E2 breaks otherwise equal ties without changing their fit scores", () => {
  const applied = applyIcpSalesConfirmations(icpRegistry, [
    approvedConfirmation("rel-tkmc-2000p-temporary-power", "ev-sales-temporary-power-001"),
  ]);
  const matches = matchIcp({ productSlug: "tkmc-2000p" }, applied.registry).matches;

  assert.deepEqual(matches.map((match) => match.icpSlug), ["temporary-power-provider", "mobile-ev-charging-service-provider"]);
  assert.deepEqual(matches.map((match) => match.fitScore), [12, 12]);
  assert.deepEqual(matches.map((match) => match.evidenceLevel), ["E2", "E1"]);
});
