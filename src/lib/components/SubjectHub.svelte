<script>
	import TitleLine from './TitleLine.svelte';
	import DictSearch from './DictSearch.svelte';
	import { flip } from 'svelte/animate';
	import { fade, scale } from 'svelte/transition';
	import { resources } from '$lib/content.js';
	import { subjectPages, bridge } from '$lib/data/subjects.js';
	import { reveal } from '$lib/actions/reveal.js';
	import ResourceCard from './ResourceCard.svelte';

	let { key } = $props();
	const S = subjectPages[key];
	const other = Object.values(subjectPages).find((x) => x.key !== key);

	const own = resources.filter((r) => r.subject === key);
	const shared = resources.filter((r) => r.subject === 'bel-fr');
	const tools = resources.filter((r) => r.subject === 'all');

	const topicsOf = (r) => [].concat(r.topic ?? []);
	const levelOf = (r) => String(key === 'fr' ? (r.level ?? r.grade ?? '') : (r.grade ?? ''));

	const counts = Object.fromEntries(S.topics.map((t) => [t.id, own.filter((r) => topicsOf(r).includes(t.id)).length]));
	const usedLevels = S.levels.filter((l) => own.some((r) => levelOf(r) === l));

	let topic = $state('');
	let level = $state('');

	let list = $derived(own.filter((r) => (!topic || topicsOf(r).includes(topic)) && (!level || levelOf(r) === level)));

	// #tema=pravopis&nivo=11 – филтърът може да се сподели като връзка
	$effect(() => {
		const h = new URLSearchParams(location.hash.slice(1));
		topic = h.get('tema') ?? '';
		level = h.get('nivo') ?? '';
	});
	$effect(() => {
		const h = new URLSearchParams();
		if (topic) h.set('tema', topic);
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

		<nav class="topics" aria-label="Раздели" use:reveal={{ delay: 180 }}>
			<button class:on={!topic} onclick={() => (topic = '')}>
				Всички <span class="c">{own.length}</span>
			</button>
			{#each S.topics as t}
				<button class:on={topic === t.id} aria-pressed={topic === t.id} onclick={() => (topic = topic === t.id ? '' : t.id)} lang={S.lang}>
					{t.label} <span class="c">{counts[t.id]}</span>
				</button>
			{/each}
		</nav>
	</div>
</header>

<section class="section lib" style="--accent: {S.accent}">
	<div class="wrap">
		<div class="bar">
			<p class="count" aria-live="polite">
				{list.length}
				{list.length === 1 ? 'ресурс' : 'ресурса'}
				{#if topic}· {S.topics.find((t) => t.id === topic)?.label}{/if}
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
				{#if topic || level}<button onclick={() => (topic = level = '')}>Покажи всички</button>{/if}
			</div>
		{/if}
	</div>
</section>

{#if shared.length}
	<section class="section bridge" id="most">
		<div class="wrap">
			<div class="bh">
				<div>
					<p class="eyebrow" use:reveal>Мост</p>
					<h2 use:reveal={{ delay: 60 }}>{bridge.name}</h2>
					<p class="muted" use:reveal={{ delay: 100 }}>{bridge.full}. {bridge.text}</p>
				</div>
				<svg class="arc" viewBox="0 0 220 60" aria-hidden="true">
					<path d="M10 50 Q110 -10 210 50" fill="none" stroke="var(--sea)" stroke-width="1" />
					<circle cx="10" cy="50" r="4" fill="var(--sea)" />
					<circle cx="210" cy="50" r="4" fill="var(--coral)" />
				</svg>
			</div>
			<div class="row">
				{#each shared as r, i}<div use:reveal={{ delay: i * 80 }}><ResourceCard {r} /></div>{/each}
			</div>
		</div>
	</section>
{/if}

{#if tools.length}
	<section class="section tools">
		<div class="wrap">
			<p class="eyebrow">За учители</p>
			<h2>Инструменти</h2>
			<div class="row">
				{#each tools as r}<ResourceCard {r} />{/each}
			</div>
		</div>
	</section>
{/if}

<a class="switch" href={other.href} style="--accent: {other.accent}">
	<div class="wrap">
		<span class="sl">Другият предмет</span>
		<span class="sn" lang={other.lang}>{other.name} <span class="ar">→</span></span>
		<span class="sm" aria-hidden="true">{other.mark}</span>
	</div>
</a>

<style>
	.hub {
		position: relative;
		overflow: hidden;
		padding: clamp(150px, 18vw, 200px) 0 48px;
		border-bottom: 1px solid var(--line);
		background:
			radial-gradient(60% 90% at 100% 0%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 70%),
			var(--bg);
	}
	.mark {
		position: absolute;
		right: -2vw;
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
		font-size: var(--h1-page);
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
	.arc {
		width: 220px;
	}
	.arc path {
		stroke-dasharray: 260;
		stroke-dashoffset: 260;
		animation: draw 2.4s 0.4s var(--ease) forwards;
	}
	.tools h2 {
		margin: 10px 0 32px;
	}
	.switch {
		display: block;
		position: relative;
		overflow: hidden;
		padding: 72px 0;
		border-top: 1px solid var(--line);
		text-decoration: none;
		color: var(--ink);
		transition: background 0.5s var(--ease);
	}
	.switch:hover {
		background: color-mix(in srgb, var(--accent) 7%, transparent);
	}
	.switch .wrap {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.sl {
		font-size: 12px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	.sn {
		font-family: var(--serif);
		font-size: clamp(44px, 7vw, 84px);
		line-height: 1;
		color: var(--accent);
	}
	.ar {
		display: inline-block;
		transition: transform 0.5s var(--ease);
	}
	.switch:hover .ar {
		transform: translateX(14px);
	}
	.sm {
		position: absolute;
		right: 4vw;
		top: 50%;
		translate: 0 -50%;
		font-family: var(--serif);
		font-size: 200px;
		line-height: 1;
		color: transparent;
		-webkit-text-stroke: 1px color-mix(in srgb, var(--accent) 30%, transparent);
		transition: transform 0.8s var(--ease);
	}
	.switch:hover .sm {
		transform: translateX(-20px) rotate(-4deg);
	}
	@keyframes drift {
		to {
			transform: translate(-24px, 12px) rotate(-2deg);
		}
	}
	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}
	@media (max-width: 700px) {
		.sm {
			display: none;
		}
		.mark {
			top: 90px;
			opacity: 0.6;
		}
	}
</style>
