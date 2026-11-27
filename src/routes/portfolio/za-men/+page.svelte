<script>
	import { base } from '$app/paths';
	import { pages } from '$lib/content.js';
	import { documents } from '$lib/data/documents.js';
	import PageHeader from '$lib/components/PageHeader.svelte';
	const p = pages['za-men'];
	const Body = p.component;
</script>

<svelte:head><title>За мен · Портфолио</title></svelte:head>

<PageHeader back={{ href: `${base}/portfolio/`, label: 'Портфолио' }} eyebrow="Общи данни" title={p.title} lead={p.lead} />

<section class="section">
	<div class="wrap cols">
		<div class="prose"><Body /></div>
		<aside class="box">
			<p class="h">Документи (ограничен достъп)</p>
			<ul>
				{#each documents as d}<li>{d.title}</li>{/each}
			</ul>
			<a href="{base}/portfolio/opis/">Пълен опис →</a>
		</aside>
	</div>
</section>

<style>
	.cols {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 320px;
		gap: 64px;
	}
	.box {
		align-self: start;
		position: sticky;
		top: 110px;
		padding: 24px;
		border-radius: var(--radius-lg);
		background: var(--paper);
	}
	.h {
		font-size: 11px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	ul {
		padding-left: 1.1em;
		font-size: 14.5px;
		line-height: 1.5;
	}
	li {
		margin-bottom: 8px;
	}
	@media (max-width: 860px) {
		.cols {
			grid-template-columns: 1fr;
		}
	}
</style>
