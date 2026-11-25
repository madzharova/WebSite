import { SITE } from '$lib/data/site.js';
import { resources, practices, criterionHref } from '$lib/content.js';
import { criteria, sections } from '$lib/data/criteria.js';

export const prerender = true;

export function GET() {
	const pages = [
		'/', '/balgarski/', '/francais/', '/resursi/', '/praktiki/', '/kontakt/',
		'/portfolio/', '/portfolio/za-men/', '/portfolio/filosofia/', '/portfolio/celi/', '/portfolio/deinosti/', '/portfolio/otzivi/', '/portfolio/opis/',
		...sections.map((s) => `/portfolio/${s.slug}/`),
		...criteria.map(criterionHref),
		...resources.map((r) => `/resursi/${r.slug}/`),
		...practices.map((p) => `/praktiki/${p.slug}/`)
	];
	const body =
		'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
		pages.map((p) => `  <url><loc>${SITE}${encodeURI(p)}</loc></url>`).join('\n') +
		'\n</urlset>\n';
	return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
