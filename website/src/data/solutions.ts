export type Solution = {
  slug: string;
  eyebrow: string;
  title: string;
  headline: string;
  summary: string;
  audience: string[];
  pains: string[];
  outcomes: string[];
  approach: string[];
  productsHint: string;
  keywords: string[];
};

export const solutions: Solution[] = [
  {
    slug: "ev-dealership-charging",
    eyebrow: "Priority 01 · Automotive retail",
    title: "EV Dealership Charging",
    headline: "Build mobile charging service capability for modern dealerships.",
    summary:
      "Help dealers keep demo, delivery, and aftersales vehicles ready without waiting for grid expansion or fixed bay construction.",
    audience: [
      "Automotive dealers & 4S stores",
      "Dealer groups and OEM retail networks",
      "Aftersales & membership service teams",
    ],
    pains: [
      "Demo and delivery vehicles need reliable top-ups on demand",
      "Fixed charging bays are limited or fully occupied",
      "Site grid capacity blocks fast expansion",
      "New fixed infrastructure takes too long to permit and install",
      "EV customer experience and service revenue are under pressure",
    ],
    outcomes: [
      "Rapid energy for test-drive and showroom vehicles",
      "Delivery-ready charge assurance",
      "Aftersales emergency / courtesy charging",
      "Doorstep or on-lot mobile service options",
      "Differentiated customer experience",
      "Membership and paid add-on service models",
    ],
    approach: [
      "Map vehicle mix, dwell times, and peak retail moments",
      "Deploy portable or mobile battery-backed chargers on the lot",
      "Integrate into demo, PDI, delivery, and aftersales workflows",
      "Enable staff-operated or branded customer-facing service packages",
    ],
    productsHint: "G2V portable / flexible charging · mid-size mobile battery stations",
    keywords: [
      "EV charging solution for dealerships",
      "mobile EV charging for car dealers",
      "dealership EV charging without grid upgrade",
    ],
  },
  {
    slug: "ev-roadside-assistance",
    eyebrow: "Priority 02 · Roadside & insurance",
    title: "Roadside Assistance Charging",
    headline: "Bring fast charging directly to stranded EV drivers.",
    summary:
      "Turn roadside assistance into a high-value EV recovery service — charge on site, reduce unnecessary towing, and protect the driver experience.",
    audience: [
      "Roadside assistance fleets",
      "Towing operators expanding into EV recovery",
      "Insurers and automotive service platforms",
      "EV charging service operators",
    ],
    pains: [
      "Stranded EVs create long recovery times and frustrated drivers",
      "Towing is costly, slow, and not always necessary",
      "Fixed chargers are not where the vehicle actually stopped",
      "Operators need a service model that can bill per call, membership, or annual cover",
    ],
    outcomes: [
      "On-location energy delivery to stranded vehicles",
      "Fewer unnecessary tows",
      "Faster response outcomes for drivers",
      "Better NPS for insurers and service platforms",
      "New pay-per-use, membership, or annual service packages",
    ],
    approach: [
      "Outfit response vehicles with mobile battery charging units",
      "Define dispatch rules by SOC, vehicle class, and location",
      "Train crews for safe high-power mobile charging workflows",
      "Package offerings for B2B contracts with insurers and platforms",
    ],
    productsHint: "XF-class mid-size mobile charging stations · portable high-power units",
    keywords: [
      "mobile EV roadside assistance charger",
      "EV recovery charging",
      "charge stranded EV on site",
    ],
  },
  {
    slug: "ev-charging-without-grid-upgrade",
    eyebrow: "Priority 03 · Commercial property",
    title: "Charging Without Grid Upgrade",
    headline: "Deploy EV charging capacity where the grid cannot keep up.",
    summary:
      "For hotels, malls, parking operators, and properties that need EV charging now — without multi-year infrastructure projects.",
    audience: [
      "Hotels, malls, and commercial parking",
      "Property managers and REITs",
      "Resorts and mixed-use destinations",
      "Charging operators bridging temporary demand",
    ],
    pains: [
      "EV demand is rising but fixed infrastructure is slow and expensive",
      "Grid capacity upgrades block projects",
      "Temporary events, seasonal peaks, or construction phases need flexible capacity",
      "Revenue and guest experience opportunities are deferred for years",
    ],
    outcomes: [
      "Battery-backed or temporary EV charging stations",
      "Faster go-live versus permanent civil + grid works",
      "Capacity where it is needed, when it is needed",
      "Option to relocate or scale as demand shifts",
      "Pathway from temporary deployment to permanent strategy",
    ],
    approach: [
      "Audit peak demand, dwell patterns, and available power",
      "Size storage + charging power for realistic utilization",
      "Deploy mobile energy hubs or temporary stations",
      "Monitor utilization and plan grid-tied expansion only when ROI is clear",
    ],
    productsHint: "Mobile battery charging stations · X/F-class commercial energy hubs",
    keywords: [
      "EV charging without grid upgrade",
      "battery-powered EV charging station",
      "temporary EV charging for commercial parking",
    ],
  },
];

export function getSolution(slug: string) {
  return solutions.find((s) => s.slug === slug);
}
