import assert from "node:assert/strict";
import test from "node:test";

import { icpHypotheses, icpHypothesisRegistry } from "../src/data/icp-hypotheses.ts";
import { icpRegistry } from "../src/data/icp.ts";
import {
  applyIcpSalesConfirmations,
  assessIcpHypothesis,
  buildConfirmationCandidate,
  validateIcpHypothesisRegistry,
  validateIcpObservation,
} from "../src/lib/icp/index.ts";
import type { IcpHypothesisRegistry, IcpObservationSource, IcpSalesConfirmation, IcpValidationObservation } from "../src/lib/icp/types.ts";

const hypothesis = icpHypotheses[0];

function answers() {
  return {
    "company-type": "confirmed",
    "use-case": "confirmed",
    "current-workaround": "Current workflow was described.",
    "product-constraint": "Connector and deployment constraints were described.",
  };
}

function observation(
  id: string,
  organizationRef: string,
  source: IcpObservationSource = "sales_call",
  direction: IcpValidationObservation["direction"] = "supports",
  observationAnswers = answers(),
): IcpValidationObservation {
  return {
    id,
    relationshipId: hypothesis.relationshipId,
    organizationRef,
    source,
    observedAt: "2026-07-31",
    recordedBy: "Internal sales owner",
    answers: observationAnswers,
    direction,
    summary: "Internal test observation.",
  };
}

test("registers one internal E1 hypothesis for each current relationship", () => {
  const result = validateIcpHypothesisRegistry(icpHypothesisRegistry, icpRegistry);

  assert.equal(result.decision, "valid");
  assert.deepEqual(result.errors, []);
  assert.equal(icpHypotheses.length, 18);
  assert.deepEqual(icpHypotheses.map((item) => item.relationshipId).sort(), icpRegistry.relations.map((item) => item.id).sort());
  assert.ok(icpHypotheses.every((item) => item.status === "unvalidated" && item.evidenceLevel === "E1" && !item.eligibleForPublicUse));
});

test("rejects duplicate hypotheses and invalid question option combinations", () => {
  const invalid = structuredClone(icpHypothesisRegistry) as unknown as { hypotheses: Array<Record<string, unknown>> };
  invalid.hypotheses.push({ ...invalid.hypotheses[0] });
  const question = (invalid.hypotheses[1].validationQuestions as Array<Record<string, unknown>>)[0];
  question.answerType = "text";

  const result = validateIcpHypothesisRegistry(invalid as unknown as IcpHypothesisRegistry, icpRegistry);

  assert.equal(result.decision, "invalid_input");
  assert.ok(result.errors.some((item) => item.code === "duplicate_id"));
  assert.ok(result.errors.some((item) => item.code === "duplicate_relationship"));
  assert.ok(result.errors.some((item) => item.code === "invalid_options"));
});

test("rejects unknown relationships and question ids as structured invalid input", () => {
  const unknownRelationship = { ...observation("obs-unknown-relationship", "ORG-001"), relationshipId: "rel-unknown" };
  const unknownQuestion = observation("obs-unknown-question", "ORG-001", "sales_call", "supports", { ...answers(), "not-a-question": "value" });

  const relationshipResult = validateIcpObservation(unknownRelationship, icpHypothesisRegistry, icpRegistry);
  const questionResult = validateIcpObservation(unknownQuestion, icpHypothesisRegistry, icpRegistry);

  assert.equal(relationshipResult.decision, "invalid_input");
  assert.ok(relationshipResult.errors.some((item) => item.code === "unknown_relationship"));
  assert.equal(questionResult.decision, "invalid_input");
  assert.ok(questionResult.errors.some((item) => item.code === "unknown_question"));
});

test("keeps incomplete, indirect, and same-organization evidence out of review readiness", () => {
  const incomplete = assessIcpHypothesis(hypothesis, [
    observation("obs-incomplete", "ORG-001", "inquiry", "supports", { "company-type": "confirmed" }),
  ]);
  const indirect = assessIcpHypothesis(hypothesis, [observation("obs-research", "ORG-001", "market_research")]);
  const indirectGaps = assessIcpHypothesis(hypothesis, [
    observation("obs-direct-a", "ORG-001", "sales_call", "supports", {}),
    observation("obs-direct-b", "ORG-002", "customer_interview", "supports", {}),
    observation("obs-indirect-gaps", "ORG-003", "market_research", "supports"),
  ]);
  const sameOrganization = assessIcpHypothesis(hypothesis, [
    observation("obs-same-2", "ORG-001", "customer_interview"),
    observation("obs-same-1", "ORG-001", "sales_call"),
  ]);

  assert.equal(incomplete.readiness, "in_progress");
  assert.deepEqual(incomplete.missingSignals, ["current_workaround", "product_constraint", "use_case"]);
  assert.equal(indirect.directObservationCount, 0);
  assert.equal(indirect.independentOrganizationCount, 0);
  assert.equal(indirect.eligibleForE2Review, false);
  assert.equal(indirectGaps.readiness, "in_progress");
  assert.deepEqual(indirectGaps.missingSignals, ["company_type", "current_workaround", "product_constraint", "use_case"]);
  assert.equal(sameOrganization.readiness, "in_progress");
  assert.equal(sameOrganization.independentOrganizationCount, 1);
});

test("assesses support, contradictions, and deterministic evidence order without mutation", () => {
  const supporting = [
    observation("obs-support-b", "ORG-002", "customer_interview"),
    observation("obs-support-a", "ORG-001", "sales_call"),
  ];
  const before = structuredClone(supporting);
  const ready = assessIcpHypothesis(hypothesis, supporting);
  const reordered = assessIcpHypothesis(hypothesis, [...supporting].reverse());
  const blocked = assessIcpHypothesis(hypothesis, [...supporting, observation("obs-conflict", "ORG-003", "sales_call", "contradicts")]);
  const contradicted = assessIcpHypothesis(hypothesis, [
    observation("obs-conflict-b", "ORG-002", "customer_interview", "contradicts"),
    observation("obs-conflict-a", "ORG-001", "sales_call", "contradicts"),
  ]);

  assert.equal(ready.readiness, "ready_for_review");
  assert.equal(ready.eligibleForE2Review, true);
  assert.deepEqual(ready.supportingObservationIds, ["obs-support-a", "obs-support-b"]);
  assert.deepEqual(ready, reordered);
  assert.deepEqual(supporting, before);
  assert.equal(blocked.readiness, "in_progress");
  assert.equal(blocked.eligibleForE2Review, false);
  assert.deepEqual(blocked.contradictingObservationIds, ["obs-conflict"]);
  assert.equal(contradicted.readiness, "contradicted");
});

test("builds a Milestone C candidate but never promotes the relationship itself", () => {
  const observations = [
    observation("obs-review-b", "ORG-002", "customer_interview"),
    observation("obs-review-a", "ORG-001", "sales_call"),
  ];
  const assessment = assessIcpHypothesis(hypothesis, observations);
  const candidate = buildConfirmationCandidate(assessment, observations);

  assert.ok(candidate);
  assert.equal(candidate.relationshipId, hypothesis.relationshipId);
  assert.deepEqual(candidate.supportingObservationIds, ["obs-review-a", "obs-review-b"]);
  assert.equal(icpRegistry.relations[0].evidenceLevel, "E1");
  assert.equal(buildConfirmationCandidate(assessIcpHypothesis(hypothesis, []), []), null);

  const manualConfirmation: IcpSalesConfirmation = {
    id: "confirmation-from-validation-test",
    relationId: candidate.relationshipId,
    economicBuyer: "Test economic buyer",
    operatingUser: "Test operating user",
    technicalEvaluator: "Test technical evaluator",
    channelRole: "None",
    accountQualification: candidate.summary,
    targetCountry: "Test country",
    productConfiguration: "Test configuration",
    commercialEvidence: {
      id: "ev-sales-validation-test",
      type: "sales_confirmation",
      source: "Manual Milestone C review",
      summary: candidate.summary,
      createdAt: "2026-07-31",
      supports: ["company_type", "application", "product_relation"],
    },
    review: { status: "approved", reviewedAt: "2026-07-31", reviewedBy: "Sales owner" },
  };
  const applied = applyIcpSalesConfirmations(icpRegistry, [manualConfirmation]);

  assert.equal(applied.registry.relations[0].evidenceLevel, "E2");
  assert.equal(applied.registry.relations[0].review?.status, "approved");
  assert.equal(applied.registry.icps[0].eligibleForPublicUse, false);
  assert.equal(validateIcpHypothesisRegistry(icpHypothesisRegistry, applied.registry).decision, "valid");
});
