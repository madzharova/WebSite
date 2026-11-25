// npm run todo – какво още остава за попълване в сайта.
//  1. всички места „[ПОЛЕ ЗА ПОПЪЛВАНЕ…]“ в src/ (съдържание, данни, страници);
//  2. критериите без бележка src/content/criteria/<id>.md – там е колоната
//     „формира се на базата на“ от атестационната карта (Приложение № 20).
// На публичния сайт тези места не се виждат; при `npm run dev` са оцветени.

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const src = join(root, 'src');
const MARK = /\[ПОЛЕ ЗА ПОПЪЛВАНЕ[^\]]*\]/g;

function* files(dir) {
	for (const e of readdirSync(dir, { withFileTypes: true })) {
		const p = join(dir, e.name);
		if (e.isDirectory()) yield* files(p);
		else if (/\.(md|js|svelte)$/.test(e.name)) yield p;
	}
}

const found = new Map();
let total = 0;
for (const f of files(src)) {
	const lines = readFileSync(f, 'utf8').split('\n');
	lines.forEach((line, i) => {
		for (const m of line.matchAll(MARK)) {
			// резервният текст в шаблоните (напр. ?? '[ПОЛЕ ЗА ПОПЪЛВАНЕ]') не е задача
			if (f.endsWith('.svelte')) continue;
			const rel = relative(root, f);
			if (!found.has(rel)) found.set(rel, []);
			const what = m[0].replace(/^\[ПОЛЕ ЗА ПОПЪЛВАНЕ:?\s*/, '').replace(/\]$/, '');
			const key = line.match(/^\s*([\w-]+):/)?.[1];
			found.get(rel).push(`  ${String(i + 1).padStart(4)}  ${key ? key + ': ' : ''}${what || '—'}`);
			total++;
		}
	});
}

const bold = (s) => (process.stdout.isTTY ? `\x1b[1m${s}\x1b[0m` : s);
const dim = (s) => (process.stdout.isTTY ? `\x1b[2m${s}\x1b[0m` : s);

console.log(bold(`\nПолета за попълване: ${total} в ${found.size} файла\n`));
for (const [file, items] of [...found].sort()) {
	console.log(bold(file));
	console.log(items.join('\n'));
}

// Примерно съдържание (example: true) – за визията; на публичния сайт не се показва
const examples = [];
for (const f of files(join(src, 'content'))) {
	const head = readFileSync(f, 'utf8').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
	if (/^example:\s*true\b/m.test(head)) {
		const title = head.match(/^title:\s*"?(.*?)"?\s*$/m)?.[1] ?? '';
		examples.push(`  ${relative(root, f)}  ${dim(title)}`);
	}
}
console.log(bold(`\nПримерно съдържание за замяна (example: true): ${examples.length}`));
console.log(dim('  видимо само при npm run dev; махнете example: true, когато съдържанието е истинско'));
console.log(examples.sort().join('\n'));

const ids = [...readFileSync(join(src, 'lib/data/criteria.js'), 'utf8').matchAll(/id: '([IV]+-[\d.]+)'/g)].map((m) => m[1]);
const missing = ids.filter((id) => !existsSync(join(src, 'content/criteria', `${id}.md`)));
console.log(bold(`\nКритерии без бележка „формира се на базата на“: ${missing.length} от ${ids.length}`));
console.log(dim('  src/content/criteria/<id>.md – поле basis (виж README)'));
console.log('  ' + missing.join(', ') + '\n');
