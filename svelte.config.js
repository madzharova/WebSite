import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';
import { loadEnv } from 'vite';

// Режимът идва от `vite build --mode <mode>` (напр. `npm run build:github` → `.env.github`).
const argMode = process.argv.indexOf('--mode');
const mode = argMode > -1 ? process.argv[argMode + 1] : process.env.NODE_ENV === 'development' ? 'development' : 'production';
const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };

// Публичният адрес на сайта. Пътят в него (напр. /WebSite) става базов път на всички страници.
const SITE_URL = (env.VITE_SITE_URL || 'https://madzharova.e-class.live').replace(/\/$/, '');
const base = new URL(SITE_URL).pathname.replace(/\/$/, '');
// Prerender-ът върви в отделен процес без `--mode` – предаваме адреса през средата.
process.env.VITE_SITE_URL = SITE_URL;

// Вътрешните връзки в Markdown съдържанието (](/…), href="/…", src="/…") получават базовия път.
const markdownBase = {
	name: 'markdown-base',
	markup({ content, filename }) {
		if (!base || !filename?.endsWith('.md')) return;
		return {
			code: content
				.replace(/\]\(\/(?!\/)/g, `](${base}/`)
				.replace(/\b(href|src)="\/(?!\/)/g, `$1="${base}/`)
		};
	}
};

const out = process.env.PREVIEW ? 'build-preview' : 'build';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [markdownBase, mdsvex({ extensions: ['.md'] })],
	kit: {
		adapter: adapter({ pages: out, assets: out, fallback: '404.html' }),
		appDir: process.env.PREVIEW ? 'app' : '_app',
		paths: { base },
		prerender: { handleHttpError: 'warn', handleMissingId: 'warn' }
	}
};

export default config;
