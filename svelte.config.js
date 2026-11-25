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

// Незавършените места в Markdown текста – „[ПОЛЕ ЗА ПОПЪЛВАНЕ…]“ – получават клас .fill:
// при `npm run dev` се виждат оцветени, на публичния сайт се скриват (виж app.css).
// Цял ред → <p class="fill">, част от изречение → <span class="fill">. Front matter не се пипа.
const FILL = /\[ПОЛЕ ЗА ПОПЪЛВАНЕ[^\]]*\]/g;
function markFill(body) {
	return body
		.split('\n')
		.map((line) => {
			const t = line.trim();
			if (t.startsWith('[ПОЛЕ ЗА ПОПЪЛВАНЕ') && t.replace(FILL, '').trim() === '') {
				return line.replace(t, `<p class="fill">${t}</p>`);
			}
			return line.replace(FILL, (m) => `<span class="fill">${m}</span>`);
		})
		.join('\n');
}

// Обработка на Markdown съдържанието преди mdsvex:
// – вътрешните връзки (](/…), href="/…", src="/…") получават базовия път;
// – незавършените места се маркират с клас .fill.
const markdownPre = {
	name: 'markdown-pre',
	markup({ content, filename }) {
		if (!filename?.endsWith('.md')) return;
		const fm = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
		const head = fm ? fm[0] : '';
		let body = markFill(content.slice(head.length));
		if (base) {
			body = body
				.replace(/\]\(\/(?!\/)/g, `](${base}/`)
				.replace(/\b(href|src)="\/(?!\/)/g, `$1="${base}/`);
		}
		return { code: head + body };
	}
};

const out = process.env.PREVIEW ? 'build-preview' : 'build';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [markdownPre, mdsvex({ extensions: ['.md'] })],
	kit: {
		adapter: adapter({ pages: out, assets: out, fallback: '404.html' }),
		appDir: process.env.PREVIEW ? 'app' : '_app',
		paths: { base },
		prerender: { handleHttpError: 'warn', handleMissingId: 'warn' }
	}
};

export default config;
