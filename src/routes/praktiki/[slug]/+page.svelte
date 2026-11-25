<script>
	import { base } from '$app/paths';
	import { practices, resources, criterionHref } from '$lib/content.js';
	import { byId } from '$lib/data/criteria.js';
	import { reveal } from '$lib/actions/reveal.js';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import PracticeFlow from '$lib/components/PracticeFlow.svelte';

	let { data } = $props();
	let p = $derived(practices.find((x) => x.slug === data.slug));
	let res = $derived(p.resource ? resources.find((r) => r.slug === p.resource) : null);
</script>

<svelte:head><title>{p.title} · Практики</title></svelte:head>

<PageHeader eyebrow="Практика" title={p.title} />

<section class="section">
	<div class="wrap">
		<div class="flowwrap"><PracticeFlow problem={p.problem} solution={p.solution} result={p.result} large /></div>

		<div class="cols">
			<div class="prose"><p.component /></div>
			<aside>
				{#if res}
					<p class="h">Свързан ресурс</p>
					<a href="{base}/resursi/{res.slug}/" class="res">{res.title} →</a>
				{/if}
				<p class="h">Доказателство към</p>
				{#each p.criteria as id}
					{@const c = byId[id]}
					{#if c}<a class="crit" href={criterionHref(c)}><b>{c.section}.{c.num}</b> {c.short}</a>{/if}
				{/each}
			</aside>
		</div>
	</div>
</section>

<style>
	.flowwrap {
		margin-bottom: 64px;
	}
	.cols {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 300px;
		gap: 64px;
	}
	.h {
		margin: 0 0 10px;
		font-size: 11px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	.res {
		display: block;
		margin-bottom: 24px;
		font-weight: 500;
	}
	.crit {
		display: block;
		padding: 8px 0;
		border-bottom: 1px solid var(--line);
		font-size: 14.5px;
		text-decoration: none;
	}
	.crit b {
		font-family: var(--serif);
		font-size: 17px;
		margin-right: 6px;
	}
	@media (max-width: 860px) {
		.cols {
			grid-template-columns: 1fr;
		}
	}
</style>
