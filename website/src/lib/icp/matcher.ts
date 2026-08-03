import { applications } from "../../data/applications.ts";
import { icpRegistry } from "../../data/icp.ts";
import { products } from "../../data/products.ts";
import { solutions } from "../../data/solutions.ts";
import {
  ICP_RULE_VERSION,
  companyTypes,
  type EvidenceLevel,
  type IcpFitBand,
  type IcpInputError,
  type IcpMatch,
  type IcpMatchContext,
  type IcpMatchResult,
  type IcpMatchedSignal,
  type IcpRelation,
  type IcpRelationStrength,
  type IcpRegistry,
  type IcpSignalType,
  type IcpUnmatchedSignal,
} from "./types.ts";

const weights = { companyType: 40, application: 30, product: 20, solution: 10 } as const;
const evidenceRank: Record<EvidenceLevel, number> = { E0: 0, E1: 1, E2: 2, E3: 3, E4: 4 };
const companyTypeSet = new Set<string>(companyTypes);
const applicationSlugSet = new Set(applications.map((application) => application.slug));
const productSlugSet = new Set(products.map((product) => product.slug));
const solutionSlugSet = new Set(solutions.map((solution) => solution.slug));

type ContextSignal = { type: IcpSignalType; value: string };

function contextSignals(context: IcpMatchContext): readonly ContextSignal[] {
  return [
    context.companyType && { type: "companyType" as const, value: context.companyType },
    context.applicationSlug && { type: "application" as const, value: context.applicationSlug },
    context.productSlug && { type: "product" as const, value: context.productSlug },
    context.solutionSlug && { type: "solution" as const, value: context.solutionSlug },
  ].filter((signal): signal is ContextSignal => Boolean(signal));
}

function invalidInputErrors(context: IcpMatchContext): readonly IcpInputError[] {
  const checks = [
    ["companyType", context.companyType, companyTypeSet, "unknown_company_type", "Unknown company type"] as const,
    ["applicationSlug", context.applicationSlug, applicationSlugSet, "unknown_slug", "Unknown application slug"] as const,
    ["productSlug", context.productSlug, productSlugSet, "unknown_slug", "Unknown product slug"] as const,
    ["solutionSlug", context.solutionSlug, solutionSlugSet, "unknown_slug", "Unknown solution slug"] as const,
  ];

  return checks.flatMap(([field, value, known, code, label]) =>
    value && !known.has(value) ? [{ field, code, value, message: `${label}: ${value}` }] : [],
  );
}

function relationValues(relation: IcpRelation, type: IcpSignalType) {
  if (type === "application") return relation.relatedApplicationSlugs;
  if (type === "product") return relation.relatedProductSlugs;
  if (type === "solution") return relation.relatedSolutionSlugs;
  return [];
}

function scoreFor(type: IcpSignalType, strength: IcpRelationStrength) {
  return weights[type] * (strength === "primary" ? 1 : 0.6);
}

function fitBand(fitScore: number): IcpFitBand {
  if (fitScore >= 70) return "strong";
  if (fitScore >= 40) return "possible";
  return "weak";
}

function relatedProducts(relations: readonly IcpRelation[]) {
  return [...new Set(relations.flatMap((relation) => relation.relatedProductSlugs))].sort();
}

function highestEvidenceLevel(fallback: EvidenceLevel, relations: readonly IcpRelation[]) {
  return relations.reduce<EvidenceLevel>((highest, relation) => evidenceRank[relation.evidenceLevel] > evidenceRank[highest] ? relation.evidenceLevel : highest, fallback);
}

function warningsFor(context: IcpMatchContext) {
  const deferred = ["country", "rawText", "purchaseTimeline"].filter((field) => context[field as keyof IcpMatchContext]);
  return deferred.length ? [`v0.1 does not score ${deferred.join(", ")}.`] : [];
}

function matchProfile(context: IcpMatchContext, registry: IcpRegistry, profile: IcpRegistry["icps"][number]): IcpMatch | undefined {
  if (profile.evidenceLevel === "E0" || profile.review.status === "rejected" || profile.status === "archived") return undefined;
  const relations = registry.relations.filter((relation) =>
    relation.icpSlug === profile.slug && relation.evidenceLevel !== "E0" && relation.review?.status !== "rejected",
  );
  const signals = contextSignals(context);
  const matchedSignals: IcpMatchedSignal[] = [];
  const matchedRelations = new Set<IcpRelation>();

  if (context.companyType && profile.companyTypes.includes(context.companyType)) {
    matchedSignals.push({ type: "companyType", value: context.companyType, score: weights.companyType, strength: "primary" });
  }

  for (const signal of signals.filter((item) => item.type !== "companyType")) {
    const matchingRelations = relations.filter((relation) => relationValues(relation, signal.type).includes(signal.value));
    matchingRelations.forEach((relation) => matchedRelations.add(relation));
    const strength = matchingRelations.some((relation) => relation.strength === "primary") ? "primary" : matchingRelations[0]?.strength;
    if (strength) matchedSignals.push({ type: signal.type, value: signal.value, score: scoreFor(signal.type, strength), strength });
  }

  const penalties = relations.flatMap((relation) => relation.negativeSignals ?? []).filter((negativeSignal) =>
    signals.some((signal) => signal.type === negativeSignal.field && negativeSignal.values.includes(signal.value)),
  );
  const fitScore = Math.max(0, Math.min(100, matchedSignals.reduce((total, signal) => total + signal.score, 0) - penalties.reduce((total, signal) => total + signal.penalty, 0)));
  if (!fitScore) return undefined;

  const matchedTypes = new Set(matchedSignals.map((signal) => signal.type));
  const missingSignals = (["companyType", "application", "product", "solution"] as const).filter((type) => !signals.some((signal) => signal.type === type));
  const unmatchedSignals: IcpUnmatchedSignal[] = signals
    .filter((signal) => !matchedTypes.has(signal.type))
    .map((signal) => ({ type: signal.type, value: signal.value }));
  const warnings = [
    highestEvidenceLevel(profile.evidenceLevel, [...matchedRelations]) === "E1"
      ? "Internal candidate rule; sales confirmation is still required."
      : "Internal sales-confirmed rule; public use remains blocked.",
    ...penalties.map((signal) => `Conflict penalty applied: -${signal.penalty}.`),
  ];

  return {
    icpSlug: profile.slug,
    fitScore,
    fitBand: fitBand(fitScore),
    evidenceLevel: highestEvidenceLevel(profile.evidenceLevel, [...matchedRelations]),
    matchedSignals,
    missingSignals,
    unmatchedSignals,
    relatedProductSlugs: relatedProducts(relations),
    ruleVersion: ICP_RULE_VERSION,
    warnings,
    eligibleForPublicUse: false,
  };
}

function compareMatches(left: IcpMatch, right: IcpMatch) {
  const primaryHits = (match: IcpMatch) => match.matchedSignals.filter((signal) => signal.strength === "primary").length;
  return right.fitScore - left.fitScore
    || evidenceRank[right.evidenceLevel] - evidenceRank[left.evidenceLevel]
    || primaryHits(right) - primaryHits(left)
    || left.icpSlug.localeCompare(right.icpSlug);
}

/**
 * Pure, deterministic, internal-only matching.
 * ponytail: raw text remains unscored until approved evidence defines its vocabulary.
 */
export function matchIcp(context: IcpMatchContext, registry: IcpRegistry = icpRegistry): IcpMatchResult {
  const errors = invalidInputErrors(context);
  const warnings = warningsFor(context);
  if (errors.length) {
    return { decision: "invalid_input", matches: [], errors, ruleVersion: ICP_RULE_VERSION, warnings, eligibleForPublicUse: false };
  }
  if (!contextSignals(context).length) {
    return { decision: "insufficient_context", matches: [], errors: [], ruleVersion: ICP_RULE_VERSION, warnings, eligibleForPublicUse: false };
  }

  const matches = registry.icps
    .map((profile) => matchProfile(context, registry, profile))
    .filter((match): match is IcpMatch => Boolean(match))
    .sort(compareMatches)
    .slice(0, 3);
  const decision = !matches.length
    ? "insufficient_context"
    : matches.length > 1 && matches[0].fitScore === matches[1].fitScore
      ? "ambiguous"
      : "matched";
  if (!matches.length) warnings.push("No active ICP rule matched the supplied context.");

  return { decision, matches, errors: [], ruleVersion: ICP_RULE_VERSION, warnings, eligibleForPublicUse: false };
}
