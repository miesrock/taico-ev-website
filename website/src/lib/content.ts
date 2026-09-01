import { applications, getApplication, getApplicationBySolutionSlug, getApplicationHref, type Application } from "../data/applications.ts";
import {
  getFamilyHref,
  getProductFamily,
  getPublishedFamilies,
  productFamilies,
  type FamilyComparisonField,
  type FamilyRanges,
  type ProductFamily,
} from "../data/families.ts";
import {
  getPublishedProducts,
  type Product,
  type ProductCategory,
  type SpecRow,
} from "../data/products.ts";
import { getSolution, solutions, type Solution } from "../data/solutions.ts";

export type KnowledgeRelations = {
  relatedFamilies?: readonly string[];
  relatedApplications?: readonly string[];
  relatedProducts?: readonly string[];
};

const comparisonLabels: Record<FamilyComparisonField, string> = {
  capacityKwh: "Battery capacity",
  outputPowerKw: "Output power",
  outputVoltage: "Output voltage",
  chargingGun: "Charging gun",
  dimensions: "Size",
  weight: "Weight",
  protectionLevel: "Protection level",
  hmi: "HMI",
  chargeMode: "Charge mode",
};

function unique<T>(values: readonly T[]) {
  return [...new Set(values)];
}

function formatNumericRange(values: readonly number[], unit: string) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return min === max ? `${min} ${unit}` : `${min}–${max} ${unit}`;
}

/** Rule 1 — Family → Products */
export function getFamilyProducts(familySlug: ProductCategory) {
  return getPublishedProducts().filter((product) => product.category === familySlug);
}

/** Rule 2 — Product → Family */
export function getFamilyForProduct(product: Product) {
  const family = getProductFamily(product.category);
  if (!family) throw new Error(`Unknown product family "${product.category}" on product "${product.slug}"`);
  return family;
}

/** Rule 3 — Product → sibling Products in the same family */
export function getSiblingProducts(product: Product) {
  return getFamilyProducts(product.category).filter((item) => item.slug !== product.slug);
}

/** Rule 4 — Application → recommended Products */
export function getApplicationProducts(applicationSlug: string) {
  return getPublishedProducts().filter((product) => product.applicationSlugs.includes(applicationSlug as Product["applicationSlugs"][number]));
}

/** Rule 5 — Product → Applications */
export function getApplicationsForProduct(product: Product): Application[] {
  return product.applicationSlugs.map((slug) => {
    const application = getApplication(slug);
    if (!application) throw new Error(`Unknown application "${slug}" on product "${product.slug}"`);
    return application;
  });
}

export function getSolutionsForProduct(product: Product): Solution[] {
  return unique(getApplicationsForProduct(product).map((application) => application.solutionSlug)).map((slug) => {
    const solution = getSolution(slug);
    if (!solution) throw new Error(`Unknown solution "${slug}" on product "${product.slug}"`);
    return solution;
  });
}

export { getApplicationBySolutionSlug, getApplicationHref, getFamilyHref };

export function getFamilyRanges(family: ProductFamily, products = getFamilyProducts(family.slug)): FamilyRanges {
  if (!products.length) return family.ranges ?? {};

  const derived: FamilyRanges = {
    capacityKwh: formatNumericRange(products.map((product) => product.capacityKwh), "kWh"),
    outputPowerKw: formatNumericRange(products.map((product) => product.outputPowerKw), "kW"),
    voltage: unique(products.map((product) => product.outputVoltage)).join(" / "),
    connector: unique(products.map((product) => product.chargingGun)).join(" / "),
  };

  return {
    capacityKwh: family.ranges?.capacityKwh ?? derived.capacityKwh,
    outputPowerKw: family.ranges?.outputPowerKw ?? derived.outputPowerKw,
    voltage: family.ranges?.voltage ?? derived.voltage,
    connector: family.ranges?.connector ?? derived.connector,
  };
}

export function getComparisonValue(product: Product, field: FamilyComparisonField) {
  switch (field) {
    case "capacityKwh":
      return `${product.capacityKwh} kWh`;
    case "outputPowerKw":
      return `${product.outputPowerKw} kW`;
    default:
      return product[field];
  }
}

export function getFamilyComparison(family: ProductFamily, products = getFamilyProducts(family.slug)) {
  return {
    fields: family.comparisonFields.map((field) => ({ field, label: comparisonLabels[field] })),
    rows: products.map((product) => ({
      product,
      values: Object.fromEntries(family.comparisonFields.map((field) => [field, getComparisonValue(product, field)])) as Record<FamilyComparisonField, string>,
    })),
  };
}

export function getFamilySelector(family: ProductFamily) {
  const publishedBySlug = new Map(getPublishedProducts().map((product) => [product.slug, product]));
  return family.useCases.flatMap((useCase) => {
    if (!useCase.recommendedProductSlug) return [];
    const product = publishedBySlug.get(useCase.recommendedProductSlug);
    if (!product) {
      throw new Error(`Unknown or unpublished recommended product "${useCase.recommendedProductSlug}" on family "${family.slug}"`);
    }
    const application = useCase.applicationSlug ? getApplication(useCase.applicationSlug) : undefined;
    if (useCase.applicationSlug && !application) {
      throw new Error(`Unknown application "${useCase.applicationSlug}" on family "${family.slug}"`);
    }
    return [{ useCase, product, application }];
  });
}

export function getProductCompatibility(product: Product): SpecRow[] {
  return [
    { label: "Charging gun", value: product.chargingGun },
    { label: "Output voltage", value: product.outputVoltage },
    { label: "Output current", value: product.outputCurrent },
    { label: "Charge mode", value: product.chargeMode },
    { label: "Charger cable length", value: `${product.cableLengthM} m` },
  ];
}

export function knowledgeRelatesToFamily(data: KnowledgeRelations, familySlug: string) {
  if ((data.relatedFamilies ?? []).includes(familySlug)) return true;
  const relatedProducts = new Set(data.relatedProducts ?? []);
  return getPublishedProducts().some((product) => relatedProducts.has(product.slug) && product.category === familySlug);
}

export function knowledgeRelatesToApplication(data: KnowledgeRelations, applicationSlug: string) {
  if ((data.relatedApplications ?? []).includes(applicationSlug)) return true;
  const relatedProducts = new Set(data.relatedProducts ?? []);
  return getPublishedProducts().some(
    (product) => relatedProducts.has(product.slug) && (product.applicationSlugs as readonly string[]).includes(applicationSlug),
  );
}

export function knowledgeRelatesToProduct(data: KnowledgeRelations, productSlug: string) {
  return (data.relatedProducts ?? []).includes(productSlug);
}

export function knowledgeRelatesToSolution(data: KnowledgeRelations, solutionSlug: string) {
  const application = getApplicationBySolutionSlug(solutionSlug);
  return application ? knowledgeRelatesToApplication(data, application.slug) : false;
}

export function getKnowledgeCommercialEntities(data: KnowledgeRelations) {
  const products = [...new Set(data.relatedProducts ?? [])].map((slug) => {
    const product = getPublishedProducts().find((item) => item.slug === slug);
    if (!product) throw new Error(`Unknown knowledge product "${slug}"`);
    return product;
  });
  const familySlugs = unique([...(data.relatedFamilies ?? []), ...products.map((product) => product.category)]);
  const families = familySlugs.map((slug) => {
    const family = getProductFamily(slug);
    if (!family) throw new Error(`Unknown knowledge family "${slug}"`);
    return family;
  });
  const applicationSlugs = unique([
    ...(data.relatedApplications ?? []),
    ...products.flatMap((product) => product.applicationSlugs),
  ]);
  const relatedApplications = applicationSlugs.map((slug) => {
    const application = getApplication(slug);
    if (!application) throw new Error(`Unknown knowledge application "${slug}"`);
    return application;
  });
  return { products, families, applications: relatedApplications };
}

export function knowledgeHasCommercialRelation(data: KnowledgeRelations) {
  return Boolean((data.relatedFamilies ?? []).length || (data.relatedApplications ?? []).length || (data.relatedProducts ?? []).length);
}

export function getFamilyStructuredData(family: ProductFamily, site: URL | string, products = getFamilyProducts(family.slug)) {
  const siteUrl = new URL("/", site).href;
  const familyUrl = new URL(getFamilyHref(family.slug), siteUrl).href;
  const structuredData: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Products", item: new URL("/products/", siteUrl).href },
        { "@type": "ListItem", position: 3, name: family.title, item: familyUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: family.seo.title,
      description: family.seo.description,
      url: familyUrl,
      about: family.seo.primaryTopic,
      hasPart: products.map((product) => ({
        "@type": "WebPage",
        name: product.model,
        url: new URL(`/products/${product.slug}/`, siteUrl).href,
      })),
    },
  ];

  if (family.faq?.length) {
    structuredData.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: family.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
  }

  return structuredData;
}

export function getContentRelationIssues() {
  const issues: string[] = [];
  const familySlugs = new Set(productFamilies.map((family) => family.slug));
  const publishedFamilySlugs = new Set(getPublishedFamilies().map((family) => family.slug));
  const productSlugs = new Set(getPublishedProducts().map((product) => product.slug));
  const applicationSlugs = new Set(applications.map((application) => application.slug));
  const solutionSlugs = new Set(solutions.map((solution) => solution.slug));

  if (familySlugs.size !== productFamilies.length) issues.push("Duplicate product family slug");
  if (new Set(applications.map((application) => application.slug)).size !== applications.length) issues.push("Duplicate application slug");
  if (solutionSlugs.size !== solutions.length) issues.push("Duplicate solution slug");

  for (const family of getPublishedFamilies()) {
    if (!family.seo.title.trim()) issues.push(`Missing SEO title on family ${family.slug}`);
    if (!family.seo.description.trim()) issues.push(`Missing SEO description on family ${family.slug}`);
    if (!getFamilyProducts(family.slug).length) issues.push(`Published family ${family.slug} has no published products`);
    for (const useCase of family.useCases) {
      if (useCase.applicationSlug && !applicationSlugs.has(useCase.applicationSlug)) {
        issues.push(`Unknown application ${useCase.applicationSlug} on family ${family.slug}`);
      }
      if (useCase.recommendedProductSlug && !productSlugs.has(useCase.recommendedProductSlug)) {
        issues.push(`Unknown product ${useCase.recommendedProductSlug} on family ${family.slug}`);
      }
    }
  }

  for (const product of getPublishedProducts()) {
    if (!publishedFamilySlugs.has(product.category)) issues.push(`Unknown family ${product.category} on product ${product.slug}`);
    for (const slug of product.applicationSlugs) {
      if (!applicationSlugs.has(slug)) issues.push(`Unknown application ${slug} on product ${product.slug}`);
    }
    for (const application of getApplicationsForProduct(product)) {
      if (!solutionSlugs.has(application.solutionSlug)) {
        issues.push(`Unknown solution ${application.solutionSlug} on application ${application.slug}`);
      }
    }
  }

  if (applications.length !== solutions.length) issues.push("Application and Solution presentation counts differ");

  for (const application of applications) {
    const presentation = getSolution(application.solutionSlug);
    if (!presentation) {
      issues.push(`Unknown solution ${application.solutionSlug} on application ${application.slug}`);
      continue;
    }
    if (presentation.applicationSlug !== application.slug) {
      issues.push(`Solution ${presentation.slug} does not reference application ${application.slug}`);
    }
  }

  for (const solution of solutions) {
    const application = getApplication(solution.applicationSlug);
    if (!application) issues.push(`Unknown application ${solution.applicationSlug} on solution ${solution.slug}`);
    else if (application.solutionSlug !== solution.slug) {
      issues.push(`Application ${application.slug} does not map to solution ${solution.slug}`);
    }
  }

  return issues;
}
