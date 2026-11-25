import { error } from '@sveltejs/kit';
import { criteria, sections, slugOf } from '$lib/data/criteria.js';

export const entries = () =>
	criteria.map((c) => ({ section: sections.find((s) => s.id === c.section).slug, criterion: slugOf(c.id) }));

export function load({ params }) {
	const c = criteria.find((x) => slugOf(x.id) === params.criterion);
	const s = sections.find((x) => x.slug === params.section);
	if (!c || !s || c.section !== s.id) error(404, 'Няма такъв критерий');
	return { id: c.id };
}
