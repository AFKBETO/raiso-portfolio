import { defineContentConfig, defineCollection, z } from '@nuxt/content';

const contentSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  language: z.string(),
  date: z.string().optional(),
});

const headerSchema = z.object({
  language: z.string(),
  home: z.string(),
  about: z.string(),
  activities: z.string(),
});

const footerSchema = z.object({
  language: z.string(),
  body: z.string(),
});

const seoSchema = z.object({
  language: z.string(),
  description: z.string(),
});

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/**.md',
      schema: contentSchema,
    }),
    header: defineCollection({
      type: 'data',
      source: 'header/**.yml',
      schema: headerSchema,
    }),
    footer: defineCollection({
      type: 'data',
      source: 'footer/**.yml',
      schema: footerSchema,
    }),
    seo: defineCollection({
      type: 'data',
      source: 'seo/**.yml',
      schema: seoSchema,
    }),
  },
});
