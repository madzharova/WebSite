<script>
	import TitleLine from './TitleLine.svelte';
	import DictSearch from './DictSearch.svelte';
	import { flip } from 'svelte/animate';
	import { fade, scale } from 'svelte/transition';
	import { resources, gradesOf } from '$lib/content.js';
	import { subjectPages, bridge, kinds, topicLabel, examLabel } from '$lib/data/subjects.js';
	import { reveal } from '$lib/actions/reveal.js';
	import ResourceCard from './ResourceCard.svelte';

	let { key } = $props();
	const S = subjectPages[key];

	const own = resources.filter((r) => r.subject === key);
	const shared = resources.filter((r) => r.subject === 'bel-fr');
	const tools = resources.filter((r) => r.subject === 'all');

	const topicsOf = (r) => [].concat(r.topic ?? []);
	// Клас/ниво може да е едно („11“) или няколко ([10, 11, 12])
	const levelsOf = (r) => (key === 'fr' && r.level ? [].concat(r.level).map(String) : gradesOf(r));

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
	const usedLevels = S.levels.filter((l) => own.some((r) => levelsOf(r).includes(l)));

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
				(!level || levelsOf(r).includes(level))
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
	<div class="wrap">
		<div class="head">
			<div>
				<p class="eyebrow" use:reveal>Ресурси</p>
				<h1 use:reveal={{ delay: 60 }} lang={S.lang}>{S.name}</h1>
				<TitleLine color="var(--accent)" />
				<p class="lead" use:reveal={{ delay: 120 }}>{S.tagline}</p>
			</div>
			<!-- Речникът е отделен инструмент – стои вдясно, встрани от филтрите -->
			{#if S.dict}
				<aside class="dictbox" use:reveal={{ delay: 160 }}>
					<DictSearch name={S.dict.name} url={S.dict.url} placeholder={S.dict.placeholder} lang={S.lang} />
				</aside>
			{/if}
		</div>

		<!-- Филтри: всеки ред е един въпрос (Вид, Тема, Изпит, Клас) с „Всички“ в началото -->
		{#if own.length}
			<div class="filters" use:reveal={{ delay: 200 }}>
				{#if usedKinds.length > 1}
					<div class="frow" role="group" aria-label="Вид">
						<span class="fl">Вид</span>
						<div class="chips">
							<button class:on={!kind} onclick={() => (kind = '')}>Всички</button>
							{#each usedKinds as k}
								<button class:on={kind === k.id} aria-pressed={kind === k.id} onclick={() => (kind = kind === k.id ? '' : k.id)}>{k.label}</button>
							{/each}
						</div>
					</div>
				{/if}
				{#if usedTopics.length}
					<div class="frow" role="group" aria-label="Тема">
						<span class="fl">Тема</span>
						<div class="chips">
							<button class:on={!topic} onclick={() => (topic = '')}>Всички</button>
							{#each usedTopics as t}
								<button class:on={openTopic?.id === t.id} aria-pressed={topic === t.id} onclick={() => (topic = topic === t.id ? '' : t.id)} lang={S.lang}>{t.label}</button>
							{/each}
						</div>
					</div>
					{#if openTopic?.sub.length}
						<div class="frow sub" role="group" aria-label={openTopic.label}>
							<span class="fl" aria-hidden="true"></span>
							<div class="chips">
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
							</div>
						</div>
					{/if}
				{/if}
				{#if usedExams.length}
					<div class="frow" role="group" aria-label="Изпит">
						<span class="fl">Изпит</span>
						<div class="chips">
							<button class:on={!exam} onclick={() => (exam = '')}>Всички</button>
							{#each usedExams as e}
								<button class:on={exam === e.id} aria-pressed={exam === e.id} onclick={() => (exam = exam === e.id ? '' : e.id)}>{e.label}</button>
							{/each}
						</div>
					</div>
				{/if}
				{#if usedLevels.length}
					<div class="frow" role="group" aria-label={key === 'fr' ? 'Ниво' : 'Клас'}>
						<span class="fl">{key === 'fr' ? 'Ниво' : 'Клас'}</span>
						<div class="chips">
							<button class:on={!level} onclick={() => (level = '')}>Всички</button>
							{#each usedLevels as l}
								<button class:on={level === l} aria-pressed={level === l} onclick={() => (level = level === l ? '' : l)}>{S.levelLabel(l)}</button>
							{/each}
						</div>
					</div>
				{/if}
			</div>
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
				{#if level}· {S.levelLabel(level)}{/if}
			</p>
			{#if kind || topic || exam || level}
				<button class="clear" onclick={() => (kind = topic = exam = level = '')}>Изчисти филтрите ×</button>
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
	/* Заглавие вляво, речникът вдясно */
	.head {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(280px, 400px);
		gap: 32px 64px;
		align-items: end;
	}
	.dictbox :global(.dict) {
		max-width: none;
		margin-top: 0;
	}
	@media (max-width: 900px) {
		.head {
			grid-template-columns: 1fr;
		}
	}
	/* Филтри – редове с надпис вляво */
	.filters {
		display: grid;
		gap: 10px;
		margin-top: 40px;
		padding-top: 28px;
		border-top: 1px solid var(--line);
	}
	.frow {
		display: grid;
		grid-template-columns: 72px minmax(0, 1fr);
		align-items: center;
		gap: 12px;
	}
	.fl {
		font-size: 12px;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.chips button {
		min-height: 38px;
		padding: 6px 16px;
		border-radius: 999px;
		border: 1px solid var(--line);
		background: var(--card);
		font: 500 14.5px var(--sans);
		color: var(--ink);
		cursor: pointer;
		transition: background 0.2s, border-color 0.2s, color 0.2s;
	}
	.chips button:hover {
		border-color: var(--accent);
	}
	.chips button.on {
		background: var(--accent);
		border-color: var(--accent);
		color: #fff;
	}
	/* Подтемите – по-дребни, под „Български език“, с линия вляво */
	.frow.sub {
		margin-top: -2px;
	}
	.frow.sub .chips {
		padding-left: 12px;
		border-left: 2px solid color-mix(in srgb, var(--accent) 35%, transparent);
	}
	.frow.sub .chips button {
		min-height: 32px;
		padding: 4px 13px;
		font-size: 13.5px;
		background: transparent;
	}
	.frow.sub .chips button.on {
		background: color-mix(in srgb, var(--accent) 12%, transparent);
		color: var(--accent);
	}
	.chips button.empty {
		opacity: 0.45;
		border-style: dashed;
		cursor: default;
	}
	.chips button.empty:hover {
		border-color: var(--line);
	}
	@media (max-width: 560px) {
		.frow {
			grid-template-columns: 1fr;
			gap: 6px;
		}
		.frow.sub .fl {
			display: none;
		}
	}
	.clear {
		border: 0;
		background: none;
		font: 500 14px var(--sans);
		color: var(--accent);
		cursor: pointer;
	}
	.hub {
		position: relative;
		overflow: hidden;
		padding: clamp(130px, 14vw, 170px) 0 48px; /* като PageHeader на вътрешните страници */
		border-bottom: 1px solid var(--line);
		background:
			radial-gradient(60% 90% at 100% 0%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 70%),
			var(--bg);
	}
	h1 {
		margin-top: 18px;
		font-size: clamp(36px, 4.6vw, 60px); /* като заглавията на вътрешните страници */
		color: var(--accent);
	}
	.lead {
		margin-top: 0;
	}
	/* Темите – втори, по-дребен ред */
	/* Подтемите („Правописна норма“…) – отместени под избраната тема */
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
</style>
