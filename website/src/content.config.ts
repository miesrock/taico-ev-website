import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const articles = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    eyebrow: z.string(),
    publishedAt: z.coerce.date(),
    order: z.number(),
    relatedProductSlugs: z.array(z.string()).default([]),
    relatedSolutionSlug: z.string().optional(),
  }),
});

export const collections = { articles };
