export const ICP_RULE_VERSION = "0.1.0";
export const ICP_VALIDATION_POLICY_VERSION = "0.1.0";

export const companyTypes = [
  "roadside_assistance",
  "ev_mobility_service_provider",
  "automotive_club",
  "on_demand_charging_operator",
  "fleet_operator",
  "delivery_fleet_operator",
  "parking_operator",
  "mobile_charging_service_provider",
  "temporary_power_provider",
  "construction_infrastructure_contractor",
  "pv_ess_integrator",
  "installer",
  "epc",
  "charging_operator",
  "charging_infrastructure_developer",
  "distributor",
  "commercial_site_operator",
] as const;

export type CompanyType = (typeof companyTypes)[number];
export type EvidenceLevel = "E0" | "E1" | "E2" | "E3" | "E4";
export type IcpRelationStrength = "primary" | "secondary";
export type IcpStatus = "candidate" | "active" | "archived";
export type IcpReviewStatus = "pending" | "approved" | "rejected" | "needs_revision";
export type IcpEvidenceType = "catalog" | "sales_confirmation" | "inquiry" | "quotation" | "order" | "market_research";
export type IcpEvidenceSupport = "company_type" | "application" | "product_relation" | "buying_trigger";
export type IcpSignalType = "companyType" | "application" | "product" | "solution";

export type IcpEvidence = {
  id: string;
  type: IcpEvidenceType;
  source: string;
  summary: string;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  supports: readonly IcpEvidenceSupport[];
};

export type IcpReview = {
  status: IcpReviewStatus;
  reviewedAt?: string;
  reviewedBy?: string;
  notes?: string;
};

export type QualifyingQuestionId =
  | "buyer-group"
  | "target-market"
  | "operating-scenario"
  | "product-configuration"
  | "deployment-volume"
  | "coverage-area"
  | "vehicle-types";

export type QualifyingQuestion = {
  id: QualifyingQuestionId;
  prompt: string;
};

export type Icp = {
  id: string;
  slug: string;
  name: string;
  definition: string;
  companyTypes: readonly CompanyType[];
  evidenceLevel: EvidenceLevel;
  status: IcpStatus;
  review: IcpReview;
  qualifyingQuestionIds: readonly QualifyingQuestionId[];
  eligibleForPublicUse: boolean;
};

export type IcpNegativeSignal = {
  field: IcpSignalType;
  values: readonly string[];
  penalty: number;
};

export type IcpRelation = {
  id: string;
  icpSlug: string;
  relatedProductSlugs: readonly string[];
  relatedApplicationSlugs: readonly string[];
  relatedSolutionSlugs: readonly string[];
  strength: IcpRelationStrength;
  scenarioFit: 1 | 2 | 3 | 4 | 5;
  evidenceLevel: EvidenceLevel;
  evidenceIds: readonly string[];
  review?: IcpReview;
  negativeSignals?: readonly IcpNegativeSignal[];
};

export type IcpRegistry = {
  version: typeof ICP_RULE_VERSION;
  icps: readonly Icp[];
  relations: readonly IcpRelation[];
  evidence: readonly IcpEvidence[];
};

export type IcpMatchContext = {
  companyType?: CompanyType;
  applicationSlug?: string;
  productSlug?: string;
  solutionSlug?: string;
  source?: string;
  country?: string;
  rawText?: string;
  purchaseTimeline?: string;
};

export type IcpInputError = {
  field: "companyType" | "applicationSlug" | "productSlug" | "solutionSlug";
  code: "unknown_company_type" | "unknown_slug";
  value: string;
  message: string;
};

export type IcpMatchedSignal = {
  type: IcpSignalType;
  value: string;
  score: number;
  strength: IcpRelationStrength;
};

export type IcpUnmatchedSignal = {
  type: IcpSignalType;
  value: string;
};

export type IcpFitBand = "strong" | "possible" | "weak";
export type IcpMatchDecision = "matched" | "ambiguous" | "insufficient_context" | "invalid_input";

export type IcpMatch = {
  icpSlug: string;
  fitScore: number;
  fitBand: IcpFitBand;
  evidenceLevel: EvidenceLevel;
  matchedSignals: readonly IcpMatchedSignal[];
  missingSignals: readonly IcpSignalType[];
  unmatchedSignals: readonly IcpUnmatchedSignal[];
  relatedProductSlugs: readonly string[];
  ruleVersion: typeof ICP_RULE_VERSION;
  warnings: readonly string[];
  eligibleForPublicUse: false;
};

export type IcpMatchResult = {
  decision: IcpMatchDecision;
  matches: readonly IcpMatch[];
  errors: readonly IcpInputError[];
  ruleVersion: typeof ICP_RULE_VERSION;
  warnings: readonly string[];
  eligibleForPublicUse: false;
};

export type IcpSalesConfirmation = {
  id: string;
  relationId: string;
  economicBuyer?: string;
  operatingUser?: string;
  technicalEvaluator?: string;
  channelRole?: string;
  accountQualification?: string;
  targetCountry?: string;
  productConfiguration?: string;
  commercialEvidence?: IcpEvidence;
  review: IcpReview;
};

export type IcpConfirmationDecision = {
  confirmationId: string;
  relationId: string;
  action: "promoted_to_E2" | "rejected" | "needs_revision" | "no_change" | "invalid";
  errors: readonly string[];
};

export type IcpConfirmationApplication = {
  registry: IcpRegistry;
  decisions: readonly IcpConfirmationDecision[];
};

export type IcpHypothesisStatus = "unvalidated" | "testing" | "ready_for_review" | "needs_revision" | "rejected";
export type IcpHypothesisPriority = "high" | "medium" | "low";
export type IcpValidationAnswerType = "boolean" | "number" | "single_select" | "multi_select" | "text";
export type IcpValidationSignal =
  | "company_type"
  | "use_case"
  | "current_workaround"
  | "deployment_frequency"
  | "deployment_environment"
  | "product_constraint"
  | "purchase_intent"
  | "decision_role";
export type IcpObservationSource = "inquiry" | "discovery_email" | "sales_call" | "customer_interview" | "partner_interview" | "market_research";
export type IcpObservationDirection = "supports" | "contradicts" | "inconclusive";
export type IcpEvidenceDirectness = "direct" | "indirect";
export type IcpValidationReadiness = "unvalidated" | "in_progress" | "ready_for_review" | "contradicted" | "invalid_input";

export type IcpValidationQuestion = {
  id: string;
  prompt: string;
  answerType: IcpValidationAnswerType;
  signal: IcpValidationSignal;
  required: boolean;
  options?: readonly string[];
};

export type IcpHypothesis = {
  id: string;
  relationshipId: string;
  statement: string;
  assumptions: readonly string[];
  validationQuestions: readonly IcpValidationQuestion[];
  priority: IcpHypothesisPriority;
  status: IcpHypothesisStatus;
  evidenceLevel: EvidenceLevel;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  eligibleForPublicUse: false;
};

export type IcpHypothesisRegistry = {
  version: typeof ICP_VALIDATION_POLICY_VERSION;
  hypotheses: readonly IcpHypothesis[];
};

export type IcpValidationObservation = {
  id: string;
  relationshipId: string;
  organizationRef: string;
  country?: string;
  source: IcpObservationSource;
  observedAt: string;
  recordedBy: string;
  answers: Readonly<Record<string, unknown>>;
  direction: IcpObservationDirection;
  summary: string;
  notes?: string;
};

export type IcpValidationPolicy = {
  version: typeof ICP_VALIDATION_POLICY_VERSION;
  minimumIndependentOrganizations: number;
  minimumDirectObservations: number;
  minimumSupportingObservations: number;
  requiredSignals: readonly IcpValidationSignal[];
};

export type IcpValidationErrorCode =
  | "duplicate_id"
  | "duplicate_relationship"
  | "duplicate_question"
  | "invalid_answer"
  | "invalid_answer_type"
  | "invalid_direction"
  | "invalid_evidence_level"
  | "invalid_options"
  | "invalid_policy"
  | "invalid_priority"
  | "invalid_public_eligibility"
  | "invalid_signal"
  | "invalid_source"
  | "invalid_status"
  | "missing_field"
  | "missing_hypothesis"
  | "unknown_question"
  | "unknown_relationship";

export type IcpValidationError = {
  field: string;
  code: IcpValidationErrorCode;
  message: string;
};

export type IcpHypothesisRegistryValidation = {
  decision: "valid" | "invalid_input";
  errors: readonly IcpValidationError[];
};

export type IcpObservationValidation = {
  decision: "valid" | "invalid_input";
  errors: readonly IcpValidationError[];
};

export type IcpValidationAssessment = {
  hypothesisId: string;
  relationshipId: string;
  readiness: IcpValidationReadiness;
  policyVersion: typeof ICP_VALIDATION_POLICY_VERSION;
  totalObservationCount: number;
  directObservationCount: number;
  indirectObservationCount: number;
  independentOrganizationCount: number;
  supportingObservationIds: readonly string[];
  contradictingObservationIds: readonly string[];
  inconclusiveObservationIds: readonly string[];
  directObservationIds: readonly string[];
  indirectObservationIds: readonly string[];
  answeredSignals: readonly IcpValidationSignal[];
  missingSignals: readonly IcpValidationSignal[];
  warnings: readonly string[];
  errors: readonly IcpValidationError[];
  eligibleForE2Review: boolean;
  eligibleForPublicUse: false;
};

export type IcpSalesConfirmationCandidate = {
  relationshipId: string;
  supportingObservationIds: readonly string[];
  independentOrganizationCount: number;
  sourceTypes: readonly IcpObservationSource[];
  summary: string;
  validationPolicyVersion: typeof ICP_VALIDATION_POLICY_VERSION;
  eligibleForPublicUse: false;
};
