// Зарежда цялото съдържание от src/content/**.md.
// Един ресурс се въвежда веднъж – появява се в библиотеката и като доказателство
// към всички критерии, изброени в полето `criteria`.

import { criteria, sections, slugOf } from './data/criteria.js';
import { documents } from './data/documents.js';
import { base } from '$app/paths';
import { dev } from '$app/environment';

// Път от Markdown полетата (cover: /img/…) → с базовия път; външните адреси остават.
const withBase = (v) =>
	typeof v === 'string' && v.startsWith('/') && !v.startsWith('//')
		? base + v
		: Array.isArray(v)
			? v.map(withBase)
			: v && typeof v === 'object'
				? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, withBase(x)]))
				: v;

export const criterionHref = (c) =>
	`${base}/portfolio/${sections.find((s) => s.id === c.section).slug}/${slugOf(c.id)}/`;

const fileSlug = (path) => path.split('/').pop().replace(/\.md$/, '');

/** @param {Record<string, any>} modules */
function collect(modules) {
	return Object.entries(modules)
		.map(([path, mod]) => ({
			slug: fileSlug(path),
			...withBase(mod.metadata),
			criteria: mod.metadata?.criteria ?? [],
			evidence: mod.metadata?.evidence ?? [],
			component: mod.default
		}))
		// draft: true – скрито навсякъде;
		// example: true – примерно съдържание за визията, видимо само при npm run dev
		.filter((item) => !item.draft && (dev || !item.example))
		.sort((a, b) => String(b.date ?? '').localeCompare(String(a.date ?? '')));
}

export const resources = collect(import.meta.glob('/src/content/resources/*.md', { eager: true }));
export const practices = collect(import.meta.glob('/src/content/practices/*.md', { eager: true }));
export const events = Object.entries(import.meta.glob('/src/content/events/*.md', { eager: true }))
	.map(([path, mod]) => {
		const slug = fileSlug(path);
		const n = Number(mod.metadata?.images ?? 0);
		return {
			slug,
			...withBase(mod.metadata),
			criteria: mod.metadata?.criteria ?? [],
			evidence: mod.metadata?.evidence ?? [],
			images: Array.from({ length: n }, (_, i) => `${base}/img/deinosti/${slug}/${i + 1}.webp`),
			component: mod.default
		};
	})
	.sort((a, b) => String(b.sort ?? '').localeCompare(String(a.sort ?? '')));

export const testimonials = collect(import.meta.glob('/src/content/testimonials/*.md', { eager: true }));

// Доказателства, описани директно към критерий: src/content/criteria/I-1.1.md
const criterionNotes = Object.fromEntries(
	Object.entries(import.meta.glob('/src/content/criteria/*.md', { eager: true })).map(([path, mod]) => [
		fileSlug(path),
		{ ...withBase(mod.metadata), component: mod.default }
	])
);

export const subjects = {
	all: 'Всички предмети',
	bel: 'БЕЛ',
	fr: 'Френски',
	'bel-fr': 'БЕЛ + Френски'
};

/** Ресурси на предмет – включително общите (bel-fr) и универсалните (all) */
export const resourcesFor = (key) =>
	resources.filter((r) => r.subject === key || r.subject === 'bel-fr' || r.subject === 'all');

/** Класовете на материал – `grade: 11` или `grade: [10, 11, 12]` */
export const gradesOf = (r) => [].concat(r.grade ?? []).map(String);

/** Етикет: „11 клас“, „10–12 клас“ (поредни) или „8, 10 клас“ */
export function gradeLabel(r) {
	const g = gradesOf(r).map(Number).sort((a, b) => a - b);
	if (!g.length) return '';
	const run = g.length > 2 && g.every((x, i) => i === 0 || x === g[i - 1] + 1);
	return `${run ? `${g[0]}–${g.at(-1)}` : g.join(', ')} клас`;
}

export const types = ['урок', 'игра', 'упражнение', 'тест', 'презентация', 'инструмент'];

/** Всичко, което доказва даден критерий */
export function evidenceFor(id) {
	const note = criterionNotes[id] ?? null;
	const res = resources.filter((r) => r.criteria.includes(id));
	const pr = practices.filter((p) => p.criteria.includes(id));
	const ev = events.filter((e) => e.criteria.includes(id));
	const tst = ['I-4.1', 'II-2.3'].includes(id) && testimonials.length
		? [{ title: `Отзиви от родители (${testimonials.length})`, href: `${base}/portfolio/otzivi/` }]
		: [];
	const docs = [...tst, ...(note?.documents ?? []), ...withBase(documents.filter((d) => d.criteria?.includes(id)))];
	return {
		note,
		resources: res,
		practices: pr,
		events: ev,
		documents: docs,
		count: res.length + pr.length + ev.length + docs.length
	};
}

export const criteriaWithEvidence = criteria.map((c) => ({
	...c,
	slug: slugOf(c.id),
	evidenceCount: evidenceFor(c.id).count
}));

/**
 * Критериите, които се показват. На публичния сайт – само тези с поне едно доказателство,
 * за да няма празни страници. Локално (npm run dev) – всички, с етикет „предстои“.
 * Щом към критерий се добави доказателство, той се появява сам.
 */
export const visibleCriteria = criteriaWithEvidence.filter((c) => dev || c.evidenceCount > 0);

/** Плосък индекс за търсачката */
export const searchIndex = [
	...resources.map((r) => ({
		kind: r.subject === 'fr' ? 'Français' : r.subject === 'bel' ? 'Български' : 'Ресурс',
		title: r.title,
		text: `${r.summary ?? ''} ${subjects[r.subject] ?? ''} ${r.type ?? ''}`,
		href: `${base}/resursi/${r.slug}/`
	})),
	...practices.map((p) => ({
		kind: 'Практика',
		title: p.title,
		text: `${p.problem ?? ''} ${p.solution ?? ''}`,
		href: `${base}/praktiki/${p.slug}/`
	})),
	...events.map((e) => ({
		kind: 'Дейност',
		title: e.title,
		text: `${e.place ?? ''} ${e.kind ?? ''}`,
		href: `${base}/portfolio/deinosti/#${e.slug}`
	})),
	...visibleCriteria.map((c) => ({
		kind: `Критерий ${c.section}.${c.num}`,
		title: c.short,
		text: c.text,
		href: criterionHref(c)
	}))
];

/** Страници с текст (За мен, Философия, Цели) от src/content/pages/*.md */
export const pages = Object.fromEntries(
	Object.entries(import.meta.glob('/src/content/pages/*.md', { eager: true })).map(([path, mod]) => [
		fileSlug(path),
		{ ...mod.metadata, component: mod.default }
	])
);
