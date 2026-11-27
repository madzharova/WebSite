<script>
	import { base } from '$app/paths';
	import { dev } from '$app/environment';
	import { resources, subjects, criterionHref, gradeLabel } from '$lib/content.js';
	import { byId } from '$lib/data/criteria.js';
	import { evidenceKinds } from '$lib/data/portfolio.js';
	import { subjectPages } from '$lib/data/subjects.js';
	import { reveal } from '$lib/actions/reveal.js';
	import ResourceCard from '$lib/components/ResourceCard.svelte';

	let { data } = $props();
	let r = $derived(resources.find((x) => x.slug === data.slug));
	let related = $derived(resources.filter((x) => x.slug !== r.slug && (x.subject === r.subject || x.type === r.type)).slice(0, 3));
</script>

<svelte:head>
	<title>{r.title} · Ресурси</title>
	<meta name="description" content={r.summary} />
</svelte:head>

<article>
	<header class="rh" class:with-cover={r.cover}>
		<div class="wrap" class:hgrid={r.cover}>
			<div>
			<!-- Видим път обратно към предмета -->
			<nav class="back" aria-label="Обратно">
				{#if subjectPages[r.subject]}
					<a href={subjectPages[r.subject].href}><span aria-hidden="true">←</span> {subjectPages[r.subject].name}</a>
				{:else if r.subject === 'bel-fr'}
					<a href="{base}/balgarski/"><span aria-hidden="true">←</span> Български</a>
					<a href="{base}/francais/"><span aria-hidden="true">←</span> Français</a>
				{:else}
					<a href="{base}/resursi/"><span aria-hidden="true">←</span> Всички ресурси</a>
				{/if}
			</nav>
			<div class="meta" use:reveal>
				<span class="chip subj" data-subject={r.subject}>{subjects[r.subject]}</span>
				<span class="chip">{r.type}</span>
				{#if r.grade}<span class="chip">{gradeLabel(r)}</span>{/if}
				{#if r.example}<span class="chip ex">примерен ресурс</span>{/if}
			</div>
			<h1 use:reveal={{ delay: 60 }}>{r.title}</h1>
			<p class="lead" use:reveal={{ delay: 120 }}>{r.summary}</p>
			<div class="actions" use:reveal={{ delay: 180 }}>
				{#if r.link}<a class="btn" href={r.link} rel="noopener">{r.linkLabel ?? "Отвори ресурса"} <span class="arrow">↗</span></a>{/if}
				{#each r.files ?? [] as f}<a class="btn btn--ghost" href={f.href} download>↓ {f.label}</a>{/each}
				{#if r.drive}<a class="btn btn--ghost" href={r.drive} rel="noopener">Споделено с колегите</a>{/if}
			</div>
			</div>
			{#if r.cover}<img class="hcover" src={r.cover} alt="Плакат: {r.title}" use:reveal={{ delay: 200 }} />{/if}
		</div>
	</header>

	<div class="wrap body" class:wide={r.wide} class:solo={!dev}>
		<div class="prose">
			<r.component />
		</div>

		<!-- Към кои критерии е доказателство – само локално; публично се вижда в портфолиото -->
		{#if dev}
		<aside class="side">
			<div class="box">
				<p class="h">Доказателство към</p>
				<ul>
					{#each r.criteria as id}
						{@const c = byId[id]}
						{#if c}
							<li><a href={criterionHref(c)}><b>{c.section}.{c.num}</b> {c.short}</a></li>
						{:else if dev}
							<li class="warn">Непознат критерий: {id}</li>
						{/if}
					{/each}
				</ul>
				{#if r.evidence.length}
					<p class="h">Вид доказателство</p>
					{#each r.evidence as e}<p class="ev">{evidenceKinds[e] ?? e}</p>{/each}
				{/if}
			</div>
		</aside>
		{/if}
	</div>
</article>

{#if related.length}
	<section class="section section--paper">
		<div class="wrap">
			<h2>Още ресурси</h2>
			<div class="rel">
				{#each related as x}<ResourceCard r={x} />{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	.rh {
		padding: 150px 0 56px;
		border-bottom: 1px solid var(--line);
		background: radial-gradient(60% 80% at 90% 0%, rgb(228 238 244 / 0.7), transparent 70%);
	}
	.hgrid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 300px;
		gap: 56px;
		align-items: center;
	}
	.hcover {
		width: 100%;
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-float);
		transform: rotate(2deg);
		transition: transform 0.6s var(--ease);
	}
	.hcover:hover {
		transform: rotate(0) scale(1.02);
	}
	@media (max-width: 860px) {
		.hgrid {
			grid-template-columns: 1fr;
		}
		.hcover {
			max-width: 280px;
		}
	}
	.back {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 24px;
	}
	.back a {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 7px 16px 7px 12px;
		border: 1px solid var(--line);
		border-radius: 999px;
		background: var(--card);
		font-size: 14px;
		font-weight: 500;
		color: var(--sea);
		text-decoration: none;
		transition: border-color 0.3s;
	}
	.back a:hover {
		border-color: var(--sea);
	}
	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-bottom: 18px;
	}
	.subj {
		border-color: var(--sea);
		color: var(--sea);
	}
	.subj[data-subject='fr'] {
		border-color: var(--coral);
		color: var(--coral);
	}
	.ex {
		background: #fbf1e6;
		color: #8a5a2b;
		border-color: #ecd6bd;
	}
	h1 {
		font-size: clamp(38px, 5vw, 60px);
		max-width: 20ch;
	}
	.lead {
		margin-top: 18px;
	}
	.actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px;
		margin-top: 24px;
	}
	.body {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 300px;
		gap: 64px;
		padding-block: 56px 96px;
	}
	.side {
		position: relative;
	}
	/* wide: true – интерактивен тест на цялата ширина, колоната с критериите отива отдолу */
	.body.solo {
		grid-template-columns: minmax(0, 1fr);
	}
	.body.wide {
		grid-template-columns: 1fr;
		gap: 32px;
	}
	.body.wide .prose {
		max-width: none;
	}
	.body.wide .box {
		position: static;
		max-width: 520px;
	}
	.box {
		position: sticky;
		top: 110px;
		padding: 22px;
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		background: var(--card);
	}
	.h {
		margin: 0 0 10px;
		font-size: 11px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	.box ul {
		list-style: none;
		margin: 0 0 18px;
		padding: 0;
	}
	.box li a {
		display: block;
		padding: 8px 0;
		border-bottom: 1px solid var(--line);
		font-size: 14.5px;
		line-height: 1.4;
		text-decoration: none;
	}
	.box li a b {
		font-family: var(--serif);
		font-size: 17px;
		margin-right: 6px;
	}
	.box li a:hover {
		color: var(--sea-deep);
		text-decoration: underline;
	}
	.warn {
		color: var(--coral);
		font-size: 13px;
	}
	.ev {
		font-size: 13.5px;
		color: var(--ink-soft);
		line-height: 1.45;
		margin-bottom: 8px;
	}
	.rel {
		margin-top: 32px;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 24px;
	}
	@media (max-width: 900px) {
		.body {
			grid-template-columns: 1fr;
			gap: 32px;
		}
	}
</style>
