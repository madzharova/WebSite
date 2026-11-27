<script>
	import TitleLine from './TitleLine.svelte';
	import DictSearch from './DictSearch.svelte';
	import { flip } from 'svelte/animate';
	import { fade, scale } from 'svelte/transition';
	import { resources } from '$lib/content.js';
	import { subjectPages, bridge, kinds, topicLabel, examLabel } from '$lib/data/subjects.js';
	import { reveal } from '$lib/actions/reveal.js';
	import ResourceCard from './ResourceCard.svelte';

	let { key } = $props();
	const S = subjectPages[key];

	const own = resources.filter((r) => r.subject === key);
	const shared = resources.filter((r) => r.subject === 'bel-fr');
	const tools = resources.filter((r) => r.subject === 'all');

	const topicsOf = (r) => [].concat(r.topic ?? []);
	const levelOf = (r) => String(key === 'fr' ? (r.level ?? r.grade ?? '') : (r.grade ?? ''));

	const kindOf = (r) => kinds.find((k) => k.types.includes(r.type))?.id ?? '';

	// Показват се само видовете, темите и класовете, в които има поне един материал
	const usedKinds = kinds
		.map((k) => ({ ...k, n: own.filter((r) => kindOf(r) === k.id).length }))
		.filter((k) => k.n);
	const examsOf = (r) => [].concat(r.izpit ?? []);
	// Тема с подтеми („Български език“) съдържа и материалите с някоя от подтемите си
	const idsOf = (id) => {
		const t = S.topics.find((x) => x.id === id);
		return t?.sub ? [t.id, ...t.sub.map((x) => x.id)] : [id];
	};
	const hasTopic = (r, id) => idsOf(id).some((x) => topicsOf(r).includes(x));
	const parentOf = (id) => S.topics.find((t) => t.id === id || t.sub?.some((x) => x.id === id));
	const usedTopics = S.topics
		.map((t) => ({
			...t,
			n: own.filter((r) => hasTopic(r, t.id)).length,
			// подтемите се виждат винаги – празните са бледи, за да личи цялата структура
			sub: (t.sub ?? []).map((x) => ({ ...x, n: own.filter((r) => topicsOf(r).includes(x.id)).length }))
		}))
		.filter((t) => t.n);
	const usedExams = (S.exams ?? []).filter((e) => own.some((r) => examsOf(r).includes(e.id)));
	const usedLevels = S.levels.filter((l) => own.some((r) => levelOf(r) === l));

	let kind = $state('');
	let topic = $state('');
	let exam = $state('');
	let openTopic = $derived(usedTopics.find((t) => t.id === parentOf(topic)?.id));
	let level = $state('');

	let list = $derived(
		own.filter(
			(r) =>
				(!kind || kindOf(r) === kind) &&
				(!topic || hasTopic(r, topic)) &&
				(!exam || examsOf(r).includes(exam)) &&
				(!level || levelOf(r) === level)
		)
	);

	// #vid=igri&tema=pravopis&nivo=11 – филтърът може да се сподели като връзка
	$effect(() => {
		const h = new URLSearchParams(location.hash.slice(1));
		kind = h.get('vid') ?? '';
		topic = h.get('tema') ?? '';
		exam = h.get('izpit') ?? '';
		level = h.get('nivo') ?? '';
	});
	$effect(() => {
		const h = new URLSearchParams();
		if (kind) h.set('vid', kind);
		if (topic) h.set('tema', topic);
		if (exam) h.set('izpit', exam);
		if (level) h.set('nivo', level);
		const s = h.toString();
		history.replaceState(history.state, '', s ? `#${s}` : location.pathname);
	});
</script>

<header class="hub" style="--accent: {S.accent}" lang={S.lang === 'fr' ? 'bg' : undefined}>
	<span class="mark" aria-hidden="true">{S.mark}</span>
	<div class="wrap">
		<p class="eyebrow" use:reveal>Ресурси · {S.full}</p>
		<h1 use:reveal={{ delay: 60 }} lang={S.lang}>{S.name}</h1>
		<TitleLine color="var(--accent)" />
		<p class="lead" use:reveal={{ delay: 120 }}>{S.tagline}</p>
		{#if S.dict}
			<DictSearch name={S.dict.name} url={S.dict.url} placeholder={S.dict.placeholder} lang={S.lang} />
		{/if}

		{#if usedKinds.length}
			<nav class="topics" aria-label="Вид материал" use:reveal={{ delay: 180 }}>
				<button class:on={!kind} onclick={() => (kind = '')}>
					Всички <span class="c">{own.length}</span>
				</button>
				{#each usedKinds as k}
					<button class:on={kind === k.id} aria-pressed={kind === k.id} onclick={() => (kind = kind === k.id ? '' : k.id)}>
						{k.label} <span class="c">{k.n}</span>
					</button>
				{/each}
			</nav>
		{/if}
		{#if usedTopics.length || usedExams.length}
			<nav class="tags" aria-label="Тема" use:reveal={{ delay: 220 }}>
				{#if usedTopics.length}<span class="tl">Тема</span>{/if}
				{#each usedTopics as t}
					<button class:on={openTopic?.id === t.id} aria-pressed={topic === t.id} onclick={() => (topic = topic === t.id ? '' : t.id)} lang={S.lang}>
						{t.label}
					</button>
				{/each}
				{#if usedExams.length}
					<span class="tl sep">Изпит</span>
					{#each usedExams as e}
						<button class:on={exam === e.id} aria-pressed={exam === e.id} onclick={() => (exam = exam === e.id ? '' : e.id)}>{e.label}</button>
					{/each}
				{/if}
			</nav>
			{#if openTopic?.sub.length}
				<nav class="tags subtags" aria-label={openTopic.label}>
					{#each openTopic.sub as st}
						<button
							class:on={topic === st.id}
							class:empty={!st.n}
							disabled={!st.n}
							title={st.n ? undefined : 'Предстои'}
							aria-pressed={topic === st.id}
							onclick={() => (topic = topic === st.id ? openTopic.id : st.id)}
						>
							{st.label}
						</button>
					{/each}
				</nav>
			{/if}
		{/if}
	</div>
</header>

<section class="section lib" style="--accent: {S.accent}">
	<div class="wrap">
		<div class="bar">
			<p class="count" aria-live="polite">
				{list.length}
				{list.length === 1 ? 'ресурс' : 'ресурса'}
				{#if kind}· {kinds.find((k) => k.id === kind)?.label}{/if}
				{#if topic}· {topicLabel(topic)}{/if}
				{#if exam}· {examLabel(exam)}{/if}
			</p>
			{#if usedLevels.length}
				<div class="levels" role="group" aria-label={key === 'fr' ? 'Ниво' : 'Клас'}>
					<button class:on={!level} onclick={() => (level = '')}>{key === 'fr' ? 'Всички нива' : 'Всички класове'}</button>
					{#each usedLevels as l}
						<button class:on={level === l} aria-pressed={level === l} onclick={() => (level = level === l ? '' : l)}>{S.levelLabel(l)}</button>
					{/each}
				</div>
			{/if}
		</div>

		{#if list.length}
			<ul class="grid">
				{#each list as r (r.slug)}
					<li animate:flip={{ duration: 500 }} in:scale={{ start: 0.96, duration: 400 }} out:fade={{ duration: 150 }}>
						<ResourceCard {r} />
					</li>
				{/each}
			</ul>
		{:else}
			<div class="empty" in:fade>
				<p>Ресурсите в този раздел предстоят.</p>
				{#if kind || topic || exam || level}<button onclick={() => (kind = topic = exam = level = '')}>Покажи всички</button>{/if}
			</div>
		{/if}
	</div>
</section>

{#if shared.length}
	<section class="section bridge" id="binarni">
		<div class="wrap">
			<div class="bh">
				<div>
					<p class="eyebrow" use:reveal>С колеги от други предмети</p>
					<h2 use:reveal={{ delay: 60 }}>{bridge.name}</h2>
				</div>
			</div>
			<div class="row">
				{#each shared as r, i}<div use:reveal={{ delay: i * 80 }}><ResourceCard {r} /></div>{/each}
			</div>
		</div>
	</section>
{/if}

<!-- Разделът се показва, когато инструментите са поне два – един сам стои като недовършен раздел -->
{#if tools.length >= 2}
	<section class="section tools">
		<div class="wrap">
			<p class="eyebrow">За всички предмети</p>
			<h2>Инструменти</h2>
			<div class="row">
				{#each tools as r}<ResourceCard {r} />{/each}
			</div>
		</div>
	</section>
{/if}


<style>
	.hub {
		position: relative;
		overflow: hidden;
		padding: clamp(130px, 14vw, 170px) 0 48px; /* като PageHeader на вътрешните страници */
		border-bottom: 1px solid var(--line);
		background:
			radial-gradient(60% 90% at 100% 0%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 70%),
			var(--bg);
	}
	.mark {
		position: absolute;
		right: -2vw; /* нарочно излиза леко отвъд десния край */
		top: 40px;
		font-family: var(--serif);
		font-size: clamp(220px, 34vw, 460px);
		line-height: 1;
		color: transparent;
		-webkit-text-stroke: 1px color-mix(in srgb, var(--accent) 35%, transparent);
		pointer-events: none;
		user-select: none;
		animation: drift 14s ease-in-out infinite alternate;
	}
	h1 {
		margin-top: 18px;
		font-size: clamp(36px, 4.6vw, 60px); /* като заглавията на вътрешните страници */
		color: var(--accent);
	}
	.lead {
		margin-top: 0;
	}
	.topics {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 36px;
	}
	/* Темите – втори, по-дребен ред */
	.tags {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px;
		margin-top: 14px;
	}
	.tl {
		margin-right: 6px;
		font-size: 11px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	.tl.sep {
		margin-left: 14px;
	}
	/* Подтемите („Правописна норма“…) – отместени под избраната тема */
	.subtags {
		margin-top: 8px;
		margin-left: 50px; /* под първата тема, след надписа „Тема“ */
		padding-left: 12px;
		border-left: 1px solid var(--line);
	}
	@media (max-width: 560px) {
		.subtags {
			margin-left: 0;
		}
	}
	.tags button {
		padding: 5px 13px;
		border-radius: 999px;
		border: 1px solid var(--line);
		background: transparent;
		font: 500 13.5px var(--sans);
		color: var(--ink-soft);
		cursor: pointer;
		transition: border-color 0.2s, color 0.2s, background 0.2s;
	}
	.tags button:hover {
		border-color: var(--accent);
		color: var(--ink);
	}
	.tags button.empty {
		opacity: 0.45;
		cursor: default;
		border-style: dashed;
	}
	.tags button.empty:hover {
		border-color: var(--line);
		color: var(--ink-soft);
	}
	.tags button.on {
		border-color: var(--accent);
		background: color-mix(in srgb, var(--accent) 10%, transparent);
		color: var(--accent);
	}
	.topics button,
	.levels button {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		min-height: 44px;
		padding: 8px 18px;
		border-radius: 999px;
		border: 1px solid var(--line);
		background: rgb(255 255 255 / 0.7);
		backdrop-filter: blur(6px);
		font: 500 15px var(--sans);
		color: var(--ink);
		cursor: pointer;
		transition: background 0.25s, border-color 0.25s, color 0.25s;
	}
	.topics button:hover,
	.levels button:hover {
		border-color: var(--accent);
	}
	.topics button.on,
	.levels button.on {
		background: var(--accent);
		border-color: var(--accent);
		color: #fff;
	}
	.c {
		font-size: 12px;
		opacity: 0.7;
	}
	.lib {
		padding-top: 40px;
	}
	.bar {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 16px;
		margin-bottom: 24px;
	}
	.count {
		margin: 0;
		font-size: 14px;
		color: var(--ink-soft);
	}
	.levels {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.levels button {
		min-height: 38px;
		padding: 6px 14px;
		font-size: 13.5px;
	}
	.grid,
	.row {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 24px;
	}
	.empty {
		padding: 56px 24px;
		text-align: center;
		border: 1px dashed var(--line-strong);
		border-radius: var(--radius-lg);
		color: var(--ink-soft);
	}
	.empty button {
		border: 0;
		background: none;
		color: var(--accent);
		font: 500 15px var(--sans);
		cursor: pointer;
	}
	.bridge {
		background: linear-gradient(90deg, rgb(228 238 244 / 0.6), rgb(240 236 225 / 0.8) 50%, rgb(169 90 97 / 0.08));
		border-block: 1px solid var(--line);
	}
	.bh {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: flex-end;
		gap: 24px;
		margin-bottom: 36px;
	}
	.bh h2 {
		margin: 10px 0 8px;
	}
	.bh p {
		max-width: 56ch;
	}
	.tools h2 {
		margin: 10px 0 32px;
	}
	@keyframes drift {
		to {
			transform: translate(-24px, 12px) rotate(-2deg);
		}
	}
	@media (max-width: 700px) {
		.mark {
			top: 90px;
			opacity: 0.6;
		}
	}
</style>
