import { error } from '@sveltejs/kit';
import { sections, slugOf } from '$lib/data/criteria.js';
import { visibleCriteria } from '$lib/content.js';

// На публичния сайт се генерират само критериите с доказателства (виж visibleCriteria).
export const entries = () =>
	visibleCriteria.map((c) => ({ section: sections.find((s) => s.id === c.section).slug, criterion: slugOf(c.id) }));

export function load({ params }) {
	const c = visibleCriteria.find((x) => slugOf(x.id) === params.criterion);
	const s = sections.find((x) => x.slug === params.section);
	if (!c || !s || c.section !== s.id) error(404, 'Няма такъв критерий');
	return { id: c.id };
}
