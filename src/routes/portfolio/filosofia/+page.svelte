<script>
	import { base } from '$app/paths';
	import { pages } from '$lib/content.js';
	import PageHeader from '$lib/components/PageHeader.svelte';
	const p = pages['filosofia'];
	const Body = p.component;
</script>

<svelte:head><title>Философия · Портфолио</title></svelte:head>
<PageHeader back={{ href: `${base}/portfolio/`, label: 'Портфолио' }} title={p.title} lead={p.lead} />
<section class="section"><div class="wrap"><div class="prose big"><Body /></div></div></section>

<style>
	.big {
		font-size: 19px;
	}
</style>
