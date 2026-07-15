export type CaseStudy = {
  slug: string;
  title: string;
  eyebrow: string;
  region: string;
  customerType: string;
  summary: string;
  problem: string[];
  solution: string[];
  equipment: string;
  productSlug: string;
  solutionSlugs: string[];
  deployment: string;
  results: string[];
  hero: string;
  /** Visuals are photorealistic scene renders for the website; not customer-owned photos. */
  visualNote: string;
  /** Content source honesty for sales review */
  sourceNote: string;
};

/**
 * Field-application case pages for v1.
 * Outcomes are operational (qualitative). No invented conversion rates or ROI %.
 * Regions/customer types reflect OEM field application patterns + TAICO target markets.
 */
export const cases: CaseStudy[] = [
  {
    slug: "dealership-mobile-charging",
    title: "Dealership Lot Charging Without Waiting for Fixed Bays",
    eyebrow: "Case 01 · Automotive retail",
    region: "Australia / Asia-Pacific dealer networks",
    customerType: "Automotive dealers & multi-brand 4S groups",
    summary:
      "Portable charging capacity moves with demo, delivery, and aftersales vehicles so the store can improve EV readiness without a multi-month grid project.",
    problem: [
      "Demo and delivery EVs need reliable top-ups during peak retail hours",
      "Fixed chargers are limited or blocked by site power capacity",
      "Civil works and permits delay permanent bay expansion",
    ],
    solution: [
      "Deploy a portable G2V-class unit on the service / delivery apron",
      "Integrate into demo, PDI, and delivery checklists",
      "Keep permanent infrastructure as a later phase if volume justifies it",
    ],
    equipment: "TAICO EV G2V portable flexible charging unit",
    productSlug: "g2v",
    solutionSlugs: ["ev-dealership-charging"],
    deployment: "On-lot rollable deployment; operator-trained staff; no trenching required for first service layer.",
    results: [
      "Demo and delivery vehicles can be topped up where they park",
      "Faster path to EV customer experience improvements",
      "Lower first-step CAPEX versus full fixed-bay expansion",
      "Clear upgrade path to battery-backed mobile stations if service volume grows",
    ],
    hero: "/cases/dealership-lot.jpg",
    visualNote: "Photorealistic scene visualization with TAICO EV product form factor.",
    sourceNote:
      "Scenario based on OEM dealership application patterns and TAICO priority market (dealer networks). Customer name and quantified KPIs published only after verification.",
  },
  {
    slug: "roadside-ev-rescue",
    title: "Roadside EV Rescue: Charge the Vehicle Where It Stopped",
    eyebrow: "Case 02 · Roadside & insurance",
    region: "Urban corridors & highway service networks",
    customerType: "Roadside assistance fleets, towing operators, insurance partners",
    summary:
      "A battery-backed mobile charger turns low-SOC events into on-site energy recovery — reducing unnecessary tows and protecting driver experience.",
    problem: [
      "Stranded EVs create long recovery times and frustrated drivers",
      "Towing is expensive and not always necessary when only energy is missing",
      "Fixed chargers are rarely located where the vehicle actually stopped",
    ],
    solution: [
      "Outfit response vehicles or pallets with an M75-class mobile battery station",
      "Dispatch by SOC, vehicle class, and location",
      "Offer pay-per-use, membership, or B2B contracts with insurers and platforms",
    ],
    equipment: "TAICO EV M75 mobile battery charging station (75 kWh / 60 kW class)",
    productSlug: "mobile-battery-station",
    solutionSlugs: ["ev-roadside-assistance"],
    deployment: "Highway shoulder or urban curb-side operation; IP54 outdoor cabinet; multi-standard gun options.",
    results: [
      "On-location energy delivery for many low-SOC events",
      "Potential reduction in pure energy-related tows",
      "New service SKU for assistance operators and insurers",
      "Brand-safe recovery experience versus long tow + wait cycles",
    ],
    hero: "/cases/roadside-rescue.jpg",
    visualNote: "Photorealistic roadside rescue visualization with TAICO EV M75-class unit.",
    sourceNote:
      "Scenario based on OEM roadside / mobile rescue applications. Specific operator names and performance metrics withheld pending customer approval.",
  },
  {
    slug: "hotel-charging-without-grid-upgrade",
    title: "Hotel & Premium Parking Charging Without Grid Upgrade",
    eyebrow: "Case 03 · Commercial property",
    region: "Middle East premium hospitality & mixed-use sites",
    customerType: "Hotels, resorts, commercial parking, property managers",
    summary:
      "Battery-backed mobile charging covers guest and member demand at high-end sites where permanent high-power infrastructure is slow or constrained by grid capacity.",
    problem: [
      "Guest EV demand is rising faster than fixed infrastructure can be approved",
      "Grid upgrades and civil works block near-term service launches",
      "Properties need flexible capacity for peaks, events, and seasonal occupancy",
    ],
    solution: [
      "Stage an M75-class mobile battery station at porte-cochere or VIP bays",
      "Offer concierge / membership charging as a guest amenity",
      "Monitor utilization before committing to permanent grid-tied expansion",
    ],
    equipment: "TAICO EV M75 mobile battery charging station",
    productSlug: "mobile-battery-station",
    solutionSlugs: ["ev-charging-without-grid-upgrade", "ev-roadside-assistance"],
    deployment: "Temporary or semi-permanent pad placement; night operations friendly; relocatable across properties in a portfolio.",
    results: [
      "Faster go-live versus multi-year fixed infrastructure",
      "Charging service positioned as hospitality differentiation",
      "Capacity that can move with occupancy and events",
      "Data trail for later permanent design decisions",
    ],
    hero: "/cases/hotel-parking.jpg",
    visualNote: "Photorealistic premium hospitality night scene with TAICO EV mobile unit.",
    sourceNote:
      "Scenario aligned with OEM premium destination / doorstep charging applications (incl. Middle East market patterns). Quantified conversion claims not shown until verified.",
  },
  {
    slug: "construction-mobile-energy-hub",
    title: "Construction Site Mobile Energy Hub for High-Power Equipment",
    eyebrow: "Case 04 · Industrial & construction",
    region: "Europe & multi-country infrastructure projects",
    customerType: "General contractors, equipment OEMs, green construction programs",
    summary:
      "A 200 kWh-class mobile energy hub supplies DC charging and site power so electric construction equipment can be replenished without long trips to fixed stations.",
    problem: [
      "Electric excavators and loaders lose productive time traveling to fixed charge points",
      "Diesel generators conflict with noise, emissions, and ESG requirements",
      "Temporary sites cannot justify permanent grid infrastructure",
    ],
    solution: [
      "Deploy an H200-class commercial mobile energy hub near the work face",
      "Charge equipment during loading/idle windows (time-folding operations)",
      "Use AC outputs for tools and temporary site loads where configured",
    ],
    equipment: "TAICO EV H200 commercial mobile energy hub (200 kWh / 120 kW class)",
    productSlug: "commercial-energy-hub",
    solutionSlugs: ["ev-charging-without-grid-upgrade"],
    deployment: "Pallet or trailer placement on construction yards; outdoor IP54-class cabinet; multi-standard DC guns.",
    results: [
      "On-site energy next to the equipment, not across town",
      "Support for low-noise / lower-emission site power strategies",
      "Flexible redeployment as the project phase moves",
      "Foundation for larger industrial and off-grid energy programs",
    ],
    hero: "/cases/construction-site.jpg",
    visualNote: "Photorealistic construction-yard visualization with TAICO EV H200-class hub.",
    sourceNote:
      "Scenario based on OEM multi-country construction / engineering applications. Project-specific efficiency percentages published only with verified measurement.",
  },
];

export function getCase(slug: string) {
  return cases.find((c) => c.slug === slug);
}
