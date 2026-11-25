<script>
	import { base } from '$app/paths';
	import { dev } from '$app/environment';
	import { byId, criteria, sectionOf } from '$lib/data/criteria.js';
	import { evidenceFor, criterionHref, criteriaWithEvidence } from '$lib/content.js';
	import { portfolioMeta, evidenceKinds } from '$lib/data/portfolio.js';
	import { reveal } from '$lib/actions/reveal.js';
	import ResourceCard from '$lib/components/ResourceCard.svelte';
	import Collapse from '$lib/components/Collapse.svelte';

	let { data } = $props();
	let c = $derived(byId[data.id]);
	let s = $derived(sectionOf(c));
	let ev = $derived(evidenceFor(c.id));
	let siblings = $derived(criteriaWithEvidence.filter((x) => x.section === c.section));
	let i = $derived(criteria.indexOf(c));
	let prev = $derived(criteria[i - 1]);
	let next = $derived(criteria[i + 1]);
	let group = $derived(s.groups?.find((g) => g.id === c.group));
	let showScore = $derived(dev || portfolioMeta.showSelfScore);
</script>

<svelte:head><title>{c.section}.{c.num} {c.short} · Портфолио</title></svelte:head>

<div class="page wrap">
	<!-- Странично меню с всички критерии от раздела -->
	<aside class="index" aria-label="Критерии в раздел {s.roman}">
		<a href="{base}/portfolio/{s.slug}/" class="sec">
			<span class="roman">{s.roman}</span>
			<span>{s.title}</span>
		</a>
		<ol>
			{#each siblings as x}
				<li>
					<a href={criterionHref(x)} aria-current={x.id === c.id ? 'page' : undefined}>
						<span class="n">{x.num}</span>
						<span class="t">{x.short}</span>
						<i class="d" class:ok={x.evidenceCount >= 2} class:half={x.evidenceCount === 1} aria-hidden="true"></i>
					</a>
				</li>
			{/each}
		</ol>
	</aside>

	<article>
		<header>
			<nav class="crumbs" aria-label="Път">
				<a href="{base}/portfolio/">Портфолио</a> <span>/</span> <a href="{base}/portfolio/{s.slug}/">{s.roman}. {s.title}</a>
				{#if group}<span>/</span> {group.title}{/if}
			</nav>
			<p class="big" use:reveal aria-hidden="true">{c.section}.{c.num}</p>
			<h1 use:reveal={{ delay: 60 }}>{c.short}</h1>
			<p class="official" use:reveal={{ delay: 120 }}>{c.text}</p>
		</header>

		{#if dev}
			<div class="hint" role="note">
				<b>Подсказка (вижда се само локално):</b>
				{c.hint}
			</div>
		{/if}

		{#if ev.note?.basis || showScore}
			<section class="self" use:reveal>
				<div>
					<p class="h">Самооценка – формира се на базата на</p>
					<p class:fill={!ev.note?.basis}>{ev.note?.basis ?? '[ПОЛЕ ЗА ПОПЪЛВАНЕ]'}</p>
				</div>
				{#if showScore}
					<div class="score" title="Самооценка в точки">
						<span>{ev.note?.selfScore ?? '—'}</span><small>/ 2</small>
					</div>
				{/if}
			</section>
		{/if}

		{#if ev.note?.component}
			<div class="prose note"><ev.note.component /></div>
		{/if}

		<section class="evidence">
			<h2>Доказателства <span class="cnt">{ev.count}</span></h2>

			{#if ev.resources.length}
				<h3 class="sub">Ресурси</h3>
				<div class="cards">
					{#each ev.resources as r}<ResourceCard {r} />{/each}
				</div>
			{/if}

			{#if ev.practices.length}
				<h3 class="sub">Практики</h3>
				<ul class="rows">
					{#each ev.practices as p}
						<li><a href="{base}/praktiki/{p.slug}/"><span>{p.title}</span><span class="arr">→</span></a></li>
					{/each}
				</ul>
			{/if}

			{#if ev.events.length}
				<h3 class="sub">Дейности с ученици</h3>
				<div class="evs">
					{#each ev.events as e}
						<a class="evc" href="{base}/portfolio/deinosti/#{e.slug}">
							{#if e.images[0]}<img src={e.images[0]} alt="" loading="lazy" />{/if}
							<span>{e.title}</span>
						</a>
					{/each}
				</div>
			{/if}

			{#if ev.documents.length}
				<h3 class="sub">Документи</h3>
				<ul class="rows">
					{#each ev.documents as d}
						<li>
							<div class="doc">
								<span>{d.title}</span>
								{#if d.note}<small class:fill={d.note.includes('[')}>{d.note}</small>{/if}
							</div>
							{#if d.href}
								<a class="lock" href={d.href}>отвори →</a>
							{:else if d.url}
								<a class="lock" href={d.url} rel="noopener">ограничен достъп ↗</a>
							{:else}
								<span class="lock pending">предстои качване</span>
							{/if}
						</li>
					{/each}
				</ul>
			{/if}

			{#if !ev.count}
				<p class="empty">Доказателствата към този критерий предстои да бъдат добавени.</p>
			{/if}
		</section>

		<div class="scale">
			<Collapse title="Какво означават 2 точки в раздел {s.roman}">
				<p class="muted">{s.top}</p>
			</Collapse>
		</div>

		<nav class="pager" aria-label="Предишен и следващ критерий">
			{#if prev}
				<a href={criterionHref(prev)}><small>← предишен</small><span>{prev.section}.{prev.num} {prev.short}</span></a>
			{:else}<span></span>{/if}
			{#if next}
				<a href={criterionHref(next)} class="r"><small>следващ →</small><span>{next.section}.{next.num} {next.short}</span></a>
			{/if}
		</nav>
	</article>
</div>

<style>
	.page {
		display: grid;
		grid-template-columns: 270px minmax(0, 1fr);
		gap: 64px;
		padding-top: 140px;
		padding-bottom: 96px;
	}
	.index {
		position: sticky;
		top: 110px;
		align-self: start;
		max-height: calc(100vh - 130px);
		overflow-y: auto;
		padding-right: 8px;
	}
	.sec {
		display: flex;
		align-items: center;
		gap: 12px;
		padding-bottom: 14px;
		margin-bottom: 8px;
		border-bottom: 1px solid var(--line);
		text-decoration: none;
		font-size: 14px;
		font-weight: 600;
		line-height: 1.3;
	}
	.roman {
		font-family: var(--serif);
		font-size: 30px;
		color: var(--sea);
	}
	.index ol {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.index li a {
		display: grid;
		grid-template-columns: 34px 1fr 8px;
		align-items: center;
		gap: 8px;
		padding: 8px 10px;
		border-radius: 10px;
		font-size: 13.5px;
		line-height: 1.35;
		color: var(--ink);
		text-decoration: none;
		transition: background 0.2s;
	}
	.index li a:hover {
		background: var(--paper);
	}
	.index li a[aria-current='page'] {
		background: var(--sea-mist);
		color: var(--sea-deep);
		font-weight: 600;
	}
	.index .n {
		font-family: var(--serif);
		font-size: 16px;
		color: var(--sea);
	}
	.d {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		border: 1px dashed var(--line-strong);
	}
	.d.half {
		border: 1px solid var(--coral);
	}
	.d.ok {
		border: 0;
		background: var(--sea);
	}

	.crumbs {
		font-size: 13px;
		color: var(--ink-soft);
	}
	.crumbs span {
		margin: 0 6px;
	}
	.big {
		margin: 28px 0 0;
		font-family: var(--serif);
		font-size: clamp(80px, 12vw, 140px);
		line-height: 0.85;
		color: var(--sea);
		opacity: 0.18;
		letter-spacing: -0.02em;
	}
	h1 {
		font-size: clamp(36px, 4.6vw, 54px);
		margin-top: -10px;
	}
	.official {
		margin-top: 22px;
		padding: 20px 24px;
		border-left: 1px solid var(--sea);
		background: var(--paper);
		border-radius: 0 var(--radius) var(--radius) 0;
		font-size: 16px;
		line-height: 1.7;
		max-width: 72ch;
	}
	.hint {
		margin-top: 20px;
		padding: 14px 18px;
		border: 1px dashed #d8b98f;
		background: #fbf6ee;
		border-radius: var(--radius);
		font-size: 14.5px;
		color: #7a5428;
	}
	.self {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 24px;
		margin-top: 40px;
		padding: 24px 28px;
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		background: var(--card);
	}
	.self p {
		margin: 0;
		width: fit-content;
	}
	.h {
		font-size: 11px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--ink-soft);
		margin-bottom: 6px !important;
	}
	.score {
		display: flex;
		align-items: baseline;
		gap: 4px;
		font-family: var(--serif);
		color: var(--sea);
	}
	.score span {
		font-size: 56px;
		line-height: 1;
	}
	.score small {
		font-size: 20px;
		color: var(--ink-soft);
	}
	.note {
		margin-top: 32px;
	}
	.evidence {
		margin-top: 56px;
	}
	.evidence h2 {
		display: flex;
		align-items: center;
		gap: 14px;
	}
	.cnt {
		display: inline-grid;
		place-items: center;
		min-width: 36px;
		height: 36px;
		padding: 0 10px;
		border-radius: 999px;
		border: 1px solid var(--sea);
		font: 600 15px var(--sans);
	}
	.sub {
		margin: 36px 0 16px;
		font-family: var(--sans);
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	.cards {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: 20px;
	}
	.evs {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 16px;
	}
	.evc {
		display: flex;
		flex-direction: column;
		gap: 8px;
		text-decoration: none;
		font-size: 14.5px;
		font-weight: 500;
		line-height: 1.35;
	}
	.evc img {
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		border-radius: 12px;
		transition: transform 0.6s var(--ease), box-shadow 0.6s var(--ease);
	}
	.evc:hover img {
		transform: translateY(-3px);
		box-shadow: var(--shadow-soft);
	}
	.rows {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--line);
	}
	.rows li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 16px 0;
		border-bottom: 1px solid var(--line);
	}
	.rows li > a {
		flex: 1;
		display: flex;
		justify-content: space-between;
		text-decoration: none;
		font-weight: 500;
	}
	.arr {
		transition: transform 0.4s var(--ease);
	}
	.rows li > a:hover .arr {
		transform: translateX(4px);
	}
	.doc {
		display: flex;
		flex-direction: column;
	}
	.doc small {
		color: var(--ink-soft);
		font-size: 13.5px;
		width: fit-content;
	}
	.lock {
		flex-shrink: 0;
		font-size: 12.5px;
		padding: 4px 12px;
		border-radius: 999px;
		border: 1px solid var(--sea);
		text-decoration: none;
	}
	.lock.pending {
		border: 1px dashed var(--line-strong);
		color: var(--ink-soft);
	}
	.empty {
		padding: 28px;
		border: 1px dashed var(--line-strong);
		border-radius: var(--radius-lg);
		color: var(--ink-soft);
		margin-top: 16px;
	}
	.scale {
		margin-top: 64px;
	}
	.pager {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
		margin-top: 48px;
	}
	.pager a {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 18px 22px;
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		text-decoration: none;
		transition: border-color 0.3s, transform 0.4s var(--ease);
	}
	.pager a:hover {
		border-color: var(--sea);
		transform: translateY(-2px);
	}
	.pager small {
		font-size: 12px;
		color: var(--ink-soft);
	}
	.pager .r {
		text-align: right;
	}
	@media (max-width: 960px) {
		.page {
			grid-template-columns: 1fr;
			gap: 0;
		}
		.index {
			display: none;
		}
	}
	@media (max-width: 560px) {
		.pager {
			grid-template-columns: 1fr;
		}
		.self {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>
