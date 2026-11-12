// Posts with `draft: true` are left off the live site, but still show up when
// you run `npm run dev` locally so you can preview them.
export const isPublished = ({ data }: { data: { draft?: boolean } }) =>
	import.meta.env.DEV || !data.draft;
