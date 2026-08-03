import assert from "node:assert/strict";
import test from "node:test";

import { icpEvidence, icpRegistry, icpRelations, icps } from "../src/data/icp.ts";
import { assertIcpRegistry, getIcpRegistryIssues } from "../src/lib/icp/index.ts";
import type { IcpRegistry } from "../src/lib/icp/types.ts";

test("keeps all catalog-backed ICP candidates internal and valid", () => {
  assert.doesNotThrow(() => assertIcpRegistry(icpRegistry));
  assert.deepEqual(getIcpRegistryIssues(icpRegistry), []);
  assert.equal(icps.length, 15);
  assert.equal(icpRelations.length, 18);
  assert.equal(icpEvidence.length, 18);
  assert.ok(icps.every((icp) => icp.evidenceLevel === "E1" && icp.review.status === "pending" && !icp.eligibleForPublicUse));
  assert.ok(icpRelations.every((relation) => relation.evidenceLevel === "E1" && relation.evidenceIds.length === 1));
});

test("blocks malformed governance values and stale catalog references", () => {
  const invalid = structuredClone(icpRegistry) as unknown as {
    icps: Array<Record<string, unknown>>;
    relations: Array<Record<string, unknown>>;
    evidence: Array<Record<string, unknown>>;
  };
  invalid.icps[0].evidenceLevel = "E9";
  invalid.icps[0].review = { status: "not-reviewed" };
  invalid.icps[1].evidenceLevel = "E0";
  invalid.icps[1].status = "active";
  invalid.relations[0].strength = "tertiary";
  invalid.relations[0].relatedProductSlugs = ["tkmc-9999"];
  invalid.evidence.push({ ...invalid.evidence[0] });

  const issues = getIcpRegistryIssues(invalid as unknown as IcpRegistry);
  assert.ok(issues.some((issue) => issue.includes("Invalid evidence level")));
  assert.ok(issues.some((issue) => issue.includes("Invalid review status")));
  assert.ok(issues.some((issue) => issue.includes("E0 ICP cannot be active")));
  assert.ok(issues.some((issue) => issue.includes("Invalid relation strength")));
  assert.ok(issues.some((issue) => issue.includes("Unknown product tkmc-9999")));
  assert.ok(issues.some((issue) => issue.includes("Duplicate evidence id")));
});
