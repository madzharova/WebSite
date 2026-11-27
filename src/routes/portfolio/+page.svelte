<script>
	// Начална страница на портфолиото: Общи данни + четирите области от атестационната карта
	// (Приложение № 20 към Наредба № 15/2019) и приложенията. Без точки и без празни места.
	import { base } from '$app/paths';
	import { dev } from '$app/environment';
	import { sections } from '$lib/data/criteria.js';
	import { visibleCriteria, criteriaWithEvidence, testimonials } from '$lib/content.js';
	import { reveal } from '$lib/actions/reveal.js';
	import PageHeader from '$lib/components/PageHeader.svelte';

	// Област без нито един видим критерий не се показва
	const areas = sections.filter((s) => visibleCriteria.some((c) => c.section === s.id));
	const stats = (id) => {
		const all = criteriaWithEvidence.filter((c) => c.section === id);
		return { filled: all.filter((c) => c.evidenceCount > 0).length, all: all.length };
	};

	const appendices = [
		{ href: `${base}/portfolio/filosofia/`, label: 'Философия на преподаването', note: 'как и защо преподавам' },
		{ href: `${base}/portfolio/celi/`, label: 'Цели за развитие', note: 'измерими и със срокове' },
		{ href: `${base}/portfolio/deinosti/`, label: 'Дейности с ученици', note: 'посещения, конкурси, проекти' },
		...(testimonials.length ? [{ href: `${base}/portfolio/otzivi/`, label: 'Отзиви', note: 'от колеги и родители' }] : []),
		{ href: `${base}/portfolio/opis/`, label: 'Опис на документите', note: 'от трудовото досие' }
	];
</script>

<svelte:head><title>Професионално портфолио · Маргарита Маджарова</title></svelte:head>

<PageHeader eyebrow="Професионално портфолио" title="Портфолио" />

<section class="section first">
	<div class="wrap">
		<ul class="tiles">
			<li use:reveal>
				<a class="tile" href="{base}/portfolio/za-men/">
					<span class="roman">А</span>
					<div class="body">
						<h2>Общи данни</h2>
						<p>Образование, квалификации, професионален път.</p>
					</div>
					<span class="go" aria-hidden="true">→</span>
				</a>
			</li>
			{#each areas as s, i}
				{@const st = stats(s.id)}
				<li use:reveal={{ delay: (i + 1) * 70 }}>
					<a class="tile" href="{base}/portfolio/{s.slug}/">
						<span class="roman">{s.roman}</span>
						<div class="body">
							<h2>{s.title}</h2>
							<p>{s.subtitle}</p>
							{#if dev}<span class="local">локално: {st.filled} от {st.all} критерия с доказателства</span>{/if}
						</div>
						<span class="go" aria-hidden="true">→</span>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</section>

<section class="section apps">
	<div class="wrap">
		<p class="eyebrow" use:reveal>Приложения</p>
		<ul class="minis">
			{#each appendices as a, i}
				<li use:reveal={{ delay: i * 50 }}>
					<a class="mini" href={a.href}>
						<span class="mb">
							<span class="t">{a.label}</span>
							<span class="n">{a.note}</span>
						</span>
						<span class="arr" aria-hidden="true">→</span>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.first {
		padding-top: clamp(40px, 5vw, 64px);
		padding-bottom: clamp(36px, 4vw, 48px);
	}
	.tiles {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 14px;
	}
	/* „Общи данни“ – на цял ред, четирите области – 2 × 2 */
	.tiles > li:first-child {
		grid-column: 1 / -1;
	}
	.tile {
		display: grid;
		grid-template-columns: 44px minmax(0, 1fr) 20px;
		align-items: start;
		gap: 14px;
		height: 100%;
		padding: 20px 20px 20px 22px;
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		background: var(--card);
		text-decoration: none;
		color: var(--ink);
		transition: border-color 0.3s, box-shadow 0.5s var(--ease);
	}
	.tile:hover {
		border-color: var(--sea);
		box-shadow: var(--shadow-soft);
	}
	.roman {
		font-family: var(--serif);
		font-size: 30px;
		line-height: 1;
		color: var(--sea);
		text-align: center;
	}
	.body {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.tile h2 {
		font-size: 21px;
		line-height: 1.2;
		margin: 0;
	}
	.tile p {
		margin: 0;
		color: var(--ink-soft);
		font-size: 14px;
		line-height: 1.5;
	}
	.local {
		margin-top: 6px;
		font-size: 12px;
		color: #7a5428;
		border: 1px dashed #d8b98f;
		background: #fbf6ee;
		border-radius: 999px;
		padding: 1px 9px;
		width: fit-content;
	}
	.go {
		align-self: center;
		font-size: 18px;
		color: var(--sea);
		transition: transform 0.4s var(--ease);
	}
	.tile:hover .go {
		transform: translateX(4px);
	}
	.apps {
		padding-top: 0;
	}
	.minis {
		list-style: none;
		margin: 18px 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 14px;
	}
	.mini {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		height: 100%;
		padding: 16px 20px;
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		background: var(--card);
		text-decoration: none;
		color: var(--ink);
		transition: border-color 0.3s, box-shadow 0.5s var(--ease);
	}
	.mini:hover {
		border-color: var(--sea);
		box-shadow: var(--shadow-soft);
	}
	.mb {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.mini .t {
		font-family: var(--serif);
		font-size: 19px;
		font-weight: 600;
		line-height: 1.2;
		color: var(--sea);
	}
	.mini .n {
		font-size: 13.5px;
		color: var(--ink-soft);
	}
	.arr {
		color: var(--sea);
		transition: transform 0.4s var(--ease);
	}
	.mini:hover .arr {
		transform: translateX(4px);
	}
	@media (max-width: 900px) {
		.minis {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 760px) {
		.tiles,
		.minis {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 560px) {
		.tile {
			grid-template-columns: 34px minmax(0, 1fr) 16px;
			gap: 12px;
			padding: 16px;
		}
		.roman {
			font-size: 24px;
		}
		.tile h2 {
			font-size: 19px;
		}
		.tile p {
			font-size: 13.5px;
		}
	}
</style>
