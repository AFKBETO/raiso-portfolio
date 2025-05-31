import { defineContentConfig, defineCollection, z } from '@nuxt/content'
import type { Locale } from './types/locale';

const contentSchema = z.object({
	title: z.string(),
	description: z.string().optional(),
	language: z.string(),
	date: z.string().optional(),
});

const localeEnum = z.enum(['en', 'fr']);

const localeSchema = z.custom<{
	[key in Locale]?: string
}>(data => {
	return z.record(
		z.string().refine(val => val.match(new RegExp(`^${localeEnum.options.join('|')}`))),
		z.string()
	).safeParse(data).success
})

const headerSchema = z.object({
	language: z.string(),
	home: z.string(),
	about: z.string(),
	activities: z.string()
});

const footerSchema = z.object({
	language: z.string(),
	body: z.string(),
});

const pieceSchema = z.object({
	id: z.string(),
	title: z.string(),
	date: z.date(),
	size: z.string(),
	material: localeSchema,
	imageUrl: z.string(),
	description: localeSchema,
})

const seriesSchema = z.object({
	id: z.string(),
	title: z.string(),
	pieces: z.array(pieceSchema),
	date: z.date(),
})

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
		works: defineCollection({
			type: 'data',
			source: 'data/works.json',
			schema: z.object({
				results: z.array(pieceSchema.or(seriesSchema)),
			}),
		})
	}
})
