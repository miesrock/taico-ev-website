export const primaryNavigation = [
  { key: "products", label: "Products" },
  { key: "solutions", label: "Solutions" },
  { key: "resources", label: "Resources" },
] as const;

export const resourceLinks = [
  {
    label: "Buyer Guides",
    description: "Qualify the operating scenario, energy, power, connectors, and deployment format.",
    href: "/resources/articles/#buyer-guides",
  },
  {
    label: "Technical Knowledge",
    description: "Understand kW vs kWh, operating workflows, and catalog-backed selection inputs.",
    href: "/resources/articles/#technical-knowledge",
  },
  {
    label: "Product Comparison",
    description: "Compare catalog capacity and output power across the TKMC range.",
    href: "/resources/product-comparison/",
  },
  {
    label: "Documentation",
    description: "Request the latest product documentation from the TAICO EV team.",
    href: "/resources/#technical-documentation",
  },
] as const;
