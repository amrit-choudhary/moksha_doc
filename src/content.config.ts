import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const docs = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
    // Where this page was adapted from, so later source changes are easy to diff.
    source: z.string(),
    sourceCommit: z.string(),
  }),
});

export const collections = { docs };
