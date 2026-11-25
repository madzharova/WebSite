<script>
	import { base } from '$app/paths';
	import { sections } from '$lib/data/criteria.js';
	import PageHeader from '$lib/components/PageHeader.svelte';
	import CriteriaMap from '$lib/components/CriteriaMap.svelte';

	let { data } = $props();
	let s = $derived(sections.find((x) => x.id === data.id));
	let idx = $derived(sections.indexOf(s));
	let prev = $derived(sections[idx - 1]);
	let next = $derived(sections[idx + 1]);
</script>

<svelte:head><title>{s.roman}. {s.title} · Портфолио</title></svelte:head>

<PageHeader eyebrow="Раздел {s.roman} · до {s.max} точки" title={s.title} lead={s.subtitle} />

<section class="section">
	<div class="wrap">
		{#key s.id}<CriteriaMap only={s.id} />{/key}

		<nav class="pager" aria-label="Други раздели">
			{#if prev}<a href="{base}/portfolio/{prev.slug}/">← {prev.roman}. {prev.title}</a>{:else}<a href="{base}/portfolio/">← Портфолио</a>{/if}
			{#if next}<a href="{base}/portfolio/{next.slug}/" class="r">{next.roman}. {next.title} →</a>{/if}
		</nav>
	</div>
</section>

<style>
	.pager {
		display: flex;
		justify-content: space-between;
		gap: 20px;
		margin-top: 72px;
		padding-top: 24px;
		border-top: 1px solid var(--line);
	}
	.pager a {
		text-decoration: none;
		font-weight: 500;
	}
	.r {
		text-align: right;
		margin-left: auto;
	}
</style>
