import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
	collections: {
		content: defineCollection({
			type: 'page',
			source: '**/**.md',
			schema: z.object({
				title: z.string(),
				description: z.string().optional(),
				language: z.string(),
				date: z.string().optional(),
			}),
		}),
		navbar: defineCollection({
			type: 'data',
			source: 'navbar/**.yml',
			schema: z.object({
				language: z.string(),
				home: z.string(),
				about: z.string(),
				activities: z.string(),
				contact: z.string(),
			})
		}),
	}
})
