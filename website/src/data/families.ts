import type { ApplicationSlug } from "./applications.ts";
import type { ProductCategory } from "./products.ts";

export type FamilySeo = {
  title: string;
  description: string;
  primaryTopic: string;
};

export type FamilyOverview = {
  headline: string;
  body: string;
};

export type FamilyRanges = {
  capacityKwh?: string;
  outputPowerKw?: string;
  voltage?: string;
  connector?: string;
};

/**
 * Editorial scenarios used by the Family Page selector.
 * This is not the canonical Product → Application relation.
 */
export type FamilyUseCase = {
  title: string;
  description: string;
  applicationSlug?: ApplicationSlug;
  recommendedProductSlug?: string;
};

export type FamilySelectionGuide = {
  title: string;
  description: string;
};

export type FamilyFaq = {
  question: string;
  answer: string;
};

export type FamilyComparisonField =
  | "capacityKwh"
  | "outputPowerKw"
  | "outputVoltage"
  | "chargingGun"
  | "dimensions"
  | "weight"
  | "protectionLevel"
  | "hmi"
  | "chargeMode";

export type FamilyVisual = {
  src: string;
  alt: string;
  caption: string;
  /** Overlay copy side. Use "right" when the product subject sits on the left. */
  align?: "left" | "right";
};

export type ProductFamily = {
  slug: ProductCategory;
  title: string;
  shortTitle?: string;
  description: string;
  visual?: FamilyVisual;
  seo: FamilySeo;
  overview: FamilyOverview;
  ranges?: FamilyRanges;
  /** Family Page selector scenarios, not Product ↔ Application membership. */
  useCases: FamilyUseCase[];
  selectionGuide: FamilySelectionGuide[];
  comparisonFields: FamilyComparisonField[];
  faq?: FamilyFaq[];
  published: boolean;
};

export const productFamilies: ProductFamily[] = [
  {
    slug: "mobile-charging",
    title: "Mobile Charging Systems",
    shortTitle: "Mobile charging",
    description: "Battery-backed mobile charging for emergency and flexible deployment.",
    visual: {
      src: "/products/family/mobile-charging-hero.webp",
      alt: "TAICO mobile charging systems in a roadside and fleet-service charging context",
      caption: "Mobile charging application context. Catalog product photography, not a customer project.",
      align: "right",
    },
    seo: {
      title: "Mobile Charging Systems | Mobile EV Chargers | TAICO EV",
      description:
        "Compare TAICO EV mobile charging systems by published capacity, output power, and connector options. Start with TKMC-800 or TKMC-1500 for roadside EV rescue and mobile charger use.",
      primaryTopic: "mobile EV charging systems",
    },
    overview: {
      headline: "Transported energy storage charging for changing response locations.",
      body: "Mobile Charging Systems are battery-backed DC charging units that travel to the vehicle. The published catalog range covers mobile charger and roadside EV rescue use, with recharge from an EV DC charger or AC three-phase supply.",
    },
    useCases: [
      {
        title: "Roadside EV rescue",
        description: "Start with the lower-capacity published model when the service needs a transported charger for emergency EV charging.",
        applicationSlug: "roadside-ev-rescue",
        recommendedProductSlug: "tkmc-800",
      },
      {
        title: "Higher energy demand",
        description: "Move to the higher published capacity and output when the operating plan needs a larger energy handoff from the same mobile charging format.",
        applicationSlug: "roadside-ev-rescue",
        recommendedProductSlug: "tkmc-1500",
      },
    ],
    selectionGuide: [
      {
        title: "Daily energy demand",
        description: "Use published battery capacity to shortlist a model against the intended energy handoff, then confirm reserve, recharge, and operating conditions.",
      },
      {
        title: "Required charging power",
        description: "Use published DC output power as the output-power class. The receiving vehicle and configured charging path determine the actual session.",
      },
      {
        title: "Connector standard",
        description: "Both published models list GB/T, CCS1, CCS2, and CHAdeMO. Confirm the project connector, voltage range, and cable reach before quotation.",
      },
      {
        title: "Mobility requirement",
        description: "These systems are transported mobile chargers. If the service must drive the charger to the vehicle without a separate carrier, review the Charging Robot family.",
      },
    ],
    comparisonFields: ["capacityKwh", "outputPowerKw", "chargingGun", "dimensions", "weight", "protectionLevel"],
    faq: [
      {
        question: "How should a buyer choose between TKMC-800 and TKMC-1500?",
        answer:
          "Compare published battery capacity and DC output first: 75 kWh / 60 kW for TKMC-800 and 140 kWh / 120 kW for TKMC-1500. Then confirm vehicles, connectors, recharge source, and deployment constraints.",
      },
      {
        question: "Where do these specifications come from?",
        answer:
          "Public product facts are transcribed from TAICO MC 2026 Catalog v1.3. Final operating configuration remains project-specific.",
      },
    ],
    published: true,
  },
  {
    slug: "charging-robot",
    title: "Charging Robot",
    shortTitle: "Charging robot",
    description: "Self-propelled energy storage charging for on-demand service.",
    visual: {
      src: "/products/family/charging-robot-hero.webp",
      alt: "TAICO charging robot moving between parked electric vehicles in a commercial parking facility",
      caption: "On-demand charging application context. Catalog product photography, not a customer project.",
      align: "right",
    },
    seo: {
      title: "Charging Robot | Self-Propelled Mobile EV Charger | TAICO EV",
      description:
        "Review the TAICO EV charging robot format. TKMC-1000 is a self-propelled mobile energy storage charging system for on-demand EV charging service.",
      primaryTopic: "self-propelled mobile EV charging robot",
    },
    overview: {
      headline: "Move the charger to the vehicle when a fixed bay is not the operating format.",
      body: "The Charging Robot family is a self-propelled mobile energy storage charging system. Published catalog data includes DC charging output plus robot mobility fields such as speed range, gradeability, turning radius, and drive method.",
    },
    useCases: [
      {
        title: "On-demand charging",
        description: "Use the published charging robot when charging demand must travel to parked vehicles instead of reserving a fixed bay.",
        applicationSlug: "on-demand-charging",
        recommendedProductSlug: "tkmc-1000",
      },
    ],
    selectionGuide: [
      {
        title: "Deployment type",
        description: "Choose this family when the operating procedure requires a self-propelled charger rather than a transported mobile charging system.",
      },
      {
        title: "Travel path and grade",
        description: "Review published wheelbase, ground clearance, parking slope, gradeability, and turning radius against the intended service path.",
      },
      {
        title: "Energy and power class",
        description: "The published robot lists 100 kWh battery capacity and 90 kW DC output. Confirm whether that class matches the intended service window.",
      },
      {
        title: "Connector standard",
        description: "The published model lists GB/T, CCS1, CCS2, and CHAdeMO. Confirm the project connector and vehicle mix before quotation.",
      },
    ],
    comparisonFields: ["capacityKwh", "outputPowerKw", "chargingGun", "dimensions", "weight", "protectionLevel"],
    faq: [
      {
        question: "How is a charging robot different from a mobile charging system?",
        answer:
          "The published Charging Robot is self-propelled and includes robot mobility data. Mobile Charging Systems are transported energy storage chargers without that self-propelled format.",
      },
      {
        question: "Where do these specifications come from?",
        answer:
          "Public product facts are transcribed from TAICO MC 2026 Catalog v1.3. Final operating configuration remains project-specific.",
      },
    ],
    published: true,
  },
  {
    slug: "mobile-power",
    title: "Mobile Power Systems",
    shortTitle: "Mobile power",
    description: "Higher-capacity charging and temporary power deployment.",
    visual: {
      src: "/products/family/mobile-power-hero.webp",
      alt: "TAICO mobile power systems arranged by increasing energy-storage scale at a temporary-power site",
      caption: "Field power application context. Catalog product photography, not a customer project.",
    },
    seo: {
      title: "Mobile Power Systems | High-Capacity Mobile Charging | TAICO EV",
      description:
        "Compare TAICO EV mobile power systems by published capacity, DC output, and AC output. Review TKMC-2000P, TKMC-4000, and TKMC-10000 for field and engineering deployment.",
      primaryTopic: "mobile power and high-capacity EV charging",
    },
    overview: {
      headline: "Higher-capacity mobile energy storage for charging and field power.",
      body: "Mobile Power Systems combine larger published energy storage with DC charging and selected AC output. Catalog applications include mobile charger, AC output / E-generator, engineering power supply, and PV-storage charging, depending on the model.",
    },
    useCases: [
      {
        title: "AC output / E-generator",
        description: "Start with TKMC-2000P when the deployment needs mobile charging plus published AC output in a still-transportable format.",
        applicationSlug: "ac-output-e-generator",
        recommendedProductSlug: "tkmc-2000p",
      },
      {
        title: "Engineering power supply",
        description: "Review TKMC-4000 when the catalog application includes engineering power supply alongside mobile charging and AC output.",
        applicationSlug: "engineering-power-supply",
        recommendedProductSlug: "tkmc-4000",
      },
      {
        title: "Higher energy / PV storage charger",
        description: "Review TKMC-10000 when the operating plan needs the largest published mobile capacity and PV-storage charging as a catalog use.",
        applicationSlug: "pv-storage-charger",
        recommendedProductSlug: "tkmc-10000",
      },
    ],
    selectionGuide: [
      {
        title: "Daily energy demand",
        description: "Published capacity steps from 200 kWh to 1,000 kWh. Shortlist against the intended operating window before comparing transport and site access.",
      },
      {
        title: "Required charging power",
        description: "Published DC output steps from 120 kW to 480 kW. Confirm the vehicle mix and whether AC output is also required at the same deployment.",
      },
      {
        title: "Deployment type",
        description: "These systems are larger mobile units. Review published size and weight against transport, access, and operating location constraints.",
      },
      {
        title: "Connector quantity",
        description: "Published charging-gun counts increase with model size. Confirm how many vehicles must be served at once.",
      },
    ],
    comparisonFields: ["capacityKwh", "outputPowerKw", "chargingGun", "dimensions", "weight", "protectionLevel"],
    faq: [
      {
        question: "Which mobile power system is the usual starting point?",
        answer:
          "Use the catalog application first: AC output points to TKMC-2000P, engineering power supply to TKMC-4000, and PV-storage charging to TKMC-10000. Then compare published capacity, output, size, and weight.",
      },
      {
        question: "Where do these specifications come from?",
        answer:
          "Public product facts are transcribed from TAICO MC 2026 Catalog v1.3. Final operating configuration remains project-specific.",
      },
    ],
    published: true,
  },
  {
    slug: "stationary-charging",
    title: "Stationary Charging Systems",
    shortTitle: "Stationary charging",
    description: "PV-storage charging and grid-complementary deployment.",
    visual: {
      src: "/products/family/stationary-charging-hero.webp",
      alt: "TAICO stationary energy storage charging systems at a commercial PV-storage charging site",
      caption: "PV-storage charging application context. Catalog product photography, not a customer project.",
    },
    seo: {
      title: "Stationary Charging Systems | PV-Storage Charging | TAICO EV",
      description:
        "Compare TAICO EV stationary energy storage charging systems. TKMC-2000 and TKMC-2600 support PV-storage charging stations and grid-complementary deployment.",
      primaryTopic: "stationary PV-storage EV charging systems",
    },
    overview: {
      headline: "Stationary energy storage charging for PV-storage and grid-complementary sites.",
      body: "Stationary Charging Systems are fixed energy storage charging units. Published catalog applications are PV-storage charging stations and grid-complementary systems, with AC three-phase recharge and optional solar PV-IN.",
    },
    useCases: [
      {
        title: "PV-storage charging station",
        description: "Start with TKMC-2000 when a site needs stationary energy storage charging around the available grid connection.",
        applicationSlug: "pv-ess-charging-station",
        recommendedProductSlug: "tkmc-2000",
      },
      {
        title: "Higher-capacity stationary deployment",
        description: "Review TKMC-2600 when the same stationary format needs the higher published capacity.",
        applicationSlug: "pv-ess-charging-station",
        recommendedProductSlug: "tkmc-2600",
      },
    ],
    selectionGuide: [
      {
        title: "Site energy demand",
        description: "Compare published 200 kWh and 261 kWh capacities against the intended station operating window.",
      },
      {
        title: "Grid connection and PV input",
        description: "Both published models list AC three-phase recharge and optional solar PV-IN. Confirm whether PV input is required for the project.",
      },
      {
        title: "Deployment type",
        description: "Choose this family for stationary installation. Mobile charging, robot, and mobile power families cover transported or self-propelled formats.",
      },
      {
        title: "Connector standard",
        description: "Both published models list GB/T ×2 with CCS1, CCS2, and CHAdeMO options. Confirm the project connector configuration before quotation.",
      },
    ],
    comparisonFields: ["capacityKwh", "outputPowerKw", "chargingGun", "chargeMode", "dimensions", "weight"],
    faq: [
      {
        question: "How should a buyer choose between TKMC-2000 and TKMC-2600?",
        answer:
          "Both are stationary energy storage charging systems with 120 kW published DC output. Choose between 200 kWh and 261 kWh published capacity, then confirm grid connection, PV input, and installation scope.",
      },
      {
        question: "Where do these specifications come from?",
        answer:
          "Public product facts are transcribed from TAICO MC 2026 Catalog v1.3. Final operating configuration remains project-specific.",
      },
    ],
    published: true,
  },
];

export function getPublishedFamilies() {
  return productFamilies.filter((family) => family.published);
}

export function getProductFamily(slug: string) {
  return getPublishedFamilies().find((family) => family.slug === slug);
}

export function getFamilyHref(slug: string) {
  return `/products/category/${slug}/`;
}
