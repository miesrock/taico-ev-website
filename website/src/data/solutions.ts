export type Solution = {
  slug: string;
  eyebrow: string;
  title: string;
  headline: string;
  summary: string;
  pains: string[];
  approach: string[];
};

export const solutions = [
  {
    slug: "emergency-ev-charging",
    eyebrow: "Solution 01 · Mobile response",
    title: "Emergency EV Charging",
    headline: "Bring energy to the vehicle when the charger is not where it is needed.",
    summary:
      "A mobile energy storage charging system supports roadside EV rescue and other response-led charging deployments.",
    pains: [
      "An EV needs energy away from a fixed charging bay",
      "The response location changes from call to call",
      "Charging capacity must travel with the service operation",
    ],
    approach: [
      "Confirm vehicle, connector, and operating location requirements",
      "Select a mobile charging system with the required storage and output power",
      "Confirm final operating and deployment configuration before quotation",
    ],
  },
  {
    slug: "charge-on-demand",
    eyebrow: "Solution 02 · Flexible service",
    title: "Charge On Demand",
    headline: "Move charging capability to the vehicle instead of reserving a fixed bay.",
    summary:
      "A mobile energy storage charging robot supports on-demand EV charging where flexible positioning is required.",
    pains: [
      "Vehicles may not be parked beside a fixed charger",
      "Charging demand shifts between bays or operating periods",
      "Operators need a mobile charging format for the service workflow",
    ],
    approach: [
      "Map where vehicles wait and where charging service is required",
      "Assess travel paths, grades, clearance, and operating space",
      "Confirm final configuration and operating procedure before deployment",
    ],
  },
  {
    slug: "ac-output-e-generator",
    eyebrow: "Solution 03 · Field deployment",
    title: "AC Output / E-Generator",
    headline: "Combine mobile EV charging with AC output for E-Generator applications.",
    summary:
      "Mobile energy storage charging systems support mobile charging and AC output applications.",
    pains: [
      "Power demand moves with the operating location",
      "EV charging and AC output can be required at the same deployment",
      "A fixed installation may not match the operating location",
    ],
    approach: [
      "Define the DC charging and AC power requirements separately",
      "Review deployment access, transport, and operating conditions",
      "Confirm the project-specific power configuration",
    ],
  },
  {
    slug: "temporary-engineering-power",
    eyebrow: "Solution 04 · Field deployment",
    title: "Engineering Power Supply",
    headline: "Use mobile energy storage charging for engineering power supply applications.",
    summary: "Mobile energy storage charging systems support engineering power supply applications.",
    pains: [
      "Power demand moves with the engineering operation",
      "EV charging and site power can be required at the same deployment",
      "A fixed installation may not match the operating location",
    ],
    approach: [
      "Define the DC charging and engineering power requirements separately",
      "Review deployment access, transport, and operating conditions",
      "Confirm the project-specific power configuration",
    ],
  },
  {
    slug: "pv-storage-charger",
    eyebrow: "Solution 05 · Mobile energy",
    title: "PV Storage Charger",
    headline: "Use mobile energy storage charging for PV-storage charging applications.",
    summary: "Mobile energy storage charging systems support PV-storage charging applications.",
    pains: [
      "Charging demand must be served at a changing operating location",
      "PV-storage charging is required for the deployment",
      "A fixed charging installation may not match the operation",
    ],
    approach: [
      "Review the charging demand and operating location",
      "Confirm the PV-storage charging requirements",
      "Confirm the final system configuration before deployment",
    ],
  },
  {
    slug: "pv-ess-charging",
    eyebrow: "Solution 06 · Stationary energy",
    title: "PV-ESS Charging",
    headline: "Build charging capacity around energy storage, solar input, and the available grid connection.",
    summary:
      "Stationary energy storage charging systems support PV-storage charging stations and grid-complementary system applications.",
    pains: [
      "A charging site needs energy storage alongside DC charging",
      "Solar input may be part of the site energy design",
      "The available grid connection must be considered in the final configuration",
    ],
    approach: [
      "Review the site load, grid connection, and charging demand",
      "Determine whether PV input is required for the project",
      "Confirm the final station configuration and installation scope",
    ],
  },
] as const satisfies readonly Solution[];

export type SolutionSlug = (typeof solutions)[number]["slug"];

export function getSolution(slug: string) {
  return solutions.find((solution) => solution.slug === slug);
}
