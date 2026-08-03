import { applications } from "../../data/applications.ts";
import { products } from "../../data/products.ts";
import { solutions } from "../../data/solutions.ts";
import { companyTypes, type IcpRegistry, type IcpSignalType } from "./types.ts";

const evidenceLevels = new Set(["E0", "E1", "E2", "E3", "E4"]);
const reviewStatuses = new Set(["pending", "approved", "rejected", "needs_revision"]);
const relationStrengths = new Set(["primary", "secondary"]);
const evidenceTypes = new Set(["catalog", "sales_confirmation", "inquiry", "quotation", "order", "market_research"]);
const evidenceSupports = new Set(["company_type", "application", "product_relation", "buying_trigger"]);
const signalTypes = new Set<IcpSignalType>(["companyType", "application", "product", "solution"]);
const statuses = new Set(["candidate", "active", "archived"]);
const productSlugs = new Set(products.map((product) => product.slug));
const applicationSlugs = new Set(applications.map((application) => application.slug));
const solutionSlugs = new Set(solutions.map((solution) => solution.slug));
const knownCompanyTypes = new Set<string>(companyTypes);

function duplicateIssues(values: readonly { id: string }[], label: string) {
  const seen = new Set<string>();
  return values.flatMap(({ id }) => (seen.has(id) ? [`Duplicate ${label}: ${id}`] : (seen.add(id), [])));
}

function unknownSlugIssues(values: readonly string[], known: ReadonlySet<string>, label: string, relationId: string) {
  return values.filter((value) => !known.has(value)).map((value) => `Unknown ${label} ${value} on ${relationId}`);
}

/** Validates data only; the matcher deliberately stays separate and side-effect free. */
export function getIcpRegistryIssues(registry: IcpRegistry): string[] {
  const issues = [
    ...duplicateIssues(registry.icps, "ICP id"),
    ...duplicateIssues(registry.relations, "relation id"),
    ...duplicateIssues(registry.evidence, "evidence id"),
  ];
  const icpSlugs = new Set<string>();
  const evidenceIds = new Set<string>();

  for (const evidence of registry.evidence) {
    if (!evidenceTypes.has(evidence.type)) issues.push(`Invalid evidence type on ${evidence.id}`);
    if (!Array.isArray(evidence.supports) || !evidence.supports.length) issues.push(`Missing evidence support on ${evidence.id}`);
    for (const support of evidence.supports ?? []) {
      if (!evidenceSupports.has(support)) issues.push(`Invalid evidence support ${support} on ${evidence.id}`);
    }
    evidenceIds.add(evidence.id);
  }

  for (const icp of registry.icps) {
    if (icpSlugs.has(icp.slug)) issues.push(`Duplicate ICP slug: ${icp.slug}`);
    icpSlugs.add(icp.slug);
    if (!evidenceLevels.has(icp.evidenceLevel)) issues.push(`Invalid evidence level on ${icp.slug}`);
    if (!statuses.has(icp.status)) issues.push(`Invalid ICP status on ${icp.slug}`);
    if (icp.evidenceLevel === "E0" && icp.status === "active") issues.push(`E0 ICP cannot be active: ${icp.slug}`);
    if (!reviewStatuses.has(icp.review.status)) issues.push(`Invalid review status on ${icp.slug}`);
    if (icp.review.status !== "pending" && (!icp.review.reviewedAt || !icp.review.reviewedBy)) {
      issues.push(`Reviewed ICP needs reviewer and date: ${icp.slug}`);
    }
    if (!icp.companyTypes.length) issues.push(`Missing company type on ${icp.slug}`);
    for (const companyType of icp.companyTypes) {
      if (!knownCompanyTypes.has(companyType)) issues.push(`Unknown company type ${companyType} on ${icp.slug}`);
    }
  }

  for (const relation of registry.relations) {
    if (!icpSlugs.has(relation.icpSlug)) issues.push(`Unknown ICP ${relation.icpSlug} on ${relation.id}`);
    if (!evidenceLevels.has(relation.evidenceLevel)) issues.push(`Invalid evidence level on ${relation.id}`);
    if (!relationStrengths.has(relation.strength)) issues.push(`Invalid relation strength on ${relation.id}`);
    if (![1, 2, 3, 4, 5].includes(relation.scenarioFit)) issues.push(`Invalid scenario fit on ${relation.id}`);
    const relatedProducts = relation.relatedProductSlugs ?? [];
    const relatedApplications = relation.relatedApplicationSlugs ?? [];
    const relatedSolutions = relation.relatedSolutionSlugs ?? [];
    if (!relatedProducts.length && !relatedApplications.length && !relatedSolutions.length) issues.push(`Missing relationship signals on ${relation.id}`);
    issues.push(...unknownSlugIssues(relatedProducts, productSlugs, "product", relation.id));
    issues.push(...unknownSlugIssues(relatedApplications, applicationSlugs, "application", relation.id));
    issues.push(...unknownSlugIssues(relatedSolutions, solutionSlugs, "solution", relation.id));
    if (!relation.evidenceIds.length) issues.push(`Missing evidence on ${relation.id}`);
    if (relation.review && !reviewStatuses.has(relation.review.status)) issues.push(`Invalid review status on ${relation.id}`);
    if (relation.review && relation.review.status !== "pending" && (!relation.review.reviewedAt || !relation.review.reviewedBy)) {
      issues.push(`Reviewed relationship needs reviewer and date: ${relation.id}`);
    }
    for (const evidenceId of relation.evidenceIds) {
      if (!evidenceIds.has(evidenceId)) issues.push(`Unknown evidence ${evidenceId} on ${relation.id}`);
    }
    for (const negativeSignal of relation.negativeSignals ?? []) {
      if (!signalTypes.has(negativeSignal.field)) issues.push(`Invalid negative signal field on ${relation.id}`);
      if (!negativeSignal.values.length || negativeSignal.penalty <= 0) issues.push(`Invalid negative signal on ${relation.id}`);
    }
  }

  for (const icp of registry.icps.filter((item) => item.status === "active")) {
    const hasValidRelation = registry.relations.some((relation) =>
      relation.icpSlug === icp.slug
      && relation.evidenceLevel !== "E0"
      && relation.review?.status !== "rejected"
      && relation.evidenceIds.some((evidenceId) => evidenceIds.has(evidenceId))
      && relation.relatedProductSlugs.every((slug) => productSlugs.has(slug))
      && relation.relatedApplicationSlugs.every((slug) => applicationSlugs.has(slug))
      && relation.relatedSolutionSlugs.every((slug) => solutionSlugs.has(slug))
      && (relation.relatedProductSlugs.length || relation.relatedApplicationSlugs.length || relation.relatedSolutionSlugs.length),
    );
    if (!hasValidRelation) issues.push(`Active ICP needs a valid relationship and evidence: ${icp.slug}`);
  }

  return issues;
}

export function assertIcpRegistry(registry: IcpRegistry) {
  const issues = getIcpRegistryIssues(registry);
  if (issues.length) throw new Error(`Invalid ICP registry:\n${issues.join("\n")}`);
}
