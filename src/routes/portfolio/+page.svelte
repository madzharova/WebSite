<script>
	import { base } from '$app/paths';
	import { sections } from '$lib/data/criteria.js';
	import { functions, portfolioMeta, scale, evidenceKinds } from '$lib/data/portfolio.js';
	import { criteriaWithEvidence } from '$lib/content.js';
	import { reveal } from '$lib/actions/reveal.js';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import CriteriaMap from '$lib/components/CriteriaMap.svelte';
	import Collapse from '$lib/components/Collapse.svelte';

	const covered = criteriaWithEvidence.filter((c) => c.evidenceCount >= 2).length;
	const fmt = (d) => d.split('-').reverse().join('.');
</script>

<svelte:head><title>Професионално портфолио · Маргарита Маджарова</title></svelte:head>

<PageHeader
	eyebrow="Професионално портфолио · атестационна карта"
	title="Портфолио"
	lead="Подредено по 25-те критерия от Приложение № 20 към Наредба № 15/2019 и петте критерия на ПГМТ „Проф. Цветан Лазаров“. Към всеки критерий – доказателствата и на какво се основава самооценката."
>
	<dl class="facts">
		<div class:fill={portfolioMeta.period.includes('[')}><dt>Период</dt><dd>{portfolioMeta.period}</dd></div>
		<div><dt>Актуализация</dt><dd>{fmt(portfolioMeta.lastUpdated)}</dd></div>
		<div><dt>Критерии с доказателства</dt><dd>{covered} / {criteriaWithEvidence.length}</dd></div>
	</dl>
</PageHeader>

<!-- Четирите функции (чл. 66, ал. 5) -->
<section class="section">
	<div class="wrap">
		<p class="eyebrow" use:reveal>Как е устроено</p>
		<h2 use:reveal={{ delay: 60 }}>Четири функции на портфолиото</h2>
		<div class="fns">
			{#each functions as f, i}
				<a href={f.href} class="fn" use:reveal={{ delay: i * 80 }}>
					<span class="fi">0{i + 1}</span>
					<h3>{f.name}</h3>
					<p>{f.text}</p>
					<span class="go" aria-hidden="true">→</span>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- Картата -->
<section class="section section--paper" id="karta">
	<div class="wrap">
		<div class="maphead">
			<div>
				<p class="eyebrow" use:reveal>Атестационна карта</p>
				<h2 use:reveal={{ delay: 60 }}>25 критерия · 50 точки</h2>
			</div>
			<ul class="legend" aria-label="Легенда">
				<li><i class="l covered"></i>покрит – 2+ доказателства</li>
				<li><i class="l progress"></i>в процес (1)</li>
				<li><i class="l todo"></i>предстои</li>
			</ul>
		</div>
		<CriteriaMap />
	</div>
</section>

<!-- Скриващи се пояснения -->
<section class="section">
	<div class="wrap narrow">
		<h2 use:reveal>Как се оценява</h2>
		<div class="acc">
			<Collapse title="Точки по всеки критерий">
				<p>Всеки критерий се оценява с 1, 1,5 или 2 точки (Наредба № 15, чл. 82, ал. 2). Две точки се дават, когато дейността надвишава изискванията за длъжността и резултатите на учениците надвишават очакваните.</p>
			</Collapse>
			<Collapse title="Окончателен резултат">
				<p><b>ОР = 0,25 × самооценка + 0,75 × оценка на комисията</b> (чл. 82, ал. 6).</p>
				<ul class="scale">
					{#each scale as s}
						<li><span>{s.from}–{s.to === 50 ? 50 : String(s.to).replace('.', ',')}</span>{s.label}</li>
					{/each}
				</ul>
			</Collapse>
			<Collapse title="Какво доказват материалите">
				<p>Според чл. 66, ал. 3 материалите в портфолиото доказват:</p>
				<ul>
					{#each Object.values(evidenceKinds) as e}<li>{e}</li>{/each}
				</ul>
			</Collapse>
			<Collapse title="Лични документи">
				<p>Документите за образование и квалификация не се публикуват. Те са в Google Drive с ограничен достъп. В сайта е само <a href="{base}/portfolio/opis/">описът им</a> (чл. 67, т. 4).</p>
			</Collapse>
		</div>
	</div>
</section>

<style>
	.facts {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin: 0;
	}
	.facts div {
		padding: 12px 18px;
		border: 1px solid var(--line);
		border-radius: 14px;
		background: rgb(255 255 255 / 0.6);
	}
	dt {
		font-size: 11px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	dd {
		margin: 2px 0 0;
		font-weight: 600;
		width: fit-content;
	}
	h2 {
		margin-top: 12px;
	}
	.fns {
		margin-top: 40px;
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		overflow: hidden;
		background: var(--card);
	}
	.fn {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 28px 24px 56px;
		text-decoration: none;
		color: var(--ink);
		border-right: 1px solid var(--line);
		transition: background 0.4s;
	}
	.fn:last-child {
		border-right: 0;
	}
	.fn:hover {
		background: var(--sea-mist);
		color: var(--ink);
	}
	.fi {
		font-size: 12px;
		letter-spacing: 0.12em;
		color: var(--ink-soft);
	}
	.fn p {
		margin: 0;
		font-size: 15px;
		color: var(--ink-soft);
		line-height: 1.55;
	}
	.go {
		position: absolute;
		left: 24px;
		bottom: 20px;
		color: var(--sea);
		transition: transform 0.4s var(--ease);
	}
	.fn:hover .go {
		transform: translateX(6px);
	}
	.maphead {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: flex-end;
		gap: 20px;
		margin-bottom: 48px;
	}
	.legend {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 18px;
		font-size: 13px;
		color: var(--ink-soft);
	}
	.legend li {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.l {
		width: 14px;
		height: 14px;
		border-radius: 4px;
		border: 1px solid var(--line-strong);
		background: var(--card);
	}
	.l.covered {
		border-color: var(--sea);
		background: var(--sea);
	}
	.l.progress {
		border-color: var(--coral);
	}
	.l.todo {
		border-style: dashed;
		background: transparent;
	}
	.narrow {
		max-width: 860px;
	}
	.acc {
		margin-top: 32px;
	}
	.scale {
		list-style: none;
		padding: 0;
	}
	.scale li {
		display: flex;
		gap: 16px;
		padding: 8px 0;
		border-bottom: 1px solid var(--line);
	}
	.scale span {
		min-width: 100px;
		font-family: var(--serif);
		font-size: 19px;
		color: var(--sea);
	}
	@media (max-width: 900px) {
		.fns {
			grid-template-columns: 1fr 1fr;
		}
		.fn:nth-child(2) {
			border-right: 0;
		}
		.fn:nth-child(-n + 2) {
			border-bottom: 1px solid var(--line);
		}
	}
	@media (max-width: 520px) {
		.fns {
			grid-template-columns: 1fr;
		}
		.fn {
			border-right: 0;
			border-bottom: 1px solid var(--line);
		}
	}
</style>
