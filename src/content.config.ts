import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// The /admin editor can save an optional field as '' or null; treat that as 'not set'.
const emptyToUndefined = (value: unknown) => (value === '' || value === null ? undefined : value);

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.preprocess(emptyToUndefined, z.coerce.date().optional()),
			// A file in src/assets, or a link to an image hosted elsewhere (e.g. Cloudinary).
			heroImage: z.preprocess(emptyToUndefined, z.union([z.string().url(), image()]).optional()),
			// draft: true keeps the post off the live site (it still shows in `npm run dev`).
			draft: z.boolean().default(false),
		}),
});

const de = defineCollection({
	loader: glob({ base: './src/content/de', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.preprocess(emptyToUndefined, z.coerce.date().optional()),
			// A file in src/assets, or a link to an image hosted elsewhere (e.g. Cloudinary).
			heroImage: z.preprocess(emptyToUndefined, z.union([z.string().url(), image()]).optional()),
			// draft: true keeps the post off the live site (it still shows in `npm run dev`).
			draft: z.boolean().default(false),
		}),
});

const projects = defineCollection({
	loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		context: z.string(),
		order: z.number().default(99),
		featured: z.boolean().default(false),
		summary: z.string(),
		highlights: z.array(z.string()).default([]),
		tools: z.array(z.string()).default([]),
		links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
	}),
});

const apps = defineCollection({
	loader: glob({ base: './src/content/apps', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Full link, or a path on this site such as /calories/
		url: z.string(),
		icon: z.preprocess(emptyToUndefined, z.string().optional()),
		order: z.number().default(99),
		tags: z.array(z.string()).default([]),
	}),
});

export const collections = { blog, de, projects, apps };
