<script>
	import { dev } from '$app/environment';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import { events, criterionHref } from '$lib/content.js';
	import { byId } from '$lib/data/criteria.js';
	import { reveal } from '$lib/actions/reveal.js';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import Lightbox from '$lib/components/Lightbox.svelte';

	const kinds = [...new Set(events.map((e) => e.kind))];
	let kind = $state('');
	let list = $derived(events.filter((e) => !kind || e.kind === kind));

	let current = $state(null);
	let index = $state(-1);
	function openEvent(e, i = 0) {
		current = e;
		index = i;
	}

	// Отваряне по адрес /portfolio/deinosti/#berlin
	$effect(() => {
		const h = decodeURIComponent(location.hash.slice(1));
		const e = events.find((x) => x.slug === h);
		if (e) setTimeout(() => document.getElementById(e.slug)?.scrollIntoView({ block: 'center' }), 300);
	});

	const fill = (s) => /\[ПОЛЕ/.test(s ?? '');
	const subj = { bel: 'БЕЛ', fr: 'Français', all: '' };
</script>

<svelte:head><title>Дейности с ученици · Портфолио</title></svelte:head>

<PageHeader
	eyebrow="Портфолио · Динамика на изявите"
	title="Дейности с ученици"
	lead="Посещения, конкурси, проекти и празници – учене извън класната стая. Лицата на учениците са замъглени."
>
	<div class="chips" role="group" aria-label="Вид дейност">
		<button class:on={!kind} onclick={() => (kind = '')}>Всички <span>{events.length}</span></button>
		{#each kinds as k}
			<button class:on={kind === k} onclick={() => (kind = kind === k ? '' : k)}>
				{k} <span>{events.filter((e) => e.kind === k).length}</span>
			</button>
		{/each}
	</div>
</PageHeader>

<section class="section">
	<div class="wrap">
		<ul class="grid">
			{#each list as e, i (e.slug)}
				<li id={e.slug} animate:flip={{ duration: 500 }} in:fade={{ duration: 250 }} class:wide={i % 5 === 0}>
					<article class="ev" use:reveal={{ delay: (i % 3) * 70 }}>
						<button class="cover" onclick={() => openEvent(e)} aria-label="Снимки: {e.title}">
							{#if e.images[0]}
								<img src={e.images[0]} alt="" loading="lazy" />
							{/if}
							{#if e.images.length > 1}<span class="count">{e.images.length} снимки</span>{/if}
							<span class="zoom" aria-hidden="true">+</span>
						</button>
						<div class="txt">
							<p class="meta">
								<span class="kind">{e.kind}</span>
								{#if subj[e.subject]}<span class="subj" data-subject={e.subject}>{subj[e.subject]}</span>{/if}
							</p>
							<h2>{e.title}</h2>
							<p class="when">
								<span class:fill={fill(e.date)}>{e.date}</span>
								{#if e.place}<span class="dot">·</span><span class:fill={fill(e.place)}>{e.place}</span>{/if}
							</p>
							<div class="crit">
								{#each e.criteria as id}
									{@const c = byId[id]}
									{#if c}<a class="chip" href={criterionHref(c)} title={c.short}>{c.section}.{c.num}</a>{/if}
								{/each}
							</div>
							{#if dev && e.check}<p class="check">За проверка: {e.check}</p>{/if}
						</div>
					</article>
				</li>
			{/each}
		</ul>
	</div>
</section>

{#if current}
	<Lightbox images={current.images} bind:index title={current.title}>
		<current.component />
	</Lightbox>
{/if}

<style>
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.chips button {
		display: inline-flex;
		gap: 8px;
		align-items: center;
		min-height: 42px;
		padding: 8px 16px;
		border-radius: 999px;
		border: 1px solid var(--line);
		background: rgb(255 255 255 / 0.7);
		font: 500 14.5px var(--sans);
		color: var(--ink);
		cursor: pointer;
		transition: background 0.25s, color 0.25s, border-color 0.25s;
	}
	.chips button span {
		font-size: 12px;
		opacity: 0.6;
	}
	.chips button:hover {
		border-color: var(--sea);
	}
	.chips button.on {
		background: var(--sea);
		border-color: var(--sea);
		color: #fff;
	}
	.grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 28px;
	}
	.grid li.wide {
		grid-column: span 2;
	}
	.ev {
		height: 100%;
		display: flex;
		flex-direction: column;
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		background: var(--card);
		overflow: hidden;
		transition: box-shadow 0.5s var(--ease), transform 0.5s var(--ease);
	}
	.ev:hover {
		box-shadow: var(--shadow-soft);
		transform: translateY(-3px);
	}
	.cover {
		position: relative;
		display: block;
		width: 100%;
		aspect-ratio: 4 / 3;
		padding: 0;
		border: 0;
		background: var(--paper);
		overflow: hidden;
		cursor: zoom-in;
	}
	.wide .cover {
		aspect-ratio: 16 / 9;
	}
	.cover img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 1.2s var(--ease);
	}
	.ev:hover .cover img {
		transform: scale(1.05);
	}
	.count {
		position: absolute;
		left: 14px;
		bottom: 14px;
		padding: 4px 12px;
		border-radius: 999px;
		background: rgb(250 248 245 / 0.85);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		font-size: 12.5px;
		color: var(--ink);
	}
	.zoom {
		position: absolute;
		right: 14px;
		top: 14px;
		width: 40px;
		height: 40px;
		display: grid;
		place-items: center;
		border-radius: 50%;
		background: rgb(250 248 245 / 0.85);
		color: var(--sea);
		font-size: 22px;
		opacity: 0;
		transform: scale(0.8);
		transition: opacity 0.3s, transform 0.4s var(--ease);
	}
	.ev:hover .zoom {
		opacity: 1;
		transform: none;
	}
	.txt {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 22px 24px 24px;
		flex: 1;
	}
	.meta {
		margin: 0;
		display: flex;
		gap: 10px;
		font-size: 11.5px;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	.subj {
		color: var(--sea);
		font-weight: 600;
	}
	.subj[data-subject='fr'] {
		color: var(--coral);
	}
	h2 {
		font-size: 26px;
		line-height: 1.2;
	}
	.wide h2 {
		font-size: 32px;
	}
	.when {
		margin: 0;
		font-size: 14px;
		color: var(--ink-soft);
	}
	.when span {
		width: fit-content;
	}
	.dot {
		margin: 0 6px;
	}
	.crit {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: auto;
		padding-top: 10px;
	}
	.crit a {
		text-decoration: none;
		color: var(--sea);
		font-size: 12.5px;
		padding: 2px 10px;
	}
	.crit a:hover {
		border-color: var(--sea);
	}
	.check {
		margin: 6px 0 0;
		font-size: 13px;
		color: #7a5428;
		background: #fbf6ee;
		border: 1px dashed #d8b98f;
		border-radius: 8px;
		padding: 6px 10px;
	}
	@media (max-width: 1000px) {
		.grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 640px) {
		.grid {
			grid-template-columns: 1fr;
		}
		.grid li.wide {
			grid-column: auto;
		}
		.wide .cover {
			aspect-ratio: 4 / 3;
		}
	}
</style>
