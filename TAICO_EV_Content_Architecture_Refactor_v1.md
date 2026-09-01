# TAICO EV Content Architecture Refactor v1

## 1. Purpose

This document defines the first structural refactor of the TAICO EV website.

The goal is to evolve the current Astro site from a collection of product, solution, application, and resource pages into a small, explicit content system inspired by the strongest reusable patterns observed in BESEN:

- Information Architecture based on buyer intent
- Structured Content Model
- Deterministic internal linking rules
- Reusable Page Factory templates
- SEO Watch as the feedback layer

This is **not** a visual redesign project.

This is **not** a CMS migration project.

This is **not** a large-scale SEO page generation project.

The core objective is:

> Upgrade `ProductFamily` from a thin category label into a first-class content entity, simplify overlapping page types, and make page relationships explicit and reusable.

---

# 2. Current State

The repository already has a strong technical base.

Current relevant structure:

```text
website/
├── src/
│   ├── data/
│   │   ├── products.ts
│   │   ├── applications.ts
│   │   ├── solutions.ts
│   │   └── navigation.ts
│   │
│   ├── content/
│   │   └── articles/
│   │
│   └── pages/
│       ├── products/
│       │   ├── index.astro
│       │   ├── [slug].astro
│       │   └── category/
│       │       └── [slug].astro
│       │
│       ├── solutions/
│       │   └── [slug].astro
│       │
│       ├── applications/
│       │   ├── index.astro
│       │   └── [slug].astro
│       │
│       └── resources/
```

The existing Product entity is already structured and drives product pages.

Existing product relationships include:

```text
Product
├── category
├── solutionSlugs
├── applicationSlugs
├── catalogApplications
├── capabilities
├── specs
└── SEO / structured data helpers
```

The current product page factory already supports:

```text
Product data
→ Product template
→ SEO metadata
→ JSON-LD
→ Related solutions
→ Related products
→ CTA
```

This existing architecture should be preserved.

---

# 3. Main Problems

## 3.1 ProductFamily is too weak

Current category data is effectively:

```ts
{
  slug,
  title,
  description
}
```

This makes category pages little more than product listing pages.

Current category page behavior:

```text
Title
Description
Product cards
CTA
```

The target behavior is:

```text
Category Hub
+
Buying Guide
+
Product Selector
+
SEO Landing Page
```

---

## 3.2 Applications and Solutions overlap

The current public site has both:

```text
/applications/
/solutions/
```

while products contain both:

```ts
solutionSlugs
applicationSlugs
```

These concepts are too similar for a small B2B website.

Target model:

```text
Application = content entity
Solution Page = public presentation of that entity
```

The public navigation should use **Solutions**.

---

## 3.3 Knowledge content is not sufficiently connected

Articles exist, but the site currently behaves too much like:

```text
Article
→ standalone article
```

Target:

```text
Knowledge
→ ProductFamily
→ Application
→ Product
```

No important article should be structurally isolated.

---

## 3.4 Internal linking exists but is partially implicit

Current product pages already link to:

- parent category
- related products
- related solutions

The next step is to make linking rules explicit and testable.

---

# 4. Target Information Architecture

Public top-level architecture:

```text
Home
├── Products
│   ├── Mobile Charging Systems
│   ├── Charging Robot
│   ├── Mobile Power Systems
│   └── Stationary Charging Systems
│       └── Product Detail
│
├── Solutions
│   ├── Roadside EV Rescue
│   ├── On-Demand Charging
│   ├── Temporary Engineering Power
│   ├── PV Storage Charger
│   └── PV-ESS Charging
│
├── Resources
│   ├── Buyer Guides
│   ├── Technical Knowledge
│   ├── Product Comparison
│   └── Documentation
│
├── Company
│
└── Contact
```

The separate public **Applications** section should be removed from primary navigation.

Existing useful application content may remain temporarily for compatibility, but should redirect or converge toward `/solutions/`.

---

# 5. Target Content Model

Version 1 contains only six first-class entities.

```text
1. Product
2. ProductFamily
3. Application
4. Knowledge
5. Evidence
6. FAQ
```

Do not introduce more first-class entities unless required by a real page or workflow.

---

# 6. Entity Relationships

Canonical relationship graph:

```text
Product
├── belongs_to → ProductFamily
├── used_for → Application
├── supported_by → Evidence
├── explained_by → Knowledge
└── answers → FAQ
```

Reverse relations should be derivable:

```text
ProductFamily
├── has_products
├── related_applications
├── related_knowledge
└── related_faq

Application
├── recommended_products
├── related_families
├── related_knowledge
└── related_faq

Knowledge
├── related_products
├── related_families
└── related_applications
```

Avoid duplicate source-of-truth relations where possible.

---

# 7. ProductFamily Data Model

Create a first-class ProductFamily model.

Recommended TypeScript shape:

```ts
export type ProductFamily = {
  slug: ProductCategory;
  title: string;
  shortTitle?: string;
  description: string;

  seo: {
    title: string;
    description: string;
    primaryTopic: string;
  };

  overview: {
    headline: string;
    body: string;
  };

  ranges: {
    capacityKwh?: string;
    outputPowerKw?: string;
    voltage?: string;
    connector?: string;
  };

  useCases: {
    title: string;
    description: string;
    applicationSlug?: string;
  }[];

  selectionGuide: {
    title: string;
    description: string;
  }[];

  comparisonFields: string[];

  faqIds?: string[];

  relatedKnowledgeSlugs?: string[];

  published: boolean;
};
```

The exact field names may change if existing repository conventions suggest a cleaner implementation.

The semantic responsibilities must remain.

---

# 8. ProductFamily Page Factory

Refactor:

```text
src/pages/products/category/[slug].astro
```

into a richer Family Page Factory.

Required section order:

```text
1. Breadcrumb
2. Hero
3. Quick Range / Key Specs
4. Product Family Overview
5. Use Cases
6. How to Choose
7. Product Comparison
8. Product Selector / Scenario Recommendations
9. Product Cards
10. Related Knowledge
11. FAQ
12. CTA
```

Sections with no data may be omitted.

The template must not contain product-family-specific hardcoded copy.

---

# 9. Required Family Page Behavior

Each published Family Page must answer four questions.

## Category Hub

> What products are in this family?

Must show all published products belonging to the family.

---

## Buying Guide

> How should a buyer choose between these products?

Must explain selection criteria using structured family data.

Examples:

```text
Daily energy demand
Required charging power
Connector standard
Mobility requirement
Deployment type
```

---

## Product Selector

> Which product should I start with?

Version 1 does not require an interactive filter.

A deterministic recommendation block is sufficient.

Example:

```text
Roadside rescue
→ TKMC-800

Higher energy demand
→ TKMC-1500
```

---

## SEO Landing Page

> What is this product family and what search intent does it satisfy?

Must include:

- clear H1
- family overview
- semantic specification range
- use cases
- comparison content
- related knowledge
- internal links to products

---

# 10. Product Page Changes

Do not rewrite the Product Page Factory.

Preserve the existing structure.

Add the following only where data exists:

```text
Why This Product
Who It Is For
How to Choose
Compatibility / Configuration
FAQ
Evidence / Documentation
Related Knowledge
```

These sections should be data-driven.

Do not hardcode model-specific content directly inside:

```text
src/pages/products/[slug].astro
```

---

# 11. Application / Solution Consolidation

Public terminology:

```text
Solution
```

Internal entity:

```text
Application
```

Target:

```text
Application entity
→ Solution page
```

Migration approach:

1. Keep existing `solutions.ts` temporarily if needed.
2. Identify one canonical source of truth.
3. Move reusable application facts into that source.
4. Update Products to reference only one canonical application relation.
5. Preserve old URLs with redirects if public URLs already exist.

Do not break existing indexed URLs without redirects.

---

# 12. Knowledge Model

Existing article content should gain explicit relationships.

Recommended frontmatter:

```yaml
title:
description:
publishedAt:

relatedFamilies:
  - mobile-charging

relatedApplications:
  - roadside-ev-rescue

relatedProducts:
  - tkmc-800
  - tkmc-1500
```

At least one of these relationship arrays must be non-empty for published knowledge content.

---

# 13. Linking Rules

Implement these as deterministic rules.

## Rule 1 — Family → Products

Every Family Page links to every published Product belonging to that Family.

```text
ProductFamily
→ Product[]
```

---

## Rule 2 — Product → Family

Every Product Page links to its parent Family.

```text
Product
→ ProductFamily
```

---

## Rule 3 — Product → Sibling Products

Every Product Page may link to other published Products in the same Family.

```text
Product
→ Product where category == current.category
```

Exclude the current Product.

---

## Rule 4 — Application → Recommended Products

Every Solution/Application page links to relevant Products.

```text
Application
→ Product[]
```

---

## Rule 5 — Product → Applications

Every Product Page links to its related Application/Solution pages.

```text
Product
→ Application[]
```

---

## Rule 6 — Knowledge → Commercial Entity

Every published Knowledge article must link to at least one:

```text
Product
or
ProductFamily
or
Application
```

---

## Rule 7 — Family → Knowledge

Every Family Page should surface related Knowledge when relationships exist.

```text
ProductFamily
→ Knowledge[]
```

---

# 14. Linking Rule Constraints

Do not create:

```text
random related links
tag clouds
sitewide keyword-stuffed footer links
automatic links based only on text matching
```

Links must come from explicit entity relationships or deterministic family membership.

---

# 15. Resources Architecture

Public Resources should become:

```text
Resources
├── Buyer Guides
├── Technical Knowledge
├── Product Comparison
└── Documentation
```

Do not add a generic "Blog" concept unless necessary.

Knowledge content exists to support:

```text
Product
ProductFamily
Application
```

---

# 16. Navigation Changes

Primary navigation should expose:

```text
Products
Solutions
Resources
Company
Contact
```

Applications should not remain a parallel top-level concept.

Do not add:

```text
Partners
Industries
Compatibility
Markets
Academy
Downloads
```

as new top-level navigation items during this refactor.

---

# 17. SEO Requirements

Every Family Page must have:

```text
unique <title>
unique meta description
single H1
canonical
BreadcrumbList structured data
crawlable product links
descriptive internal anchors
```

Where appropriate, Product pages retain existing Product structured data.

Do not add structured data unsupported by visible page content.

---

# 18. Source of Truth Rules

Maintain a single source of truth for each fact.

Examples:

```text
Product capacity
→ Product entity

Family power range
→ derived from Products where possible

Product membership
→ Product.category

Recommended application/product relationship
→ canonical relationship field
```

Avoid maintaining the same fact manually in multiple files.

Prefer derived data over duplicate data.

---

# 19. Development Phases

## Phase P0-A — ProductFamily Model

Tasks:

- create first-class ProductFamily type
- migrate existing category metadata
- add SEO data
- add overview
- add range data
- add selection guide
- add use cases
- add comparison fields
- add publication state

### Acceptance Criteria

- all four current product categories are represented
- no current Product loses its category relation
- build succeeds
- existing Product URLs remain unchanged
- family data is not hardcoded inside Astro templates

---

## Phase P0-B — Family Page Factory

Tasks:

- refactor category page template
- render structured Family data
- add comparison section
- add selection guide
- add use-case recommendations
- add related knowledge
- add CTA

### Acceptance Criteria

Every published Family Page contains:

- H1
- family description
- specification/range summary
- at least one selection-guide section
- all published family products
- product comparison
- CTA

If related Knowledge exists, it is shown.

No family-specific copy is hardcoded in the page template.

---

## Phase P1-A — Application / Solution Consolidation

Tasks:

- choose canonical application entity source
- remove duplicate product relation model
- update page generation
- update navigation
- create redirects if routes change

### Acceptance Criteria

- Product has only one canonical application relation
- Solution pages still render correctly
- no existing published Solution URL returns 404
- old Application URLs either remain functional or redirect
- primary navigation contains no duplicate Applications/Solutions concept

---

## Phase P1-B — Knowledge Relations

Tasks:

- add article relationship metadata
- validate relations
- show related knowledge on Family pages
- show commercial links on article pages

### Acceptance Criteria

- every published article has at least one relation
- every published article links to at least one Product, Family, or Application
- Family pages show related Knowledge when configured
- invalid relationship slugs fail validation or tests

---

# 20. Automated Tests

Add or update tests for:

## ProductFamily integrity

```text
- slug uniqueness
- every Product.category resolves
- every published Family has at least one published Product
- SEO title exists
- SEO description exists
```

## Relationship integrity

```text
- every related Product slug resolves
- every related Family slug resolves
- every related Application slug resolves
- every Knowledge relation resolves
```

## Linking rules

At minimum verify:

```text
Product → Family
Family → Products
Product → Application
Application → Product
Knowledge → related entity
```

## Route integrity

Verify:

```text
/products/
/products/{product}/
/products/category/{family}/
/solutions/{solution}/
/resources/articles/{article}/
```

build successfully.

---

# 21. Manual QA Checklist

For each Family Page:

```text
[ ] H1 clearly describes product family
[ ] intro explains what the family is
[ ] key spec range is visible above or near the fold
[ ] products are visible and linked
[ ] comparison helps distinguish models
[ ] selection guide explains buying logic
[ ] use cases are linked where applicable
[ ] related knowledge is shown where available
[ ] CTA is visible
[ ] mobile layout works
[ ] no broken image
[ ] no empty section
```

For each Product Page:

```text
[ ] parent Family link works
[ ] related Product links work
[ ] related Solution links work
[ ] specs still match catalog source
[ ] Product JSON-LD remains valid
[ ] CTA keeps source attribution
```

---

# 22. Non-Goals

Do not implement during this refactor:

```text
multilingual architecture
CMS
headless CMS
database-backed product catalog
AI-generated hundreds of pages
automatic compatibility pages
market/country landing pages
partner pages
advanced interactive product configurator
search volume API integration
full SEO Watch automation
```

These are future phases.

---

# 23. Definition of Done

The refactor is complete only when the website structurally behaves like:

```text
ProductFamily
      ↕
   Product
   ↙   ↘
Application Knowledge
```

and no longer primarily like:

```text
products.ts
solutions.ts
applications.ts
articles/
↓
independent page groups
```

The site should demonstrate:

```text
Structured entities
+
Explicit relationships
+
Reusable templates
+
Deterministic linking
```

---

# 24. Final Acceptance Test

The implementation passes if a new Product can be added by editing structured data and the site automatically places it correctly into:

```text
Product Page
Parent Family Page
Family Product Comparison
Related Product links
Relevant Solution/Application links
```

without editing those destination pages manually.

A new Knowledge article passes if its relationship metadata automatically places it into the appropriate Family or Application context without manual edits to those destination pages.

---

# 25. Expected Result

After this refactor:

```text
TAICO Content Model
        ↓
Page Factory
        ↓
Family / Product / Solution / Knowledge
        ↓
Deterministic Internal Links
        ↓
Google / User
        ↓
SEO Watch
```

SEO Watch remains the feedback layer.

It will later determine whether the next action should be:

```text
CREATE
EXPAND
LINK
FIX
```

This refactor provides the structural foundation required for that loop.
