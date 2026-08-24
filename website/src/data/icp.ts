import { assertIcpRegistry } from "../lib/icp/registry.ts";
import {
  ICP_RULE_VERSION,
  type Icp,
  type IcpEvidence,
  type IcpRelation,
  type IcpRegistry,
  type QualifyingQuestion,
} from "../lib/icp/types.ts";

/** Internal-only candidates from docs/icp-candidate-matrix.md. */
export { ICP_RULE_VERSION } from "../lib/icp/types.ts";

export const qualifyingQuestions = [
  { id: "buyer-group", prompt: "Who is the economic buyer, operating user, and technical evaluator?" },
  { id: "target-market", prompt: "Which country or region and deployment location are in scope?" },
  { id: "operating-scenario", prompt: "What operating scenario must the project support?" },
  { id: "product-configuration", prompt: "Which current model, connector, and project-specific configuration are required?" },
  { id: "deployment-volume", prompt: "How many units or deployments are being evaluated?" },
  { id: "coverage-area", prompt: "Which service area must the operation cover?" },
  { id: "vehicle-types", prompt: "Which vehicle types and connector requirements are in scope?" },
] as const satisfies readonly QualifyingQuestion[];

const commonQuestions = ["buyer-group", "target-market", "operating-scenario", "product-configuration"] as const;
const pending = { status: "pending" } as const;

export const icps = [
  { id: "icp-01", slug: "roadside-assistance-provider", name: "EV roadside-assistance provider", definition: "Organisation that may coordinate roadside EV support.", companyTypes: ["roadside_assistance"], evidenceLevel: "E1", status: "candidate", review: pending, qualifyingQuestionIds: [...commonQuestions, "deployment-volume", "coverage-area", "vehicle-types"], eligibleForPublicUse: false },
  { id: "icp-02", slug: "ev-mobility-service-provider", name: "EV mobility service provider", definition: "Organisation that may operate EV mobility services.", companyTypes: ["ev_mobility_service_provider"], evidenceLevel: "E1", status: "candidate", review: pending, qualifyingQuestionIds: [...commonQuestions, "coverage-area", "vehicle-types"], eligibleForPublicUse: false },
  { id: "icp-03", slug: "automotive-club", name: "Automotive club", definition: "Membership organisation that may provide vehicle-support services.", companyTypes: ["automotive_club"], evidenceLevel: "E1", status: "candidate", review: pending, qualifyingQuestionIds: [...commonQuestions, "coverage-area", "vehicle-types"], eligibleForPublicUse: false },
  { id: "icp-04", slug: "on-demand-ev-charging-operator", name: "On-demand EV charging service operator", definition: "Organisation that may dispatch or operate on-demand charging.", companyTypes: ["on_demand_charging_operator"], evidenceLevel: "E1", status: "candidate", review: pending, qualifyingQuestionIds: [...commonQuestions, "deployment-volume", "vehicle-types"], eligibleForPublicUse: false },
  { id: "icp-05", slug: "fleet-operator", name: "EV fleet operator", definition: "Organisation that may manage an EV fleet.", companyTypes: ["fleet_operator"], evidenceLevel: "E1", status: "candidate", review: pending, qualifyingQuestionIds: [...commonQuestions, "deployment-volume", "vehicle-types"], eligibleForPublicUse: false },
  { id: "icp-06", slug: "delivery-fleet-operator", name: "Delivery fleet operator", definition: "Organisation that may manage delivery vehicles.", companyTypes: ["delivery_fleet_operator"], evidenceLevel: "E1", status: "candidate", review: pending, qualifyingQuestionIds: [...commonQuestions, "deployment-volume", "vehicle-types"], eligibleForPublicUse: false },
  { id: "icp-07", slug: "parking-operator", name: "Parking operator", definition: "Organisation that may manage parking facilities.", companyTypes: ["parking_operator"], evidenceLevel: "E1", status: "candidate", review: pending, qualifyingQuestionIds: [...commonQuestions, "deployment-volume"], eligibleForPublicUse: false },
  { id: "icp-08", slug: "mobile-ev-charging-service-provider", name: "Mobile EV charging service operator", definition: "Organisation that may operate mobile EV charging services.", companyTypes: ["mobile_charging_service_provider"], evidenceLevel: "E1", status: "candidate", review: pending, qualifyingQuestionIds: [...commonQuestions, "deployment-volume", "coverage-area", "vehicle-types"], eligibleForPublicUse: false },
  { id: "icp-09", slug: "temporary-power-provider", name: "Temporary-power service provider", definition: "Organisation that may deploy temporary power for events, construction, or emergencies.", companyTypes: ["temporary_power_provider"], evidenceLevel: "E1", status: "candidate", review: pending, qualifyingQuestionIds: [...commonQuestions, "deployment-volume"], eligibleForPublicUse: false },
  { id: "icp-10", slug: "construction-infrastructure-contractor", name: "Construction and infrastructure contractor", definition: "Organisation that may deliver construction or infrastructure work.", companyTypes: ["construction_infrastructure_contractor"], evidenceLevel: "E1", status: "candidate", review: pending, qualifyingQuestionIds: [...commonQuestions, "deployment-volume"], eligibleForPublicUse: false },
  { id: "icp-11", slug: "pv-ess-integrator", name: "PV-ESS integrator", definition: "Organisation that may integrate PV and energy-storage systems.", companyTypes: ["pv_ess_integrator"], evidenceLevel: "E1", status: "candidate", review: pending, qualifyingQuestionIds: commonQuestions, eligibleForPublicUse: false },
  { id: "icp-12", slug: "ci-solar-installer", name: "C&I solar installer", definition: "Organisation that may install commercial and industrial solar systems.", companyTypes: ["installer"], evidenceLevel: "E1", status: "candidate", review: pending, qualifyingQuestionIds: commonQuestions, eligibleForPublicUse: false },
  { id: "icp-13", slug: "microgrid-epc", name: "Microgrid EPC", definition: "Organisation that may engineer, procure, or construct microgrids.", companyTypes: ["epc"], evidenceLevel: "E1", status: "candidate", review: pending, qualifyingQuestionIds: commonQuestions, eligibleForPublicUse: false },
  { id: "icp-14", slug: "charge-point-operator", name: "Charge point operator (CPO)", definition: "Organisation that may operate EV charge points.", companyTypes: ["charging_operator"], evidenceLevel: "E1", status: "candidate", review: pending, qualifyingQuestionIds: [...commonQuestions, "deployment-volume", "vehicle-types"], eligibleForPublicUse: false },
  { id: "icp-15", slug: "charging-infrastructure-developer", name: "Charging-infrastructure developer", definition: "Organisation that may develop charging infrastructure.", companyTypes: ["charging_infrastructure_developer"], evidenceLevel: "E1", status: "candidate", review: pending, qualifyingQuestionIds: [...commonQuestions, "deployment-volume"], eligibleForPublicUse: false },
] as const satisfies readonly Icp[];

const catalogEvidence = (id: string, pages: string, summary: string): IcpEvidence => ({
  id,
  type: "catalog",
  source: `TAICO MC 2026 Catalog v1.3, p. ${pages}`,
  summary,
  createdAt: "2026-07-31",
  supports: ["application", "product_relation"],
});

export const icpEvidence = [
  catalogEvidence("ev-rel-tkmc-800-1500-roadside-assistance", "4–5", "TKMC-800 and TKMC-1500 list Roadside EV Rescue as a catalog use case."),
  catalogEvidence("ev-rel-tkmc-800-1500-ev-mobility", "4–5", "TKMC-800 and TKMC-1500 list Roadside EV Rescue as a catalog use case."),
  catalogEvidence("ev-rel-tkmc-800-1500-automotive-club", "4–5", "TKMC-800 and TKMC-1500 list Roadside EV Rescue as a catalog use case."),
  catalogEvidence("ev-rel-tkmc-1000-on-demand-operator", "6", "TKMC-1000 lists Mobile EV Charger as a catalog use case."),
  catalogEvidence("ev-rel-tkmc-1000-fleet-operator", "6", "TKMC-1000 lists Mobile EV Charger as a catalog use case."),
  catalogEvidence("ev-rel-tkmc-1000-delivery-fleet", "6", "TKMC-1000 lists Mobile EV Charger as a catalog use case."),
  catalogEvidence("ev-rel-tkmc-1000-parking-operator", "6", "TKMC-1000 lists Mobile EV Charger as a catalog use case."),
  catalogEvidence("ev-rel-tkmc-2000p-mobile-charging-service", "7", "TKMC-2000P lists Mobile Charger and AC Output as catalog use cases."),
  catalogEvidence("ev-rel-tkmc-2000p-temporary-power", "7", "TKMC-2000P lists Mobile Charger and AC Output as catalog use cases."),
  catalogEvidence("ev-rel-tkmc-4000-construction-infrastructure", "8", "TKMC-4000 lists Mobile Charger, AC Output, and Engineering Power Supply as catalog use cases."),
  catalogEvidence("ev-rel-tkmc-4000-temporary-power", "8", "TKMC-4000 lists Mobile Charger, AC Output, and Engineering Power Supply as catalog use cases."),
  catalogEvidence("ev-rel-tkmc-4000-mobile-charging-service", "8", "TKMC-4000 lists Mobile Charger, AC Output, and Engineering Power Supply as catalog use cases."),
  catalogEvidence("ev-rel-tkmc-10000-pv-ess-integrator", "9", "TKMC-10000 lists Mobile Charger, PV Storage Charger, and AC Output as catalog use cases."),
  catalogEvidence("ev-rel-tkmc-10000-ci-solar-installer", "9", "TKMC-10000 lists Mobile Charger, PV Storage Charger, and AC Output as catalog use cases."),
  catalogEvidence("ev-rel-tkmc-10000-microgrid-epc", "9", "TKMC-10000 lists Mobile Charger, PV Storage Charger, and AC Output as catalog use cases."),
  catalogEvidence("ev-rel-tkmc-2000-2600-cpo", "10–11", "TKMC-2000 and TKMC-2600 list PV-Storage Charging Station and Grid Complementary System as catalog use cases."),
  catalogEvidence("ev-rel-tkmc-2000-2600-charging-developer", "10–11", "TKMC-2000 and TKMC-2600 list PV-Storage Charging Station and Grid Complementary System as catalog use cases."),
  catalogEvidence("ev-rel-tkmc-2000-2600-pv-ess-integrator", "10–11", "TKMC-2000 and TKMC-2600 list PV-Storage Charging Station and Grid Complementary System as catalog use cases."),
] as const satisfies readonly IcpEvidence[];

export const icpRelations = [
  { id: "rel-tkmc-800-1500-roadside-assistance", icpSlug: "roadside-assistance-provider", relatedProductSlugs: ["tkmc-800", "tkmc-1500"], relatedApplicationSlugs: ["roadside-ev-rescue"], relatedSolutionSlugs: ["mobile-ev-charger-roadside-rescue"], strength: "primary", scenarioFit: 5, evidenceLevel: "E1", evidenceIds: ["ev-rel-tkmc-800-1500-roadside-assistance"] },
  { id: "rel-tkmc-800-1500-ev-mobility", icpSlug: "ev-mobility-service-provider", relatedProductSlugs: ["tkmc-800", "tkmc-1500"], relatedApplicationSlugs: ["roadside-ev-rescue"], relatedSolutionSlugs: ["mobile-ev-charger-roadside-rescue"], strength: "secondary", scenarioFit: 3, evidenceLevel: "E1", evidenceIds: ["ev-rel-tkmc-800-1500-ev-mobility"] },
  { id: "rel-tkmc-800-1500-automotive-club", icpSlug: "automotive-club", relatedProductSlugs: ["tkmc-800", "tkmc-1500"], relatedApplicationSlugs: ["roadside-ev-rescue"], relatedSolutionSlugs: ["mobile-ev-charger-roadside-rescue"], strength: "secondary", scenarioFit: 3, evidenceLevel: "E1", evidenceIds: ["ev-rel-tkmc-800-1500-automotive-club"] },
  { id: "rel-tkmc-1000-on-demand-operator", icpSlug: "on-demand-ev-charging-operator", relatedProductSlugs: ["tkmc-1000"], relatedApplicationSlugs: ["on-demand-charging"], relatedSolutionSlugs: ["charge-on-demand"], strength: "primary", scenarioFit: 5, evidenceLevel: "E1", evidenceIds: ["ev-rel-tkmc-1000-on-demand-operator"] },
  { id: "rel-tkmc-1000-fleet-operator", icpSlug: "fleet-operator", relatedProductSlugs: ["tkmc-1000"], relatedApplicationSlugs: ["on-demand-charging"], relatedSolutionSlugs: ["charge-on-demand"], strength: "secondary", scenarioFit: 3, evidenceLevel: "E1", evidenceIds: ["ev-rel-tkmc-1000-fleet-operator"] },
  { id: "rel-tkmc-1000-delivery-fleet", icpSlug: "delivery-fleet-operator", relatedProductSlugs: ["tkmc-1000"], relatedApplicationSlugs: ["on-demand-charging"], relatedSolutionSlugs: ["charge-on-demand"], strength: "secondary", scenarioFit: 2, evidenceLevel: "E1", evidenceIds: ["ev-rel-tkmc-1000-delivery-fleet"] },
  { id: "rel-tkmc-1000-parking-operator", icpSlug: "parking-operator", relatedProductSlugs: ["tkmc-1000"], relatedApplicationSlugs: ["on-demand-charging"], relatedSolutionSlugs: ["charge-on-demand"], strength: "secondary", scenarioFit: 2, evidenceLevel: "E1", evidenceIds: ["ev-rel-tkmc-1000-parking-operator"] },
  { id: "rel-tkmc-2000p-mobile-charging-service", icpSlug: "mobile-ev-charging-service-provider", relatedProductSlugs: ["tkmc-2000p"], relatedApplicationSlugs: ["ac-output-e-generator"], relatedSolutionSlugs: ["ac-output-e-generator"], strength: "secondary", scenarioFit: 4, evidenceLevel: "E1", evidenceIds: ["ev-rel-tkmc-2000p-mobile-charging-service"] },
  { id: "rel-tkmc-2000p-temporary-power", icpSlug: "temporary-power-provider", relatedProductSlugs: ["tkmc-2000p"], relatedApplicationSlugs: ["ac-output-e-generator"], relatedSolutionSlugs: ["ac-output-e-generator"], strength: "secondary", scenarioFit: 4, evidenceLevel: "E1", evidenceIds: ["ev-rel-tkmc-2000p-temporary-power"] },
  { id: "rel-tkmc-4000-construction-infrastructure", icpSlug: "construction-infrastructure-contractor", relatedProductSlugs: ["tkmc-4000"], relatedApplicationSlugs: ["ac-output-e-generator", "engineering-power-supply"], relatedSolutionSlugs: ["ac-output-e-generator", "temporary-engineering-power"], strength: "secondary", scenarioFit: 4, evidenceLevel: "E1", evidenceIds: ["ev-rel-tkmc-4000-construction-infrastructure"] },
  { id: "rel-tkmc-4000-temporary-power", icpSlug: "temporary-power-provider", relatedProductSlugs: ["tkmc-4000"], relatedApplicationSlugs: ["ac-output-e-generator", "engineering-power-supply"], relatedSolutionSlugs: ["ac-output-e-generator", "temporary-engineering-power"], strength: "primary", scenarioFit: 5, evidenceLevel: "E1", evidenceIds: ["ev-rel-tkmc-4000-temporary-power"] },
  { id: "rel-tkmc-4000-mobile-charging-service", icpSlug: "mobile-ev-charging-service-provider", relatedProductSlugs: ["tkmc-4000"], relatedApplicationSlugs: ["ac-output-e-generator", "engineering-power-supply"], relatedSolutionSlugs: ["ac-output-e-generator", "temporary-engineering-power"], strength: "secondary", scenarioFit: 3, evidenceLevel: "E1", evidenceIds: ["ev-rel-tkmc-4000-mobile-charging-service"] },
  { id: "rel-tkmc-10000-pv-ess-integrator", icpSlug: "pv-ess-integrator", relatedProductSlugs: ["tkmc-10000"], relatedApplicationSlugs: ["ac-output-e-generator", "pv-storage-charger"], relatedSolutionSlugs: ["ac-output-e-generator", "pv-storage-charger"], strength: "primary", scenarioFit: 5, evidenceLevel: "E1", evidenceIds: ["ev-rel-tkmc-10000-pv-ess-integrator"] },
  { id: "rel-tkmc-10000-ci-solar-installer", icpSlug: "ci-solar-installer", relatedProductSlugs: ["tkmc-10000"], relatedApplicationSlugs: ["ac-output-e-generator", "pv-storage-charger"], relatedSolutionSlugs: ["ac-output-e-generator", "pv-storage-charger"], strength: "secondary", scenarioFit: 4, evidenceLevel: "E1", evidenceIds: ["ev-rel-tkmc-10000-ci-solar-installer"] },
  { id: "rel-tkmc-10000-microgrid-epc", icpSlug: "microgrid-epc", relatedProductSlugs: ["tkmc-10000"], relatedApplicationSlugs: ["ac-output-e-generator", "pv-storage-charger"], relatedSolutionSlugs: ["ac-output-e-generator", "pv-storage-charger"], strength: "secondary", scenarioFit: 4, evidenceLevel: "E1", evidenceIds: ["ev-rel-tkmc-10000-microgrid-epc"] },
  { id: "rel-tkmc-2000-2600-cpo", icpSlug: "charge-point-operator", relatedProductSlugs: ["tkmc-2000", "tkmc-2600"], relatedApplicationSlugs: ["pv-ess-charging-station"], relatedSolutionSlugs: ["pv-ess-charging"], strength: "primary", scenarioFit: 5, evidenceLevel: "E1", evidenceIds: ["ev-rel-tkmc-2000-2600-cpo"] },
  { id: "rel-tkmc-2000-2600-charging-developer", icpSlug: "charging-infrastructure-developer", relatedProductSlugs: ["tkmc-2000", "tkmc-2600"], relatedApplicationSlugs: ["pv-ess-charging-station"], relatedSolutionSlugs: ["pv-ess-charging"], strength: "secondary", scenarioFit: 4, evidenceLevel: "E1", evidenceIds: ["ev-rel-tkmc-2000-2600-charging-developer"] },
  { id: "rel-tkmc-2000-2600-pv-ess-integrator", icpSlug: "pv-ess-integrator", relatedProductSlugs: ["tkmc-2000", "tkmc-2600"], relatedApplicationSlugs: ["pv-ess-charging-station"], relatedSolutionSlugs: ["pv-ess-charging"], strength: "secondary", scenarioFit: 4, evidenceLevel: "E1", evidenceIds: ["ev-rel-tkmc-2000-2600-pv-ess-integrator"] },
] as const satisfies readonly IcpRelation[];

export const icpRegistry = {
  version: ICP_RULE_VERSION,
  icps,
  relations: icpRelations,
  evidence: icpEvidence,
} as const satisfies IcpRegistry;

assertIcpRegistry(icpRegistry);
