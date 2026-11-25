import { error } from '@sveltejs/kit';
import { sections } from '$lib/data/criteria.js';

export const entries = () => sections.map((s) => ({ section: s.slug }));

export function load({ params }) {
	const s = sections.find((x) => x.slug === params.section);
	if (!s) error(404, 'Няма такъв раздел');
	return { id: s.id };
}
