export const primaryNavigation = [
  { key: "solutions", label: "Solutions" },
  { key: "products", label: "Products" },
  { key: "applications", label: "Applications" },
  { key: "resources", label: "Resources" },
] as const;

export const resourceLinks = [
  {
    label: "Guides & Articles",
    description: "Practical guidance for mobile charging selection, energy and power, and roadside workflows.",
    href: "/resources/articles/",
  },
  {
    label: "Product Comparison",
    description: "Compare catalog capacity and output power across the TKMC range.",
    href: "/resources/product-comparison/",
  },
  {
    label: "Technical Documentation",
    description: "Request the latest product documentation from the TAICO EV team.",
    href: "/resources/#technical-documentation",
  },
] as const;
