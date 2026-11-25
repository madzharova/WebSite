<script>
	import { base } from '$app/paths';
	import { practices } from '$lib/content.js';
	import { reveal } from '$lib/actions/reveal.js';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PracticeFlow from '$lib/components/PracticeFlow.svelte';
	const fill = (s) => /\[ПОЛЕ/.test(s ?? '');
</script>

<svelte:head><title>Практики · Маргарита Маджарова</title></svelte:head>

<PageHeader
	eyebrow="От класната стая"
	title="Практики"
	lead="Всяка практика е кратка история в три стъпки: какво забелязах, какво направих и какво се получи."
/>

<section class="section">
	<div class="wrap list">
		{#each practices as p, i}
			<a class="pr" href="{base}/praktiki/{p.slug}/" use:reveal={{ delay: (i % 3) * 80 }}>
				<div class="top">
					<span class="n">{String(i + 1).padStart(2, '0')}</span>
					<h2>{p.title}</h2>
					{#if p.example}<span class="chip ex">пример</span>{/if}
				</div>
				<PracticeFlow problem={p.problem} solution={p.solution} result={p.result} animate={false} />
			</a>
		{/each}
	</div>
</section>

<style>
	.list {
		display: flex;
		flex-direction: column;
		gap: 28px;
	}
	.pr {
		display: block;
		padding: 32px;
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		background: var(--card);
		text-decoration: none;
		color: var(--ink);
		transition: transform 0.5s var(--ease), box-shadow 0.5s var(--ease), border-color 0.3s;
	}
	.pr:hover {
		transform: translateY(-3px);
		box-shadow: var(--shadow-soft);
		border-color: var(--line-strong);
		color: var(--ink);
	}
	.top {
		display: flex;
		align-items: baseline;
		gap: 18px;
		margin-bottom: 28px;
	}
	.n {
		font-size: 13px;
		letter-spacing: 0.12em;
		color: var(--ink-soft);
	}
	h2 {
		font-size: clamp(28px, 3vw, 36px);
		flex: 1;
	}
	.ex {
		background: #fbf1e6;
		color: #8a5a2b;
		border-color: #ecd6bd;
	}
	@media (max-width: 640px) {
		.pr {
			padding: 22px 18px;
		}
	}
</style>
