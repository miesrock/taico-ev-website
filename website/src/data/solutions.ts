export type SolutionSeo = {
  title: string;
  description: string;
};

export type SolutionUseCase = {
  title: string;
  description: string;
  steps?: readonly string[];
};

export type SolutionFaq = {
  question: string;
  answer: string;
};

export type SolutionRelatedLink = {
  label: string;
  href: string;
  description?: string;
};

export type Solution = {
  slug: string;
  eyebrow: string;
  title: string;
  headline: string;
  summary: string;
  pains: readonly string[];
  approach: readonly string[];
  seo?: SolutionSeo;
  h1?: string;
  intro?: string;
  useCase?: SolutionUseCase;
  capabilities?: readonly string[];
  featuredProductSlugs?: readonly string[];
  faq?: readonly SolutionFaq[];
  relatedLinks?: readonly SolutionRelatedLink[];
};

export const solutions = [
  {
    slug: "mobile-ev-charger-roadside-rescue",
    eyebrow: "Solution 01 · Mobile response",
    title: "Mobile EV Charger for Roadside Rescue",
    headline: "Bring charging capability to the vehicle when fixed charging infrastructure cannot reach it.",
    summary:
      "Off-grid mobile energy storage charging systems support emergency EV charging, roadside rescue, and field deployment workflows.",
    seo: {
      title: "Mobile EV Charger for Roadside Rescue | Emergency Charging System | TAICO EV",
      description:
        "TAICO EV provides off-grid mobile energy storage charging systems for emergency EV charging, roadside rescue and field deployment. Explore configurations and request a quote.",
    },
    h1: "Mobile EV Charging Solutions for Roadside Rescue",
    intro:
      "When fixed charging infrastructure cannot reach the vehicle, mobile energy storage charging brings a configured charging system to the roadside response location.",
    pains: [
      "Emergency EV charging for a stranded vehicle",
      "No fixed grid connection at the response location",
      "Roadside assistance teams need mobile deployment",
      "On-demand charging capacity must move with the service operation",
    ],
    approach: [
      "Confirm vehicle, connector, and operating location requirements",
      "Select a mobile charging system with the required storage and output power",
      "Confirm final operating and deployment configuration before quotation",
    ],
    useCase: {
      title: "Roadside rescue workflow",
      description:
        "A roadside assistance operation can use a mobile charging system as part of its response workflow when a stranded EV is away from a fixed charging bay.",
      steps: [
        "Rescue request received",
        "Mobile charging vehicle reaches stranded EV",
        "Compatible charging connection is established",
        "Emergency energy is delivered",
        "Vehicle continues to a fixed charging location",
      ],
    },
    capabilities: [
      "Mobile energy storage charging for field deployment",
      "DC charging output selected from published model data",
      "Charging connector options vary by product configuration",
      "Project-specific configuration review before quotation",
    ],
    featuredProductSlugs: ["tkmc-800", "tkmc-1500", "tkmc-2000p"],
    faq: [
      {
        question: "How much charging power can the TKMC-800 provide?",
        answer:
          "The published TKMC-800 product data lists up to {{tkmc-800.outputPowerKw}} kW DC output and {{tkmc-800.capacityKwh}} kWh battery capacity. Final operating configuration should be confirmed for the project.",
      },
      {
        question: "Which EV charging connectors are supported?",
        answer:
          "Connector support depends on the model and configuration. The TKMC-800 lists {{tkmc-800.chargingGun}} and the TKMC-1500 lists {{tkmc-1500.chargingGun}} in the published product data. The TKMC-2000P lists {{tkmc-2000p.chargingGun}}.",
      },
      {
        question: "Can a mobile charger support a roadside response away from a fixed charging bay?",
        answer:
          "The roadside rescue solution is intended for mobile and off-grid deployment scenarios where a fixed charging bay may not be available. Confirm recharge, vehicle, connector, and site requirements with TAICO EV.",
      },
    ],
    relatedLinks: [
      { label: "TKMC-800", href: "/products/tkmc-800/", description: "Mobile charging system with published roadside EV rescue use." },
      { label: "TKMC-1500", href: "/products/tkmc-1500/", description: "Mobile charging system with published roadside EV rescue use." },
      { label: "TKMC-2000P", href: "/products/tkmc-2000p/", description: "Broader mobile power and AC output option for field deployment." },
      { label: "Mobile EV Charging Buyer's Guide", href: "/resources/articles/mobile-ev-charging-guide/", description: "Qualify the operating scenario, energy, power, connectors, and deployment format." },
      { label: "Product Comparison", href: "/resources/product-comparison/", description: "Compare published capacity and output power across the TKMC range." },
      { label: "Request a system configuration", href: "/contact/", description: "Share vehicle, connector, site, and deployment requirements with TAICO EV." },
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

export type SolutionStructuredData = Record<string, unknown>;

export function getSolutionStructuredData(
  solution: Solution,
  site: URL | string,
  faq: readonly SolutionFaq[] | undefined = solution.faq,
): SolutionStructuredData[] {
  const siteUrl = new URL("/", site).href;
  const solutionUrl = new URL(`/solutions/${solution.slug}/`, siteUrl).href;
  const breadcrumbId = `${solutionUrl}#breadcrumb`;
  const structuredData: SolutionStructuredData[] = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${solutionUrl}#webpage`,
      url: solutionUrl,
      name: solution.h1 ?? solution.title,
      description: solution.seo?.description ?? solution.summary,
      inLanguage: "en",
      isPartOf: { "@id": `${siteUrl}#website` },
      breadcrumb: { "@id": breadcrumbId },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": breadcrumbId,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Solutions", item: `${siteUrl}#solutions` },
        { "@type": "ListItem", position: 3, name: solution.title, item: solutionUrl },
      ],
    },
  ];

  if (faq?.length) {
    structuredData.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${solutionUrl}#faq`,
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
  }

  return structuredData;
}
