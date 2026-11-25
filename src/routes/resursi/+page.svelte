<script>
	import { flip } from 'svelte/animate';
	import { fade, scale } from 'svelte/transition';
	import { resources, subjects, types } from '$lib/content.js';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import ResourceCard from '$lib/components/ResourceCard.svelte';

	let subject = $state('');
	let type = $state('');
	let grade = $state('');
	let q = $state('');

	const grades = [...new Set(resources.map((r) => r.grade).filter(Boolean))].sort((a, b) => a - b);
	const usedTypes = types.filter((t) => resources.some((r) => r.type === t));

	let list = $derived(
		resources.filter(
			(r) =>
				(!subject || r.subject === subject || (subject !== 'all' && r.subject === 'bel-fr' && ['bel', 'fr'].includes(subject))) &&
				(!type || r.type === type) &&
				(!grade || String(r.grade) === grade) &&
				(!q || `${r.title} ${r.summary}`.toLowerCase().includes(q.toLowerCase()))
		)
	);

	// Филтрите се пазят в адреса (#predmet=fr&vid=игра) – може да се споделят
	$effect(() => {
		const h = new URLSearchParams(location.hash.slice(1));
		subject = h.get('predmet') ?? '';
		type = h.get('vid') ?? '';
		grade = h.get('klas') ?? '';
	});
	$effect(() => {
		const h = new URLSearchParams();
		if (subject) h.set('predmet', subject);
		if (type) h.set('vid', type);
		if (grade) h.set('klas', grade);
		const s = h.toString();
		history.replaceState(history.state, '', s ? `#${s}` : location.pathname);
	});

	const clear = () => {
		subject = type = grade = q = '';
	};
	let active = $derived(!!(subject || type || grade || q));
</script>

<svelte:head>
	<title>Ресурси · Маргарита Маджарова</title>
	<meta name="description" content="Безплатни уроци, игри, упражнения и тестове по български език и литература и по френски език." />
</svelte:head>

<PageHeader
	eyebrow="Библиотека"
	title="Ресурси"
	lead="Уроци, игри, упражнения и тестове, които създавам и използвам в часовете. Свободни за всички колеги."
/>

<div class="filters-wrap">
	<div class="wrap filters" role="search" aria-label="Филтри">
		<div class="group" role="group" aria-label="Предмет">
			<button class:on={!subject} onclick={() => (subject = '')}>Всички</button>
			{#each Object.entries(subjects).filter(([k]) => k !== 'all') as [k, label]}
				<button class:on={subject === k} aria-pressed={subject === k} onclick={() => (subject = subject === k ? '' : k)}>{label}</button>
			{/each}
		</div>
		<div class="group selects">
			<label>
				<span class="visually-hidden">Вид</span>
				<select bind:value={type}>
					<option value="">Всеки вид</option>
					{#each usedTypes as t}<option value={t}>{t}</option>{/each}
				</select>
			</label>
			{#if grades.length}
				<label>
					<span class="visually-hidden">Клас</span>
					<select bind:value={grade}>
						<option value="">Всеки клас</option>
						{#each grades as g}<option value={String(g)}>{g} клас</option>{/each}
					</select>
				</label>
			{/if}
			<label class="q">
				<span class="visually-hidden">Търсене по заглавие</span>
				<input bind:value={q} placeholder="Търсене…" />
			</label>
		</div>
	</div>
</div>

<section class="section lib">
	<div class="wrap">
		<p class="count" aria-live="polite">
			{list.length}
			{list.length === 1 ? 'ресурс' : 'ресурса'}
			{#if active}<button class="clear" onclick={clear} transition:fade>Изчисти филтрите ×</button>{/if}
		</p>
		<ul class="grid">
			{#each list as r (r.slug)}
				<li animate:flip={{ duration: 500 }} in:scale={{ start: 0.96, duration: 400 }} out:fade={{ duration: 150 }}>
					<ResourceCard {r} />
				</li>
			{/each}
		</ul>
		{#if !list.length}
			<p class="empty" in:fade>Няма ресурси с тези филтри. <button class="clear" onclick={clear}>Покажи всички</button></p>
		{/if}
	</div>
</section>

<style>
	.filters-wrap {
		position: sticky;
		top: 0;
		z-index: 20;
		padding: 14px 0;
		background: rgb(250 248 245 / 0.82);
		backdrop-filter: blur(14px);
		-webkit-backdrop-filter: blur(14px);
		border-bottom: 1px solid var(--line);
	}
	.filters {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 12px;
	}
	.group {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.group button,
	select,
	input {
		min-height: 42px;
		padding: 8px 16px;
		border-radius: 999px;
		border: 1px solid var(--line);
		background: var(--card);
		font: 500 14.5px var(--sans);
		color: var(--ink);
		cursor: pointer;
		transition: background 0.25s, border-color 0.25s, color 0.25s;
	}
	.group button:hover,
	select:hover {
		border-color: var(--sea);
	}
	.group button.on {
		background: var(--sea);
		border-color: var(--sea);
		color: #fff;
	}
	select {
		appearance: none;
		padding-right: 34px;
		background: var(--card) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'%3E%3Cpath d='M2 3.5 5 6.5 8 3.5' fill='none' stroke='%232A6F97' stroke-width='1.2'/%3E%3C/svg%3E") no-repeat right 14px center;
	}
	input {
		cursor: text;
		width: 180px;
	}
	.lib {
		padding-top: 40px;
	}
	.count {
		display: flex;
		align-items: center;
		gap: 16px;
		font-size: 14px;
		color: var(--ink-soft);
	}
	.clear {
		border: 0;
		background: none;
		color: var(--coral);
		font: 500 14px var(--sans);
		cursor: pointer;
		padding: 6px 0;
	}
	.grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 24px;
	}
	.empty {
		padding: 60px 0;
		text-align: center;
		color: var(--ink-soft);
	}
	@media (max-width: 700px) {
		.filters-wrap {
			position: static;
		}
		.selects {
			width: 100%;
		}
		.q,
		input {
			flex: 1;
			width: auto;
		}
	}
</style>
