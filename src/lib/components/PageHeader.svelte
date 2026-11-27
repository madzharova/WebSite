<script>
	import { reveal } from '$lib/actions/reveal.js';
	import TitleLine from './TitleLine.svelte';
	// back – по желание: { href, label } – видима връзка за връщане най-горе (напр. към Портфолио)
	let { eyebrow = '', title, lead = '', back = null, children = undefined } = $props();
</script>

<header class="ph">
	<div class="wrap">
		{#if back}<a class="back" href={back.href}><span aria-hidden="true">←</span> {back.label}</a>{/if}
		{#if eyebrow}<p class="eyebrow" use:reveal>{eyebrow}</p>{/if}
		<h1 use:reveal={{ delay: 80 }}>{title}</h1>
		<TitleLine />
		{#if lead}<p class="lead" use:reveal={{ delay: 160 }}>{lead}</p>{/if}
		{#if children}<div class="extra" use:reveal={{ delay: 220 }}>{@render children()}</div>{/if}
	</div>
</header>

<style>
	.back {
		display: flex;
		width: fit-content;
		align-items: center;
		gap: 8px;
		margin-bottom: 22px;
		padding: 7px 16px 7px 12px;
		border: 1px solid var(--line);
		border-radius: 999px;
		background: var(--card);
		font-size: 14px;
		font-weight: 500;
		color: var(--sea);
		text-decoration: none;
		transition: border-color 0.3s;
	}
	.back:hover {
		border-color: var(--sea);
	}
	.back span {
		transition: transform 0.3s var(--ease);
	}
	.back:hover span {
		transform: translateX(-3px);
	}
	.ph {
		padding: clamp(130px, 14vw, 170px) 0 clamp(36px, 4vw, 52px);
		border-bottom: 1px solid var(--line);
		background:
			radial-gradient(60% 80% at 90% 0%, rgb(228 238 244 / 0.7), transparent 70%),
			var(--bg);
	}
	h1 {
		margin-top: 18px;
		max-width: 22ch;
		font-size: clamp(36px, 4.6vw, 60px);
		text-wrap: balance;
	}
	@media (max-width: 380px) {
		h1 {
			font-size: 30px;
		}
	}
	.extra {
		margin-top: 28px;
	}
</style>
