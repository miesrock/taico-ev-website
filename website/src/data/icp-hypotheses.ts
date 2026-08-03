import {
  ICP_VALIDATION_POLICY_VERSION,
  type IcpHypothesis,
  type IcpHypothesisPriority,
  type IcpHypothesisRegistry,
  type IcpValidationQuestion,
} from "../lib/icp/types.ts";

const confirmationOptions = ["confirmed", "not_confirmed", "unknown"] as const;

function questions(scenario: string, products: string): readonly IcpValidationQuestion[] {
  return [
    { id: "company-type", prompt: "Does the organization match the candidate organization type for this relationship?", answerType: "single_select", signal: "company_type", required: true, options: confirmationOptions },
    { id: "use-case", prompt: `Does the organization currently operate or plan the catalog-linked ${scenario} application?`, answerType: "single_select", signal: "use_case", required: true, options: confirmationOptions },
    { id: "current-workaround", prompt: `How does the organization address the ${scenario} requirement today, including any current workaround?`, answerType: "text", signal: "current_workaround", required: true },
    { id: "product-constraint", prompt: `Which connector, capacity, output, transport, site, or operating constraints need confirmation for ${products}?`, answerType: "text", signal: "product_constraint", required: true },
    { id: "deployment-environment", prompt: "Where and under which operating conditions would the application be deployed?", answerType: "text", signal: "deployment_environment", required: false },
    { id: "decision-role", prompt: "Which role can describe the operating need and influence configuration or purchase decisions?", answerType: "text", signal: "decision_role", required: false },
  ];
}

function hypothesis(
  id: string,
  relationshipId: string,
  candidate: string,
  products: string,
  scenario: string,
  priority: IcpHypothesisPriority,
): IcpHypothesis {
  return {
    id,
    relationshipId,
    statement: `${candidate} may evaluate ${products} for the catalog-linked ${scenario} application; the candidate matrix treats this as an internal E1 relationship pending validation.`,
    assumptions: [
      `The candidate matrix retains ${relationshipId} as an E1 research hypothesis.`,
      `${products} are catalog-linked to ${scenario}.`,
      "The organization's workflow, purchase role, target market, configuration, and commercial fit remain unconfirmed.",
    ],
    validationQuestions: questions(scenario, products),
    priority,
    status: "unvalidated",
    evidenceLevel: "E1",
    createdAt: "2026-07-31",
    eligibleForPublicUse: false,
  };
}

/** Internal-only E1 hypotheses derived from the current catalog-backed candidate matrix. */
export const icpHypotheses = [
  hypothesis("hyp-rel-tkmc-800-1500-roadside-assistance", "rel-tkmc-800-1500-roadside-assistance", "An EV roadside-assistance provider", "TKMC-800 or TKMC-1500", "Roadside EV Rescue", "high"),
  hypothesis("hyp-rel-tkmc-800-1500-ev-mobility", "rel-tkmc-800-1500-ev-mobility", "An EV mobility service provider", "TKMC-800 or TKMC-1500", "Roadside EV Rescue", "medium"),
  hypothesis("hyp-rel-tkmc-800-1500-automotive-club", "rel-tkmc-800-1500-automotive-club", "An automotive club", "TKMC-800 or TKMC-1500", "Roadside EV Rescue", "medium"),
  hypothesis("hyp-rel-tkmc-1000-on-demand-operator", "rel-tkmc-1000-on-demand-operator", "An on-demand EV charging service operator", "TKMC-1000", "On-Demand Charging", "high"),
  hypothesis("hyp-rel-tkmc-1000-fleet-operator", "rel-tkmc-1000-fleet-operator", "An EV fleet operator", "TKMC-1000", "On-Demand Charging", "high"),
  hypothesis("hyp-rel-tkmc-1000-delivery-fleet", "rel-tkmc-1000-delivery-fleet", "A delivery fleet operator", "TKMC-1000", "On-Demand Charging", "medium"),
  hypothesis("hyp-rel-tkmc-1000-parking-operator", "rel-tkmc-1000-parking-operator", "A parking operator", "TKMC-1000", "On-Demand Charging", "medium"),
  hypothesis("hyp-rel-tkmc-2000p-mobile-charging-service", "rel-tkmc-2000p-mobile-charging-service", "A mobile EV charging service operator", "TKMC-2000P", "AC Output / E-Generator", "high"),
  hypothesis("hyp-rel-tkmc-2000p-temporary-power", "rel-tkmc-2000p-temporary-power", "A temporary-power service provider", "TKMC-2000P", "AC Output / E-Generator", "high"),
  hypothesis("hyp-rel-tkmc-4000-construction-infrastructure", "rel-tkmc-4000-construction-infrastructure", "A construction and infrastructure contractor", "TKMC-4000", "AC Output / E-Generator and Engineering Power Supply", "high"),
  hypothesis("hyp-rel-tkmc-4000-temporary-power", "rel-tkmc-4000-temporary-power", "A temporary-power service provider", "TKMC-4000", "AC Output / E-Generator and Engineering Power Supply", "high"),
  hypothesis("hyp-rel-tkmc-4000-mobile-charging-service", "rel-tkmc-4000-mobile-charging-service", "A mobile EV charging service operator", "TKMC-4000", "AC Output / E-Generator and Engineering Power Supply", "high"),
  hypothesis("hyp-rel-tkmc-10000-pv-ess-integrator", "rel-tkmc-10000-pv-ess-integrator", "A PV-ESS integrator", "TKMC-10000", "PV Storage Charger and AC Output / E-Generator", "high"),
  hypothesis("hyp-rel-tkmc-10000-ci-solar-installer", "rel-tkmc-10000-ci-solar-installer", "A C&I solar installer", "TKMC-10000", "PV Storage Charger and AC Output / E-Generator", "medium"),
  hypothesis("hyp-rel-tkmc-10000-microgrid-epc", "rel-tkmc-10000-microgrid-epc", "A microgrid EPC", "TKMC-10000", "PV Storage Charger and AC Output / E-Generator", "medium"),
  hypothesis("hyp-rel-tkmc-2000-2600-cpo", "rel-tkmc-2000-2600-cpo", "A charge point operator", "TKMC-2000 or TKMC-2600", "PV-Storage Charging Station / Grid Complementary System", "high"),
  hypothesis("hyp-rel-tkmc-2000-2600-charging-developer", "rel-tkmc-2000-2600-charging-developer", "A charging-infrastructure developer", "TKMC-2000 or TKMC-2600", "PV-Storage Charging Station / Grid Complementary System", "high"),
  hypothesis("hyp-rel-tkmc-2000-2600-pv-ess-integrator", "rel-tkmc-2000-2600-pv-ess-integrator", "A PV-ESS integrator", "TKMC-2000 or TKMC-2600", "PV-Storage Charging Station / Grid Complementary System", "high"),
] as const satisfies readonly IcpHypothesis[];

export const icpHypothesisRegistry = {
  version: ICP_VALIDATION_POLICY_VERSION,
  hypotheses: icpHypotheses,
} as const satisfies IcpHypothesisRegistry;
