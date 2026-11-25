<script>
	import { reveal } from '$lib/actions/reveal.js';
	import TitleLine from './TitleLine.svelte';
	let { eyebrow = '', title, lead = '', children = undefined } = $props();
</script>

<header class="ph">
	<div class="wrap">
		{#if eyebrow}<p class="eyebrow" use:reveal>{eyebrow}</p>{/if}
		<h1 use:reveal={{ delay: 80 }}>{title}</h1>
		<TitleLine />
		{#if lead}<p class="lead" use:reveal={{ delay: 160 }}>{lead}</p>{/if}
		{#if children}<div class="extra" use:reveal={{ delay: 220 }}>{@render children()}</div>{/if}
	</div>
</header>

<style>
	.ph {
		padding: clamp(150px, 18vw, 200px) 0 clamp(48px, 6vw, 72px);
		border-bottom: 1px solid var(--line);
		background:
			radial-gradient(60% 80% at 90% 0%, rgb(228 238 244 / 0.7), transparent 70%),
			var(--bg);
	}
	h1 {
		margin-top: 18px;
		max-width: 18ch;
		font-size: var(--h1-page);
	}
	.extra {
		margin-top: 28px;
	}
</style>
