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

	// „Копирай връзката“ – за изпращане на учениците
	let copied = $state(false);
	async function copyLink() {
		try {
			await navigator.clipboard.writeText(location.href.split('#')[0]);
		} catch {
			const t = document.createElement('textarea');
			t.value = location.href.split('#')[0];
			document.body.append(t);
			t.select();
			document.execCommand('copy');
			t.remove();
		}
		copied = true;
		setTimeout(() => (copied = false), 2500);
	}
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
				{#if r.level && !String(r.level).includes('[')}<span class="chip">ниво {r.level}</span>{:else if r.grade}<span class="chip">{gradeLabel(r)}</span>{/if}
				{#if r.example}<span class="chip ex">примерен ресурс</span>{/if}
			</div>
			<h1 use:reveal={{ delay: 60 }}>{r.title}</h1>
			<!-- При упражненията описанието само повтаря заглавието – там не се показва (остава на картите) -->
			{#if !['упражнение', 'тест'].includes(r.type)}<p class="lead" use:reveal={{ delay: 120 }}>{r.summary}</p>{/if}
			{#if r.interactive && r.defi}
				<!-- Игрите „Le Défi du français“ – как се използват в клас -->
				<ul class="use three" aria-label="Как да го използвате" use:reveal={{ delay: 160 }}>
					<li>
						<svg class="ui" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h18M4 4v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4M12 16v4M9 20h6M8 12l3-3 2 2 3-3" /></svg>
						<div>
							<b>На проектор или интерактивна дъска</b>
							<span>Отворете тази страница и натиснете „Цял екран“. Класът избира отговора заедно, а след всеки въпрос се показва кратко обяснение. За „Défi chrono“ разделете класа на два отбора: всеки има 90 секунди, печели отборът с повече точки.</span>
						</div>
					</li>
					<li>
						<svg class="ui" viewBox="0 0 24 24" aria-hidden="true"><path d="M13 9a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1zM18 8V5a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h9M16 9h2" /></svg>
						<div>
							<b>На телефона или компютъра на всеки ученик</b>
							<span>Изпратете им връзката. Отваря се на всяко устройство, без регистрация и без инсталиране. Накрая всеки вижда своите точки и въпросите, на които е сгрешил.</span>
							<button class="copy" onclick={copyLink}>{copied ? 'Връзката е копирана ✓' : 'Копирай връзката'}</button>
						</div>
					</li>
					<li>
						<svg class="ui" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2" /></svg>
						<div>
							<b>Как се играе</b>
							<span>Два режима: <i>Entraînement</i> е 12 въпроса без бързане, с обяснение на български след всеки отговор. <i>Défi chrono</i> е 90 секунди за колкото може повече верни отговори, с бонус за поредица от верни. Въпросите се сменят при всяка игра.</span>
						</div>
					</li>
				</ul>
			{:else if r.interactive}
				<!-- Как се използва – на прост език, за колеги, които не са сигурни дали могат -->
				<ul class="use" aria-label="Как да го използвате" use:reveal={{ delay: 160 }}>
					<li>
						<svg class="ui" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h18M4 4v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4M12 16v4M9 20h6M8 12l3-3 2 2 3-3" /></svg>
						<div>
							<b>На проектор или интерактивна дъска</b>
							<span>Отворете тази страница и натиснете „Цял екран“ в теста. Отговаря се с докосване, с клик или с цифрите 1–4.</span>
						</div>
					</li>
					<li>
						<svg class="ui" viewBox="0 0 24 24" aria-hidden="true"><path d="M13 9a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1zM18 8V5a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h9M16 9h2" /></svg>
						<div>
							<b>На телефона или компютъра на всеки ученик</b>
							<span>Изпратете им връзката – отваря се на всяко устройство, без регистрация и без инсталиране.</span>
							<button class="copy" onclick={copyLink}>{copied ? 'Връзката е копирана ✓' : 'Копирай връзката'}</button>
						</div>
					</li>
				</ul>
			{/if}
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
		<aside class="side local">
			<div class="box">
				<p class="h">Доказателство към · само локално</p>
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
	<section class="section related">
		<div class="wrap">
			<h2>Още ресурси</h2>
			<div class="rel">
				{#each related as x}<ResourceCard r={x} />{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	.related {
		border-top: 1px solid var(--line);
	}
	/* Само локално – оранжево, като останалите неща, които вижда само авторът */
	.side.local .box {
		border: 1px dashed #d8b98f;
		background: #fbf6ee;
	}
	.side.local .h {
		color: #7a5428;
	}
	.rh {
		padding: clamp(120px, 12vw, 140px) 0 36px;
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
		font-size: clamp(30px, 3.4vw, 44px);
		max-width: 28ch;
	}
	.use {
		list-style: none;
		margin: 26px 0 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
		max-width: 860px;
	}
	.use li {
		display: flex;
		gap: 14px;
		align-items: flex-start;
		padding: 16px 18px;
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		background: var(--card);
	}
	.ui {
		flex: none;
		width: 26px;
		height: 26px;
		margin-top: 2px;
		fill: none;
		stroke: var(--coral);
		stroke-width: 1.6;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.use b {
		display: block;
		font-size: 15px;
		font-weight: 600;
		color: var(--ink);
	}
	.use span {
		display: block;
		margin-top: 2px;
		font-size: 14px;
		line-height: 1.5;
		color: var(--ink-soft);
	}
	.copy {
		margin-top: 10px;
		padding: 6px 14px;
		border: 1px solid var(--sea);
		border-radius: 999px;
		background: transparent;
		font: 500 13.5px var(--sans);
		color: var(--sea);
		cursor: pointer;
		transition: background 0.2s, color 0.2s;
	}
	.copy:hover {
		background: var(--sea);
		color: #fff;
	}
	.use.three {
		grid-template-columns: repeat(3, minmax(0, 1fr));
		max-width: 1100px;
	}
	@media (max-width: 1000px) {
		.use.three {
			grid-template-columns: 1fr;
		}
	}
	@media (max-width: 700px) {
		.use {
			grid-template-columns: 1fr;
		}
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
		padding-block: 36px 96px;
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
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: 16px;
	}
	@media (max-width: 900px) {
		.body {
			grid-template-columns: 1fr;
			gap: 32px;
		}
	}
</style>
