import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const articleFigure = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
});

const articles = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/articles" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    eyebrow: z.string(),
    publishedAt: z.coerce.date(),
    order: z.number(),
    hero: articleFigure.optional(),
    figure: articleFigure.optional(),
    quickAnswer: z.string().optional(),
    cta: z.object({ title: z.string(), body: z.string() }).optional(),
    faq: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
    relatedProductSlugs: z.array(z.string()).default([]),
    relatedSolutionSlug: z.string().optional(),
  }),
});

export const collections = { articles };
