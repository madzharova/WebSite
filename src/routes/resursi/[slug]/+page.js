import { error } from '@sveltejs/kit';
import { resources } from '$lib/content.js';

export const entries = () => resources.map((r) => ({ slug: r.slug }));

export function load({ params }) {
	const r = resources.find((x) => x.slug === params.slug);
	if (!r) error(404, 'Няма такъв ресурс');
	return { slug: r.slug };
}
