import assert from "node:assert/strict";
import test from "node:test";
import {
  getProductsForApplication,
  getFeaturedProductsForSolution,
  getProductsForSolution,
  getProductSeo,
  getProductStructuredData,
  getPublishedProducts,
  resolveSolutionFaq,
} from "../src/data/products.ts";
import { applications } from "../src/data/applications.ts";
import { getPublishedFamilies } from "../src/data/families.ts";
import { getFamilyForProduct, getSolutionsForProduct } from "../src/lib/content.ts";
import { getSolutionStructuredData, solutions } from "../src/data/solutions.ts";

const expectedCatalogProducts = {
  "TKMC-800": {
    catalogSource: { version: "1.3", page: 4 }, capacityKwh: 75, outputPowerKw: 60,
    outputVoltage: "DC 200–1000 V", outputCurrent: "0–150 A", hmi: '7" Touching Screen',
    chargeMode: "Single-player / OCPP 1.6J", workingTemperature: "−10 °C to 60 °C", cableLengthM: 7,
    chargingGun: "GB/T / CCS1 / CCS2 / CHAdeMO",
    specs: [{ label: "Recharge mode 1", value: "EV DC Charger" }, { label: "Recharge mode 2", value: "AC 3-phase / 20 kW" }],
    dimensions: "1580 × 925 × 1050 mm", weight: "≈900 kg", protectionLevel: "IP54",
    catalogApplications: ["Mobile Charger", "Roadside EV Rescue"], applicationSlugs: ["roadside-ev-rescue"],
  },
  "TKMC-1500": {
    catalogSource: { version: "1.3", page: 5 }, capacityKwh: 140, outputPowerKw: 120,
    outputVoltage: "DC 200–1000 V", outputCurrent: "0–250 A", hmi: '7" Touching Screen',
    chargeMode: "Single-player / OCPP 1.6J", workingTemperature: "−10 °C to 60 °C", cableLengthM: 7,
    chargingGun: "GB/T / CCS1 / CCS2 / CHAdeMO",
    specs: [{ label: "Recharge mode 1", value: "EV DC Charger" }, { label: "Recharge mode 2", value: "AC 3-phase / 40 kW" }],
    dimensions: "2300 × 1200 × 1000 mm", weight: "≈1682 kg", protectionLevel: "IP54",
    catalogApplications: ["Mobile Charger", "Roadside EV Rescue"], applicationSlugs: ["roadside-ev-rescue"],
  },
  "TKMC-1000": {
    catalogSource: { version: "1.3", page: 6 }, capacityKwh: 100, outputPowerKw: 90,
    outputVoltage: "DC 200–1000 V", outputCurrent: "0–150 A", hmi: '7" Touching Screen',
    chargeMode: "Single-player / OCPP 1.6J", workingTemperature: "−10 °C to 60 °C", cableLengthM: 5,
    chargingGun: "GB/T / CCS1 / CCS2 / CHAdeMO",
    specs: [
      { label: "Recharge mode 1", value: "EV DC Charger" }, { label: "Recharge mode 2", value: "AC 3-phase / 20 kW" },
      { label: "Wheelbase", value: "1100 mm" }, { label: "Minimum ground clearance", value: "100 mm" },
      { label: "Parking slope", value: "25%" }, { label: "Maximum gradeability at full load", value: "20%" },
      { label: "Minimum turning radius", value: "2.5 m" }, { label: "Drive method", value: "Rear-wheel drive" },
      { label: "Front/rear brake type", value: "Drum brake" }, { label: "Parking brake type", value: "EPB electronic parking brake (rear wheels with speed sensors)" },
      { label: "Drive motor power", value: "3 kW" }, { label: "Full-load range", value: "Depends on the vehicle's total energy storage battery capacity" },
      { label: "Speed range", value: "1–15 km/h" }, { label: "Control communication method", value: "CAN 2.0B" },
    ],
    dimensions: "2035 × 920 × 1491 mm", weight: "≈1256 kg", protectionLevel: "IP54",
    catalogApplications: ["Mobile EV Charger"], applicationSlugs: ["on-demand-charging"],
  },
  "TKMC-2000P": {
    catalogSource: { version: "1.3", page: 7 }, capacityKwh: 200, outputPowerKw: 120,
    outputVoltage: "DC 200–1000 V", outputCurrent: "0–250 A", hmi: '10" Touching Screen',
    chargeMode: "Single-player / OCPP 1.6J", workingTemperature: "−10 °C to 60 °C", cableLengthM: 7,
    chargingGun: "GB/T ×2 (CCS1 / CCS2 / CHAdeMO)",
    specs: [{ label: "Recharge mode", value: "EV DC Charger + AC three phase" }, { label: "AC output", value: "AC single / three phase" }],
    dimensions: "2660 × 1250 × 1300 mm", weight: "≈2500 kg", protectionLevel: "IP54",
    catalogApplications: ["Mobile Charger", "AC Output"], applicationSlugs: ["ac-output-e-generator"],
  },
  "TKMC-4000": {
    catalogSource: { version: "1.3", page: 8 }, capacityKwh: 400, outputPowerKw: 360,
    outputVoltage: "DC 200–1000 V", outputCurrent: "0–250 A", hmi: '10" Touching Screen',
    chargeMode: "Single-player / OCPP 1.6J", workingTemperature: "−10 °C to 60 °C", cableLengthM: 7,
    chargingGun: "GB/T ×2 (CCS1 / CCS2 / CHAdeMO)",
    specs: [{ label: "Recharge mode 1", value: "EV DC Charger" }, { label: "Recharge mode 2", value: "AC 3-phase / 120 kW" }],
    dimensions: "3500 × 1750 × 1250 mm", weight: "≈4800 kg", protectionLevel: "IP54",
    catalogApplications: ["Mobile Charger", "AC Output", "Engineering Power Supply"],
    applicationSlugs: ["ac-output-e-generator", "engineering-power-supply"],
  },
  "TKMC-10000": {
    catalogSource: { version: "1.3", page: 9 }, capacityKwh: 1000, outputPowerKw: 480,
    outputVoltage: "DC 200–1000 V", outputCurrent: "0–250 A", hmi: '10" Touching Screen ×2',
    chargeMode: "Single-player / OCPP 1.6J", workingTemperature: "−10 °C to 60 °C", cableLengthM: 7,
    chargingGun: "GB/T ×4 (CCS1 / CCS2 / CHAdeMO)",
    specs: [{ label: "Recharge mode 1", value: "EV DC Charger" }, { label: "Recharge mode 2", value: "AC 3-phase / 240 kW" }],
    dimensions: "6058 × 2550 × 2441 mm", weight: "≈17000 kg", protectionLevel: "IP54",
    catalogApplications: ["Mobile Charger", "PV Storage Charger", "AC Output"],
    applicationSlugs: ["ac-output-e-generator", "pv-storage-charger"],
  },
  "TKMC-2000": {
    catalogSource: { version: "1.3", page: 10 }, capacityKwh: 200, outputPowerKw: 120,
    outputVoltage: "DC 200–1000 V", outputCurrent: "0–250 A", hmi: '10" Touching Screen',
    chargeMode: "Single-player / OCPP 1.6J", workingTemperature: "−10 °C to 60 °C", cableLengthM: 7,
    chargingGun: "GB/T ×2 (CCS1 / CCS2 / CHAdeMO)",
    specs: [{ label: "Recharge mode 1", value: "AC 3-phase / 30 kW" }, { label: "Recharge mode 2", value: "Solar PV-IN (optional)" }],
    dimensions: "1300 × 1100 × 2077 mm", weight: "≈2161 kg", protectionLevel: "IP54",
    catalogApplications: ["PV-Storage Charging Station", "Grid Complementary System"], applicationSlugs: ["pv-ess-charging-station"],
  },
  "TKMC-2600": {
    catalogSource: { version: "1.3", page: 11 }, capacityKwh: 261, outputPowerKw: 120,
    outputVoltage: "DC 200–1000 V", outputCurrent: "0–250 A", hmi: '10" Touching Screen',
    chargeMode: "OCPP 1.6J / touching", workingTemperature: "−10 °C to 60 °C", cableLengthM: 7,
    chargingGun: "GB/T ×2 (CCS1 / CCS2 / CHAdeMO)",
    specs: [{ label: "Recharge mode 1", value: "AC 3-phase / 40 kW" }, { label: "Recharge mode 2", value: "Solar PV-IN (optional)" }],
    dimensions: "1300 × 1100 × 2077 mm", weight: "≈2365 kg", protectionLevel: "IP54",
    catalogApplications: ["PV-Storage Charging Station", "Grid Complementary System"], applicationSlugs: ["pv-ess-charging-station"],
  },
};

test("matches the frozen TAICO MC v1.3 catalog facts", () => {
  const products = getPublishedProducts();

  assert.equal(products.length, Object.keys(expectedCatalogProducts).length);
  assert.equal(new Set(products.map((product) => product.model)).size, products.length);
  assert.equal(new Set(products.map((product) => product.slug)).size, products.length);
  assert.deepEqual(
    Object.fromEntries(products.map((product) => [product.model, {
      catalogSource: product.catalogSource,
      capacityKwh: product.capacityKwh,
      outputPowerKw: product.outputPowerKw,
      outputVoltage: product.outputVoltage,
      outputCurrent: product.outputCurrent,
      hmi: product.hmi,
      chargeMode: product.chargeMode,
      workingTemperature: product.workingTemperature,
      cableLengthM: product.cableLengthM,
      chargingGun: product.chargingGun,
      specs: product.specs,
      dimensions: product.dimensions,
      weight: product.weight,
      protectionLevel: product.protectionLevel,
      catalogApplications: product.catalogApplications,
      applicationSlugs: product.applicationSlugs,
    }])),
    expectedCatalogProducts,
  );

  for (const product of products) {
    assert.match(product.hero, /^\/products\/tkmc-.+\.webp$/);
    assert.match(product.applicationImage, /^\/products\/tkmc-.+\.webp$/);
    assert.deepEqual(getProductSeo(product), {
      title: `${product.model} | ${product.productType} | TAICO EV`,
      description: product.summary,
    });

    const structuredData = getProductStructuredData(product, "https://taicoev.com");
    assert.equal(structuredData.length, 1);
    assert.equal(structuredData.find((schema) => schema["@type"] === "Product"), undefined);
    const family = getFamilyForProduct(product);
    const [breadcrumbSchema] = structuredData;
    assert.equal(breadcrumbSchema["@type"], "BreadcrumbList");
    assert.deepEqual(breadcrumbSchema.itemListElement, [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://taicoev.com/" },
      { "@type": "ListItem", position: 2, name: "Products", item: "https://taicoev.com/products/" },
      { "@type": "ListItem", position: 3, name: family.title, item: `https://taicoev.com/products/category/${family.slug}/` },
      { "@type": "ListItem", position: 4, name: product.model, item: `https://taicoev.com/products/${product.slug}/` },
    ]);
  }
});

test("maps every catalog product to the exact public solution and application", () => {
  const products = getPublishedProducts();

  for (const family of getPublishedFamilies()) {
    assert.ok(products.some((product) => product.category === family.slug), family.title);
  }

  assert.deepEqual(
    Object.fromEntries(getPublishedProducts().map((product) => [product.model, getSolutionsForProduct(product).map((solution) => solution.slug)])),
    {
      "TKMC-800": ["mobile-ev-charger-roadside-rescue"],
      "TKMC-1500": ["mobile-ev-charger-roadside-rescue"],
      "TKMC-1000": ["charge-on-demand"],
      "TKMC-2000P": ["ac-output-e-generator"],
      "TKMC-4000": ["ac-output-e-generator", "temporary-engineering-power"],
      "TKMC-10000": ["ac-output-e-generator", "pv-storage-charger"],
      "TKMC-2000": ["pv-ess-charging"],
      "TKMC-2600": ["pv-ess-charging"],
    },
  );
  assert.deepEqual(
    Object.fromEntries(solutions.map(({ slug }) => [slug, getProductsForSolution(slug).map((product) => product.model)])),
    {
      "mobile-ev-charger-roadside-rescue": ["TKMC-800", "TKMC-1500"],
      "charge-on-demand": ["TKMC-1000"],
      "ac-output-e-generator": ["TKMC-2000P", "TKMC-4000", "TKMC-10000"],
      "temporary-engineering-power": ["TKMC-4000"],
      "pv-storage-charger": ["TKMC-10000"],
      "pv-ess-charging": ["TKMC-2000", "TKMC-2600"],
    },
  );
  assert.deepEqual(
    Object.fromEntries(applications.map(({ slug }) => [slug, getProductsForApplication(slug).map((product) => product.model)])),
    {
      "roadside-ev-rescue": ["TKMC-800", "TKMC-1500"],
      "on-demand-charging": ["TKMC-1000"],
      "ac-output-e-generator": ["TKMC-2000P", "TKMC-4000", "TKMC-10000"],
      "engineering-power-supply": ["TKMC-4000"],
      "pv-storage-charger": ["TKMC-10000"],
      "pv-ess-charging-station": ["TKMC-2000", "TKMC-2600"],
    },
  );
});

test("keeps the roadside shortlist ordered and resolves FAQ facts from published products", () => {
  const solution = solutions.find((item) => item.slug === "mobile-ev-charger-roadside-rescue");
  assert.ok(solution);
  const featured = getFeaturedProductsForSolution(solution.slug, solution.featuredProductSlugs);

  assert.deepEqual(featured.map((product) => product.model), ["TKMC-800", "TKMC-1500", "TKMC-2000P"]);
  assert.throws(
    () => getFeaturedProductsForSolution(solution.slug, ["missing-product"]),
    /Unknown or unpublished featured product/,
  );

  const faq = resolveSolutionFaq(solution.faq, featured);
  assert.match(faq[0]?.answer || "", /60 kW/);
  assert.match(faq[0]?.answer || "", /75 kWh/);
  assert.match(faq[1]?.answer || "", /GB\/T \/ CCS1 \/ CCS2 \/ CHAdeMO/);
  assert.match(faq[1]?.answer || "", /TKMC-1500 lists GB\/T \/ CCS1 \/ CCS2 \/ CHAdeMO/);
  assert.doesNotMatch(faq.map((item) => item.answer).join(" "), /\{\{/);

  const structuredData = getSolutionStructuredData(solution, "https://taicoev.com", faq);
  const faqSchema = structuredData.find((schema) => schema["@type"] === "FAQPage");
  assert.deepEqual(
    faqSchema?.mainEntity,
    faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  );
});
