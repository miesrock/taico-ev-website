import {
  ICP_VALIDATION_POLICY_VERSION,
  type IcpEvidenceDirectness,
  type IcpHypothesis,
  type IcpHypothesisRegistry,
  type IcpHypothesisRegistryValidation,
  type IcpObservationDirection,
  type IcpObservationSource,
  type IcpObservationValidation,
  type IcpRegistry,
  type IcpSalesConfirmationCandidate,
  type IcpValidationAnswerType,
  type IcpValidationAssessment,
  type IcpValidationError,
  type IcpValidationErrorCode,
  type IcpValidationObservation,
  type IcpValidationPolicy,
  type IcpValidationQuestion,
  type IcpValidationSignal,
} from "./types.ts";

const answerTypes = new Set<IcpValidationAnswerType>(["boolean", "number", "single_select", "multi_select", "text"]);
const directions = new Set<IcpObservationDirection>(["supports", "contradicts", "inconclusive"]);
const evidenceLevels = new Set(["E0", "E1", "E2", "E3", "E4"]);
const priorities = new Set(["high", "medium", "low"]);
const signals = new Set<IcpValidationSignal>([
  "company_type",
  "use_case",
  "current_workaround",
  "deployment_frequency",
  "deployment_environment",
  "product_constraint",
  "purchase_intent",
  "decision_role",
]);
const sources = new Set<IcpObservationSource>(["inquiry", "discovery_email", "sales_call", "customer_interview", "partner_interview", "market_research"]);
const statuses = new Set(["unvalidated", "testing", "ready_for_review", "needs_revision", "rejected"]);

export const icpValidationPolicy = {
  version: ICP_VALIDATION_POLICY_VERSION,
  minimumIndependentOrganizations: 2,
  minimumDirectObservations: 2,
  minimumSupportingObservations: 2,
  requiredSignals: ["company_type", "use_case", "current_workaround", "product_constraint"],
} as const satisfies IcpValidationPolicy;

function error(field: string, code: IcpValidationErrorCode, message: string): IcpValidationError {
  return { field, code, message };
}

function sortedErrors(errors: readonly IcpValidationError[]) {
  return [...errors].sort((left, right) => left.field.localeCompare(right.field) || left.code.localeCompare(right.code) || left.message.localeCompare(right.message));
}

function sortedUnique(values: readonly string[]) {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function isNonBlank(value: unknown): value is string {
  return typeof value === "string" && Boolean(value.trim());
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiresOptions(answerType: IcpValidationAnswerType) {
  return answerType === "single_select" || answerType === "multi_select";
}

function validOptions(options: unknown): options is readonly string[] {
  return Array.isArray(options) && options.length > 0 && options.every(isNonBlank) && new Set(options).size === options.length;
}

function validAnswer(question: IcpValidationQuestion, answer: unknown) {
  if (question.answerType === "boolean") return typeof answer === "boolean";
  if (question.answerType === "number") return typeof answer === "number" && Number.isFinite(answer);
  if (question.answerType === "text") return isNonBlank(answer);
  if (!validOptions(question.options)) return false;
  if (question.answerType === "single_select") return typeof answer === "string" && question.options.includes(answer);
  return Array.isArray(answer) && answer.length > 0 && answer.every((value) => typeof value === "string" && question.options!.includes(value));
}

function observationDirectness(source: IcpObservationSource): IcpEvidenceDirectness {
  return source === "market_research" ? "indirect" : "direct";
}

function policyErrors(policy: IcpValidationPolicy): readonly IcpValidationError[] {
  const errors: IcpValidationError[] = [];
  if (policy.version !== ICP_VALIDATION_POLICY_VERSION) errors.push(error("policy.version", "invalid_policy", `Unsupported validation policy version: ${policy.version}`));
  for (const field of ["minimumIndependentOrganizations", "minimumDirectObservations", "minimumSupportingObservations"] as const) {
    if (!Number.isSafeInteger(policy[field]) || policy[field] < 1) errors.push(error(`policy.${field}`, "invalid_policy", `${field} must be a positive integer.`));
  }
  if (!Array.isArray(policy.requiredSignals) || !policy.requiredSignals.length || policy.requiredSignals.some((signal) => !signals.has(signal))) {
    errors.push(error("policy.requiredSignals", "invalid_policy", "requiredSignals must contain known validation signals."));
  }
  return errors;
}

function hypothesisErrors(hypothesis: IcpHypothesis): readonly IcpValidationError[] {
  const errors: IcpValidationError[] = [];
  if (!isNonBlank(hypothesis.id)) errors.push(error("hypothesis.id", "missing_field", "Hypothesis id is required."));
  if (!isNonBlank(hypothesis.relationshipId)) errors.push(error("hypothesis.relationshipId", "missing_field", "Hypothesis relationshipId is required."));
  if (!isNonBlank(hypothesis.statement)) errors.push(error(`hypotheses.${hypothesis.id}.statement`, "missing_field", "Hypothesis statement is required."));
  if (!Array.isArray(hypothesis.assumptions) || !hypothesis.assumptions.length || hypothesis.assumptions.some((assumption) => !isNonBlank(assumption))) {
    errors.push(error(`hypotheses.${hypothesis.id}.assumptions`, "missing_field", "Hypothesis assumptions must contain non-empty strings."));
  }
  if (!statuses.has(hypothesis.status)) errors.push(error(`hypotheses.${hypothesis.id}.status`, "invalid_status", `Unknown hypothesis status: ${hypothesis.status}`));
  if (!priorities.has(hypothesis.priority)) errors.push(error(`hypotheses.${hypothesis.id}.priority`, "invalid_priority", `Unknown hypothesis priority: ${hypothesis.priority}`));
  if (!evidenceLevels.has(hypothesis.evidenceLevel)) errors.push(error(`hypotheses.${hypothesis.id}.evidenceLevel`, "invalid_evidence_level", `Unknown evidence level: ${hypothesis.evidenceLevel}`));
  if (hypothesis.eligibleForPublicUse !== false) errors.push(error(`hypotheses.${hypothesis.id}.eligibleForPublicUse`, "invalid_public_eligibility", "Hypotheses cannot be eligible for public use."));
  if (!isNonBlank(hypothesis.createdAt)) errors.push(error(`hypotheses.${hypothesis.id}.createdAt`, "missing_field", "Hypothesis createdAt is required."));
  if (!Array.isArray(hypothesis.validationQuestions) || !hypothesis.validationQuestions.length) {
    errors.push(error(`hypotheses.${hypothesis.id}.validationQuestions`, "missing_field", "Hypothesis needs validation questions."));
    return errors;
  }

  const questionIds = new Set<string>();
  for (const question of hypothesis.validationQuestions) {
    const field = `hypotheses.${hypothesis.id}.questions.${question.id}`;
    if (!isNonBlank(question.id)) errors.push(error(`${field}.id`, "missing_field", "Question id is required."));
    else if (questionIds.has(question.id)) errors.push(error(`${field}.id`, "duplicate_question", `Duplicate question id: ${question.id}`));
    else questionIds.add(question.id);
    if (!isNonBlank(question.prompt)) errors.push(error(`${field}.prompt`, "missing_field", "Question prompt is required."));
    if (!answerTypes.has(question.answerType)) errors.push(error(`${field}.answerType`, "invalid_answer_type", `Unknown answer type: ${question.answerType}`));
    if (!signals.has(question.signal)) errors.push(error(`${field}.signal`, "invalid_signal", `Unknown validation signal: ${question.signal}`));
    if (requiresOptions(question.answerType) && !validOptions(question.options)) {
      errors.push(error(`${field}.options`, "invalid_options", "Select questions need unique non-empty options."));
    }
    if (!requiresOptions(question.answerType) && question.options !== undefined) {
      errors.push(error(`${field}.options`, "invalid_options", "Only select questions may define options."));
    }
  }
  return errors;
}

/** Validates the internal hypothesis registry without changing it. */
export function validateIcpHypothesisRegistry(hypothesisRegistry: IcpHypothesisRegistry, registry: IcpRegistry): IcpHypothesisRegistryValidation {
  const errors: IcpValidationError[] = [];
  if (hypothesisRegistry.version !== ICP_VALIDATION_POLICY_VERSION) {
    errors.push(error("version", "invalid_policy", `Unsupported hypothesis registry version: ${hypothesisRegistry.version}`));
  }

  const relationById = new Map(registry.relations.map((relation) => [relation.id, relation]));
  const hypothesisIds = new Set<string>();
  const relationshipIds = new Set<string>();

  for (const hypothesis of hypothesisRegistry.hypotheses) {
    errors.push(...hypothesisErrors(hypothesis));
    if (hypothesisIds.has(hypothesis.id)) errors.push(error(`hypotheses.${hypothesis.id}.id`, "duplicate_id", `Duplicate hypothesis id: ${hypothesis.id}`));
    else hypothesisIds.add(hypothesis.id);
    if (relationshipIds.has(hypothesis.relationshipId)) errors.push(error(`hypotheses.${hypothesis.id}.relationshipId`, "duplicate_relationship", `Duplicate hypothesis relationshipId: ${hypothesis.relationshipId}`));
    else relationshipIds.add(hypothesis.relationshipId);

    const relation = relationById.get(hypothesis.relationshipId);
    if (!relation) {
      errors.push(error(`hypotheses.${hypothesis.id}.relationshipId`, "unknown_relationship", `Unknown relationship: ${hypothesis.relationshipId}`));
    } else {
      if (hypothesis.evidenceLevel !== "E1") {
        errors.push(error(`hypotheses.${hypothesis.id}.evidenceLevel`, "invalid_evidence_level", "Milestone D hypotheses retain their catalog-backed E1 starting point."));
      }
      if (relation.review?.status === "rejected" && hypothesis.priority === "high") {
        errors.push(error(`hypotheses.${hypothesis.id}.priority`, "invalid_priority", "Rejected relationships cannot retain high validation priority."));
      }
    }
  }

  for (const relation of registry.relations) {
    if (relation.review?.status !== "rejected" && !relationshipIds.has(relation.id)) {
      errors.push(error("hypotheses", "missing_hypothesis", `Missing hypothesis for relationship: ${relation.id}`));
    }
  }

  const sorted = sortedErrors(errors);
  return { decision: sorted.length ? "invalid_input" : "valid", errors: sorted };
}

function observationErrors(observation: IcpValidationObservation, hypothesis?: IcpHypothesis): readonly IcpValidationError[] {
  const errors: IcpValidationError[] = [];
  if (!isNonBlank(observation.id)) errors.push(error("observation.id", "missing_field", "Observation id is required."));
  if (!isNonBlank(observation.relationshipId)) errors.push(error("observation.relationshipId", "missing_field", "Observation relationshipId is required."));
  if (!isNonBlank(observation.organizationRef)) errors.push(error("observation.organizationRef", "missing_field", "Observation organizationRef is required."));
  if (!sources.has(observation.source)) errors.push(error("observation.source", "invalid_source", `Unknown observation source: ${observation.source}`));
  if (!directions.has(observation.direction)) errors.push(error("observation.direction", "invalid_direction", `Unknown observation direction: ${observation.direction}`));
  if (!isNonBlank(observation.observedAt)) errors.push(error("observation.observedAt", "missing_field", "Observation observedAt is required."));
  if (!isNonBlank(observation.recordedBy)) errors.push(error("observation.recordedBy", "missing_field", "Observation recordedBy is required."));
  if (!isNonBlank(observation.summary)) errors.push(error("observation.summary", "missing_field", "Observation summary is required."));
  if (!isRecord(observation.answers)) {
    errors.push(error("observation.answers", "missing_field", "Observation answers must be an object."));
    return errors;
  }
  if (!hypothesis) return errors;
  if (observation.relationshipId !== hypothesis.relationshipId) {
    errors.push(error("observation.relationshipId", "unknown_relationship", `Observation relationshipId does not match ${hypothesis.id}.`));
  }
  const questions = new Map(hypothesis.validationQuestions.map((question) => [question.id, question]));
  for (const [questionId, answer] of Object.entries(observation.answers)) {
    const question = questions.get(questionId);
    if (!question) errors.push(error(`observation.answers.${questionId}`, "unknown_question", `Unknown question id: ${questionId}`));
    else if (!validAnswer(question, answer)) errors.push(error(`observation.answers.${questionId}`, "invalid_answer", `Invalid answer for question: ${questionId}`));
  }
  return errors;
}

/** Validates one future inquiry, interview, or research observation without storing it. */
export function validateIcpObservation(
  observation: IcpValidationObservation,
  hypothesisRegistry: IcpHypothesisRegistry,
  registry: IcpRegistry,
): IcpObservationValidation {
  const relation = registry.relations.find((item) => item.id === observation.relationshipId);
  const hypothesis = hypothesisRegistry.hypotheses.find((item) => item.relationshipId === observation.relationshipId);
  const errors = [...observationErrors(observation, hypothesis)];
  if (!relation) errors.push(error("observation.relationshipId", "unknown_relationship", `Unknown relationship: ${observation.relationshipId}`));
  if (relation && !hypothesis) errors.push(error("observation.relationshipId", "missing_hypothesis", `No hypothesis exists for relationship: ${observation.relationshipId}`));
  const sorted = sortedErrors(errors);
  return { decision: sorted.length ? "invalid_input" : "valid", errors: sorted };
}

function invalidAssessment(hypothesis: IcpHypothesis, policy: IcpValidationPolicy, errors: readonly IcpValidationError[]): IcpValidationAssessment {
  const missingSignals = sortedUnique([...policy.requiredSignals]);
  return {
    hypothesisId: hypothesis.id,
    relationshipId: hypothesis.relationshipId,
    readiness: "invalid_input",
    policyVersion: ICP_VALIDATION_POLICY_VERSION,
    totalObservationCount: 0,
    directObservationCount: 0,
    indirectObservationCount: 0,
    independentOrganizationCount: 0,
    supportingObservationIds: [],
    contradictingObservationIds: [],
    inconclusiveObservationIds: [],
    directObservationIds: [],
    indirectObservationIds: [],
    answeredSignals: [],
    missingSignals,
    warnings: [],
    errors: sortedErrors(errors),
    eligibleForE2Review: false,
    eligibleForPublicUse: false,
  };
}

/**
 * Assesses one hypothesis from supplied observations only. It never mutates the
 * hypothesis or promotes the backing relationship.
 */
export function assessIcpHypothesis(
  hypothesis: IcpHypothesis,
  observations: readonly IcpValidationObservation[],
  policy: IcpValidationPolicy = icpValidationPolicy,
): IcpValidationAssessment {
  const errors = [...policyErrors(policy), ...hypothesisErrors(hypothesis)];
  const observationIds = new Set<string>();
  for (const observation of observations) {
    if (observationIds.has(observation.id)) errors.push(error(`observations.${observation.id}.id`, "duplicate_id", `Duplicate observation id: ${observation.id}`));
    else observationIds.add(observation.id);
    errors.push(...observationErrors(observation, hypothesis));
  }
  if (errors.length) return invalidAssessment(hypothesis, policy, errors);

  const direct = observations.filter((observation) => observationDirectness(observation.source) === "direct");
  const indirect = observations.filter((observation) => observationDirectness(observation.source) === "indirect");
  const supporting = observations.filter((observation) => observation.direction === "supports");
  const contradicting = observations.filter((observation) => observation.direction === "contradicts");
  const inconclusive = observations.filter((observation) => observation.direction === "inconclusive");
  const directSupporting = direct.filter((observation) => observation.direction === "supports");
  const directContradicting = direct.filter((observation) => observation.direction === "contradicts");
  const answeredSignals = sortedUnique(directSupporting.flatMap((observation) =>
    hypothesis.validationQuestions
      .filter((question) => Object.hasOwn(observation.answers, question.id) && validAnswer(question, observation.answers[question.id]))
      .map((question) => question.signal),
  )) as IcpValidationSignal[];
  const missingSignals = sortedUnique(policy.requiredSignals.filter((signal) => !answeredSignals.includes(signal))) as IcpValidationSignal[];
  const independentOrganizationCount = new Set(directSupporting.map((observation) => observation.organizationRef)).size;
  const directConflictOrganizations = new Set(directContradicting.map((observation) => observation.organizationRef)).size;
  const contradicted = directContradicting.length >= policy.minimumSupportingObservations
    && directConflictOrganizations >= policy.minimumIndependentOrganizations;
  const eligibleForE2Review = !contradicted
    && !directContradicting.length
    && direct.length >= policy.minimumDirectObservations
    && directSupporting.length >= policy.minimumSupportingObservations
    && independentOrganizationCount >= policy.minimumIndependentOrganizations
    && !missingSignals.length;
  const readiness = !observations.length
    ? "unvalidated"
    : contradicted
      ? "contradicted"
      : eligibleForE2Review
        ? "ready_for_review"
        : "in_progress";
  const warnings = [
    !observations.length && "No observations have been recorded.",
    indirect.length && !direct.length && "Indirect market research cannot qualify an E2 review.",
    directContradicting.length && "Direct contradictory observations block E2 review.",
    missingSignals.length && `Missing required validation signals: ${missingSignals.join(", ")}.`,
  ].filter((warning): warning is string => Boolean(warning)).sort((left, right) => left.localeCompare(right));

  return {
    hypothesisId: hypothesis.id,
    relationshipId: hypothesis.relationshipId,
    readiness,
    policyVersion: ICP_VALIDATION_POLICY_VERSION,
    totalObservationCount: observations.length,
    directObservationCount: direct.length,
    indirectObservationCount: indirect.length,
    independentOrganizationCount,
    supportingObservationIds: sortedUnique(supporting.map((observation) => observation.id)),
    contradictingObservationIds: sortedUnique(contradicting.map((observation) => observation.id)),
    inconclusiveObservationIds: sortedUnique(inconclusive.map((observation) => observation.id)),
    directObservationIds: sortedUnique(direct.map((observation) => observation.id)),
    indirectObservationIds: sortedUnique(indirect.map((observation) => observation.id)),
    answeredSignals,
    missingSignals,
    warnings,
    errors: [],
    eligibleForE2Review,
    eligibleForPublicUse: false,
  };
}

/** Builds a review packet only; Milestone C remains the sole E1-to-E2 promotion path. */
export function buildConfirmationCandidate(
  assessment: IcpValidationAssessment,
  observations: readonly IcpValidationObservation[],
): IcpSalesConfirmationCandidate | null {
  if (!assessment.eligibleForE2Review) return null;
  const supporting = observations
    .filter((observation) => observation.relationshipId === assessment.relationshipId
      && observation.direction === "supports"
      && observationDirectness(observation.source) === "direct"
      && assessment.supportingObservationIds.includes(observation.id))
    .sort((left, right) => left.id.localeCompare(right.id));
  if (!supporting.length) return null;
  return {
    relationshipId: assessment.relationshipId,
    supportingObservationIds: supporting.map((observation) => observation.id),
    independentOrganizationCount: assessment.independentOrganizationCount,
    sourceTypes: sortedUnique(supporting.map((observation) => observation.source)) as IcpObservationSource[],
    summary: `${supporting.length} direct supporting observations across ${assessment.independentOrganizationCount} independent organizations meet ICP Validation Framework policy v${assessment.policyVersion}. Manual Milestone C review is still required.`,
    validationPolicyVersion: assessment.policyVersion,
    eligibleForPublicUse: false,
  };
}
