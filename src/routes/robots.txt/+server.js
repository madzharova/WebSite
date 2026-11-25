import { SITE } from '$lib/data/site.js';

export const prerender = true;

export function GET() {
	return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`, {
		headers: { 'Content-Type': 'text/plain' }
	});
}
