import assert from "node:assert/strict";
import test from "node:test";
import {
  getProductSpecs,
  getProductsForApplication,
  getProductsForSolution,
  getPublishedProducts,
  productCategories,
} from "../src/data/products.ts";
import { applications } from "../src/data/applications.ts";
import { solutions } from "../src/data/solutions.ts";

test("publishes the eight TKMC catalog products with unique source-backed slugs", () => {
  const products = getPublishedProducts();

  assert.equal(products.length, 8);
  assert.equal(new Set(products.map((product) => product.slug)).size, products.length);
  assert.deepEqual(
    products.map((product) => [product.model, product.catalogSource.page]),
    [
      ["TKMC-800", 4],
      ["TKMC-1500", 5],
      ["TKMC-1000", 6],
      ["TKMC-2000P", 7],
      ["TKMC-4000", 8],
      ["TKMC-10000", 9],
      ["TKMC-2000", 10],
      ["TKMC-2600", 11],
    ],
  );

  for (const product of products) {
    assert.match(product.model, /^TKMC-/);
    assert.equal(product.catalogSource.version, "1.3");
    assert.ok(product.capacityKwh > 0);
    assert.ok(product.outputPowerKw > 0);
    assert.match(product.hero, /^\/products\/tkmc-.+\.webp$/);
    assert.match(product.applicationImage, /^\/products\/tkmc-.+\.webp$/);
    const specLabels = getProductSpecs(product).map((spec) => spec.label);
    for (const requiredSpec of [
      "Battery capacity",
      "Output power",
      "Output voltage",
      "Output current",
      "Charger cable length",
      "Charging gun",
      "Size",
      "Weight",
      "Protection level",
    ]) {
      assert.ok(specLabels.includes(requiredSpec), `${product.model}: ${requiredSpec}`);
    }
  }

  const chargingRobot = products.find((product) => product.model === "TKMC-1000");
  assert.ok(chargingRobot);
  assert.deepEqual(
    chargingRobot.specs.slice(-11).map((spec) => spec.label),
    [
      "Wheelbase",
      "Minimum ground clearance",
      "Parking slope",
      "Maximum gradeability at full load",
      "Minimum turning radius",
      "Drive method",
      "Front/rear brake type",
      "Parking brake type",
      "Drive motor power",
      "Speed range",
      "Control communication method",
    ],
  );
});

test("every published category and exploration path resolves to catalog products", () => {
  const products = getPublishedProducts();

  for (const category of productCategories) {
    assert.ok(products.some((product) => product.category === category.slug), category.title);
  }

  assert.deepEqual(
    getProductsForSolution("emergency-ev-charging").map((product) => product.model),
    ["TKMC-800", "TKMC-1500"],
  );
  assert.deepEqual(
    getProductsForApplication("pv-ess-charging-station").map((product) => product.model),
    ["TKMC-10000", "TKMC-2000", "TKMC-2600"],
  );

  for (const solution of solutions) {
    assert.ok(getProductsForSolution(solution.slug).length > 0, solution.title);
  }

  for (const application of applications) {
    assert.ok(getProductsForApplication(application.slug).length > 0, application.title);
  }
});
