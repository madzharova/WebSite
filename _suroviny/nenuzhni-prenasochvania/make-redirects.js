// Създава пренасочващи страници за старите адреси от WordPress
// и готови правила за сървъра (nginx и Apache) в build/.
// Пуска се автоматично след `npm run build`.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const map = JSON.parse(readFileSync(new URL('./redirects.json', import.meta.url), 'utf8'));
const out = 'build';

for (const [from, to] of Object.entries(map)) {
	const dir = join(out, decodeURIComponent(from));
	mkdirSync(dir, { recursive: true });
	writeFileSync(
		join(dir, 'index.html'),
		`<!doctype html><html lang="bg"><head><meta charset="utf-8"><title>Страницата е преместена</title>` +
			`<meta http-equiv="refresh" content="0; url=${to}"><link rel="canonical" href="${to}"><meta name="robots" content="noindex"></head>` +
			`<body><p>Страницата е преместена: <a href="${to}">${to}</a></p></body></html>`
	);
}

// nginx (за server { ... } блока)
const enc = (p) => p; // nginx сравнява вече декодирания адрес
writeFileSync(
	join(out, '_redirects.nginx.conf'),
	Object.entries(map)
		.map(([f, t]) => `location = ${enc(f)} { return 301 ${t}; }\nlocation = ${enc(f).replace(/\/$/, '')} { return 301 ${t}; }`)
		.join('\n') + '\n'
);
// Apache (.htaccess)
writeFileSync(
	join(out, '_redirects.htaccess'),
	'RewriteEngine On\n' +
		Object.entries(map)
			.map(([f, t]) => `RewriteRule ^${f.slice(1).replace(/\/$/, '')}/?$ ${t} [R=301,L,NE]`)
			.join('\n') +
		'\n'
);
console.log(`✔ ${Object.keys(map).length} пренасочвания`);
