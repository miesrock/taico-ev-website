import type { ApplicationSlug } from "./applications";
import type { SolutionFaq, SolutionSlug } from "./solutions";

export type SpecRow = { label: string; value: string };

export type ProductCategory =
  | "mobile-charging"
  | "charging-robot"
  | "mobile-power"
  | "stationary-charging";

export type CatalogSource = {
  version: "1.3";
  page: number;
};

export type ProductSeo = {
  title: string;
  description: string;
};

export type JsonLd = Record<string, unknown>;

export type Product = {
  slug: string;
  model: string;
  productType: string;
  category: ProductCategory;
  summary: string;
  capacityKwh: number;
  outputPowerKw: number;
  outputVoltage: string;
  outputCurrent: string;
  hmi: string;
  chargeMode: string;
  workingTemperature: string;
  cableLengthM: number;
  chargingGun: string;
  /** Model-specific catalog rows, including recharge modes and robot mobility data. */
  specs: SpecRow[];
  dimensions: string;
  weight: string;
  protectionLevel: string;
  capabilities: string[];
  /** Exact wording from the catalog; not the site's application entity relation. */
  catalogApplications: string[];
  solutionSlugs: SolutionSlug[];
  applicationSlugs: ApplicationSlug[];
  hero: string;
  applicationImage: string;
  catalogSource: CatalogSource;
  published: boolean;
};

export const productCategories: { slug: ProductCategory; title: string; description: string }[] = [
  {
    slug: "mobile-charging",
    title: "Mobile Charging Systems",
    description: "Battery-backed mobile charging for emergency and flexible deployment.",
  },
  {
    slug: "charging-robot",
    title: "Charging Robot",
    description: "Self-propelled energy storage charging for on-demand service.",
  },
  {
    slug: "mobile-power",
    title: "Mobile Power Systems",
    description: "Higher-capacity charging and temporary power deployment.",
  },
  {
    slug: "stationary-charging",
    title: "Stationary Charging Systems",
    description: "PV-storage charging and grid-complementary deployment.",
  },
];

/**
 * Public facts are transcribed from TAICO MC 2026 Catalog v1.3, pages 4–11.
 * Keep new product claims, images, and specs in this file so navigation, routes,
 * comparison, and recommendations cannot drift apart. `chargingGun` normalizes
 * catalog `GBT` / `GBT*2` / `GBT*4` notation to the industry display form
 * `GB/T` / `GB/T ×2` / `GB/T ×4`; connector types and quantities are unchanged.
 */
export const products: Product[] = [
  {
    slug: "tkmc-800",
    model: "TKMC-800",
    productType: "Mobile Energy Storage Charging System",
    category: "mobile-charging",
    summary: "Mobile energy storage charging for mobile charger and roadside EV rescue applications.",
    capacityKwh: 75,
    outputPowerKw: 60,
    outputVoltage: "DC 200–1000 V",
    outputCurrent: "0–150 A",
    hmi: '7" Touching Screen',
    chargeMode: "Single-player / OCPP 1.6J",
    workingTemperature: "−10 °C to 60 °C",
    cableLengthM: 7,
    chargingGun: "GB/T / CCS1 / CCS2 / CHAdeMO",
    specs: [
      { label: "Recharge mode 1", value: "EV DC Charger" },
      { label: "Recharge mode 2", value: "AC 3-phase / 20 kW" },
    ],
    dimensions: "1580 × 925 × 1050 mm",
    weight: "≈900 kg",
    protectionLevel: "IP54",
    capabilities: ["Mobile charging"],
    catalogApplications: ["Mobile Charger", "Roadside EV Rescue"],
    solutionSlugs: ["mobile-ev-charger-roadside-rescue"],
    applicationSlugs: ["roadside-ev-rescue"],
    hero: "/products/tkmc-800-hero.webp",
    applicationImage: "/products/tkmc-800-application.webp",
    catalogSource: { version: "1.3", page: 4 },
    published: true,
  },
  {
    slug: "tkmc-1500",
    model: "TKMC-1500",
    productType: "Mobile Energy Storage Charging System",
    category: "mobile-charging",
    summary: "Mobile energy storage charging for mobile charger and roadside EV rescue applications.",
    capacityKwh: 140,
    outputPowerKw: 120,
    outputVoltage: "DC 200–1000 V",
    outputCurrent: "0–250 A",
    hmi: '7" Touching Screen',
    chargeMode: "Single-player / OCPP 1.6J",
    workingTemperature: "−10 °C to 60 °C",
    cableLengthM: 7,
    chargingGun: "GB/T / CCS1 / CCS2 / CHAdeMO",
    specs: [
      { label: "Recharge mode 1", value: "EV DC Charger" },
      { label: "Recharge mode 2", value: "AC 3-phase / 40 kW" },
    ],
    dimensions: "2300 × 1200 × 1000 mm",
    weight: "≈1682 kg",
    protectionLevel: "IP54",
    capabilities: ["Mobile charging"],
    catalogApplications: ["Mobile Charger", "Roadside EV Rescue"],
    solutionSlugs: ["mobile-ev-charger-roadside-rescue"],
    applicationSlugs: ["roadside-ev-rescue"],
    hero: "/products/tkmc-1500-hero.webp",
    applicationImage: "/products/tkmc-1500-application.webp",
    catalogSource: { version: "1.3", page: 5 },
    published: true,
  },
  {
    slug: "tkmc-1000",
    model: "TKMC-1000",
    productType: "Mobile Energy Storage Charging Robot",
    category: "charging-robot",
    summary: "Self-propelled mobile energy storage charging for mobile EV charger applications.",
    capacityKwh: 100,
    outputPowerKw: 90,
    outputVoltage: "DC 200–1000 V",
    outputCurrent: "0–150 A",
    hmi: '7" Touching Screen',
    chargeMode: "Single-player / OCPP 1.6J",
    workingTemperature: "−10 °C to 60 °C",
    cableLengthM: 5,
    chargingGun: "GB/T / CCS1 / CCS2 / CHAdeMO",
    specs: [
      { label: "Recharge mode 1", value: "EV DC Charger" },
      { label: "Recharge mode 2", value: "AC 3-phase / 20 kW" },
      { label: "Wheelbase", value: "1100 mm" },
      { label: "Minimum ground clearance", value: "100 mm" },
      { label: "Parking slope", value: "25%" },
      { label: "Maximum gradeability at full load", value: "20%" },
      { label: "Minimum turning radius", value: "2.5 m" },
      { label: "Drive method", value: "Rear-wheel drive" },
      { label: "Front/rear brake type", value: "Drum brake" },
      { label: "Parking brake type", value: "EPB electronic parking brake (rear wheels with speed sensors)" },
      { label: "Drive motor power", value: "3 kW" },
      { label: "Full-load range", value: "Depends on the vehicle's total energy storage battery capacity" },
      { label: "Speed range", value: "1–15 km/h" },
      { label: "Control communication method", value: "CAN 2.0B" },
    ],
    dimensions: "2035 × 920 × 1491 mm",
    weight: "≈1256 kg",
    protectionLevel: "IP54",
    capabilities: ["Self-propelled mobile charging"],
    catalogApplications: ["Mobile EV Charger"],
    solutionSlugs: ["charge-on-demand"],
    applicationSlugs: ["on-demand-charging"],
    hero: "/products/tkmc-1000-hero.webp",
    applicationImage: "/products/tkmc-1000-application.webp",
    catalogSource: { version: "1.3", page: 6 },
    published: true,
  },
  {
    slug: "tkmc-2000p",
    model: "TKMC-2000P",
    productType: "Mobile Energy Storage Charging System",
    category: "mobile-power",
    summary: "Mobile energy storage charging with AC output for flexible mobile deployment.",
    capacityKwh: 200,
    outputPowerKw: 120,
    outputVoltage: "DC 200–1000 V",
    outputCurrent: "0–250 A",
    hmi: '10" Touching Screen',
    chargeMode: "Single-player / OCPP 1.6J",
    workingTemperature: "−10 °C to 60 °C",
    cableLengthM: 7,
    chargingGun: "GB/T ×2 (CCS1 / CCS2 / CHAdeMO)",
    specs: [
      { label: "Recharge mode", value: "EV DC Charger + AC three phase" },
      { label: "AC output", value: "AC single / three phase" },
    ],
    dimensions: "2660 × 1250 × 1300 mm",
    weight: "≈2500 kg",
    protectionLevel: "IP54",
    capabilities: ["Mobile charging", "AC output"],
    catalogApplications: ["Mobile Charger", "AC Output"],
    solutionSlugs: ["ac-output-e-generator"],
    applicationSlugs: ["ac-output-e-generator"],
    hero: "/products/tkmc-2000p-hero.webp",
    applicationImage: "/products/tkmc-2000p-application.webp",
    catalogSource: { version: "1.3", page: 7 },
    published: true,
  },
  {
    slug: "tkmc-4000",
    model: "TKMC-4000",
    productType: "Mobile Energy Storage EV Charger",
    category: "mobile-power",
    summary: "Mobile energy storage EV charging for AC output and engineering power supply applications.",
    capacityKwh: 400,
    outputPowerKw: 360,
    outputVoltage: "DC 200–1000 V",
    outputCurrent: "0–250 A",
    hmi: '10" Touching Screen',
    chargeMode: "Single-player / OCPP 1.6J",
    workingTemperature: "−10 °C to 60 °C",
    cableLengthM: 7,
    chargingGun: "GB/T ×2 (CCS1 / CCS2 / CHAdeMO)",
    specs: [
      { label: "Recharge mode 1", value: "EV DC Charger" },
      { label: "Recharge mode 2", value: "AC 3-phase / 120 kW" },
    ],
    dimensions: "3500 × 1750 × 1250 mm",
    weight: "≈4800 kg",
    protectionLevel: "IP54",
    capabilities: ["Mobile charging", "AC output", "Engineering power supply"],
    catalogApplications: ["Mobile Charger", "AC Output", "Engineering Power Supply"],
    solutionSlugs: ["ac-output-e-generator", "temporary-engineering-power"],
    applicationSlugs: ["ac-output-e-generator", "engineering-power-supply"],
    hero: "/products/tkmc-4000-hero.webp",
    applicationImage: "/products/tkmc-4000-application.webp",
    catalogSource: { version: "1.3", page: 8 },
    published: true,
  },
  {
    slug: "tkmc-10000",
    model: "TKMC-10000",
    productType: "Mobile Energy Storage Charging System",
    category: "mobile-power",
    summary: "Large mobile energy storage charging for PV-storage charging and AC output applications.",
    capacityKwh: 1000,
    outputPowerKw: 480,
    outputVoltage: "DC 200–1000 V",
    outputCurrent: "0–250 A",
    hmi: '10" Touching Screen ×2',
    chargeMode: "Single-player / OCPP 1.6J",
    workingTemperature: "−10 °C to 60 °C",
    cableLengthM: 7,
    chargingGun: "GB/T ×4 (CCS1 / CCS2 / CHAdeMO)",
    specs: [
      { label: "Recharge mode 1", value: "EV DC Charger" },
      { label: "Recharge mode 2", value: "AC 3-phase / 240 kW" },
    ],
    dimensions: "6058 × 2550 × 2441 mm",
    weight: "≈17000 kg",
    protectionLevel: "IP54",
    capabilities: ["Mobile charging", "PV-storage charging", "AC output"],
    catalogApplications: ["Mobile Charger", "PV Storage Charger", "AC Output"],
    solutionSlugs: ["ac-output-e-generator", "pv-storage-charger"],
    applicationSlugs: ["ac-output-e-generator", "pv-storage-charger"],
    hero: "/products/tkmc-10000-hero.webp",
    applicationImage: "/products/tkmc-10000-application.webp",
    catalogSource: { version: "1.3", page: 9 },
    published: true,
  },
  {
    slug: "tkmc-2000",
    model: "TKMC-2000",
    productType: "Stationary Energy Storage Charging System",
    category: "stationary-charging",
    summary: "Stationary energy storage charging for PV-storage charging stations and grid-complementary systems.",
    capacityKwh: 200,
    outputPowerKw: 120,
    outputVoltage: "DC 200–1000 V",
    outputCurrent: "0–250 A",
    hmi: '10" Touching Screen',
    chargeMode: "Single-player / OCPP 1.6J",
    workingTemperature: "−10 °C to 60 °C",
    cableLengthM: 7,
    chargingGun: "GB/T ×2 (CCS1 / CCS2 / CHAdeMO)",
    specs: [
      { label: "Recharge mode 1", value: "AC 3-phase / 30 kW" },
      { label: "Recharge mode 2", value: "Solar PV-IN (optional)" },
    ],
    dimensions: "1300 × 1100 × 2077 mm",
    weight: "≈2161 kg",
    protectionLevel: "IP54",
    capabilities: ["PV-storage charging", "Grid-complementary deployment"],
    catalogApplications: ["PV-Storage Charging Station", "Grid Complementary System"],
    solutionSlugs: ["pv-ess-charging"],
    applicationSlugs: ["pv-ess-charging-station"],
    hero: "/products/tkmc-2000-hero.webp",
    applicationImage: "/products/tkmc-2000-application.webp",
    catalogSource: { version: "1.3", page: 10 },
    published: true,
  },
  {
    slug: "tkmc-2600",
    model: "TKMC-2600",
    productType: "Stationary Energy Storage Charging System",
    category: "stationary-charging",
    summary: "Stationary energy storage charging for PV-storage charging stations and grid-complementary systems.",
    capacityKwh: 261,
    outputPowerKw: 120,
    outputVoltage: "DC 200–1000 V",
    outputCurrent: "0–250 A",
    hmi: '10" Touching Screen',
    chargeMode: "OCPP 1.6J / touching",
    workingTemperature: "−10 °C to 60 °C",
    cableLengthM: 7,
    chargingGun: "GB/T ×2 (CCS1 / CCS2 / CHAdeMO)",
    specs: [
      { label: "Recharge mode 1", value: "AC 3-phase / 40 kW" },
      { label: "Recharge mode 2", value: "Solar PV-IN (optional)" },
    ],
    dimensions: "1300 × 1100 × 2077 mm",
    weight: "≈2365 kg",
    protectionLevel: "IP54",
    capabilities: ["PV-storage charging", "Grid-complementary deployment"],
    catalogApplications: ["PV-Storage Charging Station", "Grid Complementary System"],
    solutionSlugs: ["pv-ess-charging"],
    applicationSlugs: ["pv-ess-charging-station"],
    hero: "/products/tkmc-2600-hero.webp",
    applicationImage: "/products/tkmc-2600-application.webp",
    catalogSource: { version: "1.3", page: 11 },
    published: true,
  },
];

export function getPublishedProducts() {
  return products.filter((product) => product.published);
}

export function getProduct(slug: string) {
  return getPublishedProducts().find((product) => product.slug === slug);
}

export function getProductsForSolution(slug: string) {
  return getPublishedProducts().filter((product) => product.solutionSlugs.includes(slug));
}

/** Resolve an explicitly ordered landing-page shortlist without duplicating product facts. */
export function getFeaturedProductsForSolution(slug: string, featuredProductSlugs?: readonly string[]) {
  if (!featuredProductSlugs?.length) return getProductsForSolution(slug);

  const publishedBySlug = new Map(getPublishedProducts().map((product) => [product.slug, product]));
  return featuredProductSlugs.map((productSlug) => {
    const product = publishedBySlug.get(productSlug);
    if (!product) {
      throw new Error(`Unknown or unpublished featured product "${productSlug}" for solution "${slug}"`);
    }
    return product;
  });
}

/** Resolve product-backed FAQ tokens from the same published facts used by the page cards. */
export function resolveSolutionFaq(faq: readonly SolutionFaq[] | undefined, featuredProducts: readonly Product[]) {
  if (!faq?.length) return [];

  const productBySlug = new Map(featuredProducts.map((product) => [product.slug, product]));
  const tokenPattern = /\{\{([a-z0-9-]+)\.(capacityKwh|outputPowerKw|chargingGun|model)\}\}/g;
  return faq.map((item) => ({
    ...item,
    answer: item.answer.replace(tokenPattern, (_token, slug: string, field: "capacityKwh" | "outputPowerKw" | "chargingGun" | "model") => {
      const product = productBySlug.get(slug);
      if (!product) throw new Error(`Unknown FAQ product "${slug}"`);
      return String(product[field]);
    }),
  }));
}

export function getProductsForApplication(slug: string) {
  return getPublishedProducts().filter((product) => product.applicationSlugs.includes(slug));
}

export function getProductSpecs(product: Product): SpecRow[] {
  return [
    { label: "Battery capacity", value: `${product.capacityKwh} kWh` },
    { label: "Output power", value: `${product.outputPowerKw} kW` },
    { label: "Output voltage", value: product.outputVoltage },
    { label: "Output current", value: product.outputCurrent },
    { label: "HMI", value: product.hmi },
    { label: "Charge mode", value: product.chargeMode },
    { label: "Working temperature", value: product.workingTemperature },
    { label: "Charger cable length", value: `${product.cableLengthM} m` },
    { label: "Charging gun", value: product.chargingGun },
    ...product.specs,
    { label: "Size", value: product.dimensions },
    { label: "Weight", value: product.weight },
    { label: "Protection level", value: product.protectionLevel },
  ];
}

export function getProductSeo(product: Product): ProductSeo {
  return {
    title: `${product.model} | ${product.productType} | TAICO EV`,
    description: product.summary,
  };
}

export function getProductStructuredData(product: Product, site: URL | string): JsonLd[] {
  const productUrl = new URL(`/products/${product.slug}/`, site).href;

  // ponytail: Re-add Product rich-result markup only after verified price or review data exists.
  return [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: new URL("/", site).href },
        { "@type": "ListItem", position: 2, name: "Products", item: new URL("/products/", site).href },
        { "@type": "ListItem", position: 3, name: product.model, item: productUrl },
      ],
    },
  ];
}
