export type Application = {
  slug: string;
  eyebrow: string;
  title: string;
  summary: string;
  solutionSlug: string;
};

/** Application wording is limited to the TAICO MC 2026 Catalog v1.3. */
export const applications = [
  {
    slug: "roadside-ev-rescue",
    eyebrow: "Application 01 · Catalog use",
    title: "Roadside EV Rescue",
    summary: "Mobile charging systems for roadside EV rescue applications.",
    solutionSlug: "emergency-ev-charging",
  },
  {
    slug: "on-demand-charging",
    eyebrow: "Application 02 · Catalog use",
    title: "On-Demand Charging",
    summary: "Mobile EV charging for flexible, on-demand service applications.",
    solutionSlug: "charge-on-demand",
  },
  {
    slug: "ac-output-e-generator",
    eyebrow: "Application 03 · Catalog use",
    title: "AC Output / E-Generator",
    summary: "Mobile charging systems with AC output for E-Generator applications.",
    solutionSlug: "ac-output-e-generator",
  },
  {
    slug: "engineering-power-supply",
    eyebrow: "Application 04 · Catalog use",
    title: "Engineering Power Supply",
    summary: "Mobile charging and AC output for engineering power supply applications.",
    solutionSlug: "temporary-engineering-power",
  },
  {
    slug: "pv-storage-charger",
    eyebrow: "Application 05 · Catalog use",
    title: "PV Storage Charger",
    summary: "Mobile energy storage charging for PV-storage charging applications.",
    solutionSlug: "pv-storage-charger",
  },
  {
    slug: "pv-ess-charging-station",
    eyebrow: "Application 06 · Catalog use",
    title: "PV-Storage Charging Station / Grid Complementary System",
    summary: "Stationary energy storage charging for PV-storage and grid-complementary systems.",
    solutionSlug: "pv-ess-charging",
  },
] as const satisfies readonly Application[];

export type ApplicationSlug = (typeof applications)[number]["slug"];

export function getApplication(slug: string) {
  return applications.find((application) => application.slug === slug);
}
