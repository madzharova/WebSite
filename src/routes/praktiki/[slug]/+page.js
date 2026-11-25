import { error } from '@sveltejs/kit';
import { practices } from '$lib/content.js';

export const entries = () => practices.map((p) => ({ slug: p.slug }));

export function load({ params }) {
	if (!practices.some((p) => p.slug === params.slug)) error(404, 'Няма такава практика');
	return { slug: params.slug };
}
