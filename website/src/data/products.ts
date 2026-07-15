export type SpecRow = { label: string; value: string };

export type Product = {
  slug: string;
  tier: string;
  model: string;
  title: string;
  headline: string;
  summary: string;
  hero: string;
  gallery?: string[];
  bestFor: string[];
  solves: string[];
  features: string[];
  specs: SpecRow[];
  connectors: string[];
  relatedSolutions: string[];
  note?: string;
};

/**
 * Specs aligned to OEM catalog sheets (Xiaofu line) under TAICO EV brand.
 * Do not invent unverified certifications or performance claims.
 */
export const products: Product[] = [
  {
    slug: "g2v",
    tier: "01 · Portable & Flexible",
    model: "G2V",
    title: "G2V Portable Flexible Charging",
    headline: "Move charging capacity across the lot — without waiting for fixed bays.",
    summary:
      "Compact, rollable EV charging unit for dealerships, temporary events, and light commercial sites that need flexible DC charging without grid expansion projects.",
    hero: "/products/g2v-hero.jpg",
    bestFor: [
      "Automotive dealers & 4S stores",
      "Demo / delivery vehicle support",
      "Temporary events and overflow bays",
      "Light commercial parking operators",
    ],
    solves: [
      "Fixed chargers are full or not yet installed",
      "Need to charge vehicles where they park",
      "Want a lower-threshold entry into mobile charging service",
    ],
    features: [
      "Portable footprint for on-lot repositioning",
      "Touch HMI for operator-friendly sessions",
      "Cable reel form factor for quick connect",
      "Designed for commercial service workflows, not only DIY parking",
    ],
    specs: [
      { label: "Product class", value: "Portable / flexible mobile DC charging" },
      { label: "Primary use", value: "Dealership & temporary commercial charging" },
      { label: "Deployment", value: "Rollable / relocatable on site" },
      { label: "Connector options", value: "CCS / GB/T / CHAdeMO (project configured)" },
      { label: "Protection", value: "Outdoor commercial operation (IP-class unit dependent)" },
      { label: "Brand", value: "TAICO EV" },
    ],
    connectors: ["CCS1 / CCS2", "GB/T", "CHAdeMO (optional)"],
    relatedSolutions: [
      "ev-dealership-charging",
      "ev-charging-without-grid-upgrade",
    ],
    note: "G2V is positioned as the entry portable tier for retail and temporary charging. Final power and battery configuration confirmed per project quote.",
  },
  {
    slug: "mobile-battery-station",
    tier: "02 · Mobile Battery Station",
    model: "M75",
    title: "Mobile Battery Charging Station",
    headline: "Bring 60 kW DC charging to the vehicle — roadside, hotel, or service van.",
    summary:
      "Battery-backed mobile charging station for roadside assistance, doorstep charging, and premium automotive service. Catalog baseline: 75 kWh storage with 60 kW DC output (XF-7560 class).",
    hero: "/products/m75-hero.jpg",
    gallery: ["/products/m75-hero-alt.jpg"],
    bestFor: [
      "Roadside assistance & insurance partners",
      "Mobile charging operators",
      "Hotels, clubs, and property concierge charging",
      "High-end doorstep / membership services",
    ],
    solves: [
      "Stranded EV drivers need on-site energy, not only a tow",
      "Fixed infrastructure cannot reach premium or temporary locations",
      "Operators want a billable mobile charging service asset",
    ],
    features: [
      "Integrated battery + DC fast charge architecture",
      "Van-mountable / pallet-deployable form factors in the product family",
      "Multi-standard gun options for international fleets",
      "IP54 outdoor-oriented cabinet design (catalog baseline)",
    ],
    specs: [
      { label: "Battery capacity", value: "75 kWh (catalog baseline)" },
      { label: "Output power", value: "60 kW DC" },
      { label: "Output voltage", value: "DC 200–1000 V" },
      { label: "Output current", value: "0–150 A" },
      { label: "HMI", value: '7" touch screen' },
      { label: "Cable length", value: "7 m (typical)" },
      { label: "Charger standards", value: "GB/T · CCS1 · CCS2 · CHAdeMO" },
      { label: "Recharge mode", value: "EV DC charger + AC 3-phase ~20 kW (catalog)" },
      { label: "Size (approx.)", value: "1580 × 925 × 1050 mm" },
      { label: "Weight (approx.)", value: "~900 kg" },
      { label: "Working temperature", value: "−10 °C to 60 °C" },
      { label: "Protection", value: "IP54" },
    ],
    connectors: ["GB/T", "CCS1", "CCS2", "CHAdeMO"],
    relatedSolutions: ["ev-roadside-assistance", "ev-dealership-charging"],
    note: "Specs reflect OEM catalog baseline (XF-7560 class) under TAICO EV brand. Project-specific variants (e.g. higher capacity mobile units) available on request.",
  },
  {
    slug: "commercial-energy-hub",
    tier: "03 · Commercial Energy Hub",
    model: "H200",
    title: "Commercial Mobile Energy Hub",
    headline: "200 kWh mobile energy for weak grids, construction, and solar-storage-EV sites.",
    summary:
      "Higher-capacity energy hub for commercial and industrial deployment. Catalog baseline X200120: 200 kWh / 120 kW with AC site power; F200120 solar-storage charging option for grid-complementary sites.",
    hero: "/products/h200-hero.jpg",
    gallery: ["/products/h200-solar-hero.jpg", "/products/f200120-hero.jpg"],
    bestFor: [
      "Hotels, malls, and commercial parking without grid upgrade",
      "Construction & temporary high-power sites",
      "Fuel station / logistics yard energy upgrades",
      "Farms, resorts, and weak-grid locations",
    ],
    solves: [
      "Grid capacity blocks permanent high-power chargers",
      "Need both EV DC charging and site AC power",
      "Want a path from temporary deployment to solar-storage-EV",
    ],
    features: [
      "Large storage buffer for peak shaving and off-grid windows",
      "Dual-role DC EV charging + AC industrial/site output (X-class)",
      "Trailer / pallet deployment options for field mobility",
      "Optional solar PV input path via F-class stationary hub",
    ],
    specs: [
      { label: "Battery capacity", value: "200 kWh (catalog baseline)" },
      { label: "Output power", value: "120 kW DC" },
      { label: "Output voltage", value: "DC 200–1000 V" },
      { label: "Output current", value: "0–250 A" },
      { label: "HMI", value: '10" touch screen' },
      { label: "Cable length", value: "7 m (typical)" },
      { label: "Charger standards", value: "GB/T · CCS1 · CCS2 · CHAdeMO" },
      { label: "AC output / recharge", value: "AC single / three-phase (project configured)" },
      { label: "Size (approx., X-class)", value: "2660 × 1250 × 1300 mm" },
      { label: "Weight (approx., X-class)", value: "~2500 kg" },
      { label: "Working temperature", value: "−10 °C to 60 °C" },
      { label: "Protection", value: "IP54" },
      { label: "Solar option (F-class)", value: "Optional PV input · stationary hub form" },
    ],
    connectors: ["GB/T", "CCS1", "CCS2", "CHAdeMO"],
    relatedSolutions: [
      "ev-charging-without-grid-upgrade",
      "ev-dealership-charging",
    ],
    note: "Primary hero shows mobile X-class hub. F-class solar-storage charging pedestal is an optional commercial path for fixed or semi-fixed sites. Confirm final BOM in quotation.",
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}
