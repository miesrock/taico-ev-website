import type {
  IcpConfirmationApplication,
  IcpConfirmationDecision,
  IcpRegistry,
  IcpSalesConfirmation,
} from "./types.ts";

const reviewStatuses = new Set(["pending", "approved", "rejected", "needs_revision"]);
const evidenceTypes = new Set(["catalog", "sales_confirmation", "inquiry", "quotation", "order", "market_research"]);
const evidenceSupports = new Set(["company_type", "application", "product_relation", "buying_trigger"]);
const approvalFields = [
  "economicBuyer",
  "operatingUser",
  "technicalEvaluator",
  "channelRole",
  "accountQualification",
  "targetCountry",
  "productConfiguration",
] as const;

function reviewErrors(confirmation: IcpSalesConfirmation) {
  if (!reviewStatuses.has(confirmation.review.status)) return ["Invalid review status."];
  if (confirmation.review.status !== "pending" && (!confirmation.review.reviewedAt || !confirmation.review.reviewedBy)) {
    return ["A reviewed confirmation needs reviewer and date."];
  }
  return [];
}

/** Returns why one relationship may not be promoted from E1 to E2. */
export function getIcpConfirmationIssues(registry: IcpRegistry, confirmation: IcpSalesConfirmation): readonly string[] {
  const relation = registry.relations.find((item) => item.id === confirmation.relationId);
  const issues = [...reviewErrors(confirmation)];
  if (!confirmation.id?.trim()) issues.push("Missing confirmation id.");
  if (!relation) return [...issues, `Unknown relationship: ${confirmation.relationId}`];
  if (confirmation.review.status !== "approved") return issues;
  if (relation.evidenceLevel !== "E1") issues.push(`Only E1 relationships can be promoted to E2: ${relation.id}`);
  for (const field of approvalFields) if (!confirmation[field]?.trim()) issues.push(`Missing ${field}.`);
  const evidence = confirmation.commercialEvidence;
  if (!evidence) {
    issues.push("Missing commercial evidence.");
  } else {
    if (evidence.type !== "sales_confirmation") issues.push("E2 requires sales_confirmation evidence.");
    if (!evidence.id || registry.evidence.some((item) => item.id === evidence.id)) issues.push(`Duplicate or missing evidence id: ${evidence.id}`);
    if (!evidence.source || !evidence.summary || !evidence.createdAt) issues.push("Commercial evidence needs source, summary, and date.");
    if (!evidenceTypes.has(evidence.type)) issues.push(`Invalid commercial evidence type: ${evidence.type}`);
    if (!Array.isArray(evidence.supports) || !evidence.supports.length || evidence.supports.some((support) => !evidenceSupports.has(support))) {
      issues.push("Commercial evidence has invalid supports.");
    }
    if (!evidence.supports.includes("product_relation")) issues.push("Commercial evidence must support the product relationship.");
  }
  return issues;
}

function decisionFor(registry: IcpRegistry, confirmation: IcpSalesConfirmation): IcpConfirmationDecision {
  const errors = getIcpConfirmationIssues(registry, confirmation);
  if (errors.length) return { confirmationId: confirmation.id, relationId: confirmation.relationId, action: "invalid", errors };
  if (confirmation.review.status === "approved") return { confirmationId: confirmation.id, relationId: confirmation.relationId, action: "promoted_to_E2", errors };
  if (confirmation.review.status === "rejected") return { confirmationId: confirmation.id, relationId: confirmation.relationId, action: "rejected", errors };
  if (confirmation.review.status === "needs_revision") return { confirmationId: confirmation.id, relationId: confirmation.relationId, action: "needs_revision", errors };
  return { confirmationId: confirmation.id, relationId: confirmation.relationId, action: "no_change", errors };
}

/**
 * Applies validated internal review records without mutating the source registry.
 * ponytail: persistence stays outside this static website until a sales system of record is approved.
 */
export function applyIcpSalesConfirmations(registry: IcpRegistry, confirmations: readonly IcpSalesConfirmation[]): IcpConfirmationApplication {
  let next: IcpRegistry = { ...registry, relations: [...registry.relations], evidence: [...registry.evidence] };
  const decisions: IcpConfirmationDecision[] = [];

  for (const confirmation of confirmations) {
    const decision = decisionFor(next, confirmation);
    decisions.push(decision);
    if (decision.action === "invalid" || decision.action === "no_change") continue;
    if (decision.action === "promoted_to_E2") {
      next = {
        ...next,
        relations: next.relations.map((relation) => relation.id === confirmation.relationId
          ? { ...relation, evidenceLevel: "E2", evidenceIds: [...relation.evidenceIds, confirmation.commercialEvidence!.id], review: confirmation.review }
          : relation),
        evidence: [...next.evidence, confirmation.commercialEvidence!],
      };
    } else {
      next = {
        ...next,
        relations: next.relations.map((relation) => relation.id === confirmation.relationId ? { ...relation, review: confirmation.review } : relation),
      };
    }
  }

  return { registry: next, decisions };
}
