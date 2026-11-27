<script>
	import { base } from '$app/paths';
	import { testimonials } from '$lib/content.js';
	import { reveal } from '$lib/actions/reveal.js';
	import PageHeader from '$lib/components/PageHeader.svelte';
	let openImg = $state(null);
</script>

<svelte:head><title>Отзиви · Портфолио</title></svelte:head>
<PageHeader back={{ href: `${base}/portfolio/`, label: 'Портфолио' }}
	eyebrow="Комуникативна функция"
	title="Отзиви"
	lead="Свидетелства на родители и ученици (Наредба № 15, чл. 84, ал. 1, т. 2). Имената са скрити."
/>

<section class="section">
	<div class="wrap grid">
		{#each [...testimonials].sort((a, b) => (a.order ?? 99) - (b.order ?? 99)) as t, i}
			{@const Body = t.component}
			<figure class="t" use:reveal={{ delay: (i % 3) * 80 }}>
				<span class="q" aria-hidden="true">“</span>
				<blockquote><Body /></blockquote>
				<figcaption>
					<span>{t.author}</span>
					<span class="muted" class:fill={t.context?.includes('[')}>{t.context}</span>
					{#if t.image}<button class="orig" onclick={() => (openImg = t.image)}>Виж оригинала</button>{/if}
				</figcaption>
			</figure>
		{/each}
	</div>
</section>

{#if openImg}
	<div class="lightbox" role="dialog" aria-modal="true" aria-label="Оригинален отзив" onclick={() => (openImg = null)} onkeydown={(e) => e.key === 'Escape' && (openImg = null)} tabindex="-1">
		<img src={openImg} alt="Скрийншот на оригиналния отзив" />
		<button aria-label="Затвори">×</button>
	</div>
{/if}

<style>
	.grid {
		columns: 3 300px;
		column-gap: 24px;
	}
	.t {
		break-inside: avoid;
		position: relative;
		margin: 0 0 24px;
		padding: 36px 28px 24px;
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		background: var(--card);
	}
	.q {
		position: absolute;
		top: 4px;
		left: 22px;
		font-family: var(--serif);
		font-size: 72px;
		line-height: 1;
		color: var(--sea);
		opacity: 0.25;
	}
	blockquote {
		margin: 0;
		font-family: var(--serif);
		font-size: 21px;
		line-height: 1.45;
	}
	blockquote :global(p) {
		width: fit-content;
	}
	figcaption {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding-top: 14px;
		border-top: 1px solid var(--line);
		font-size: 14px;
	}
	figcaption span {
		width: fit-content;
	}
	.orig {
		align-self: flex-start;
		margin-top: 8px;
		border: 0;
		background: none;
		padding: 4px 0;
		color: var(--sea);
		font: 500 14px var(--sans);
		cursor: pointer;
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}
	.lightbox {
		position: fixed;
		inset: 0;
		z-index: 95;
		display: grid;
		place-items: center;
		padding: 40px;
		background: rgb(43 45 66 / 0.5);
		backdrop-filter: blur(8px);
	}
	.lightbox img {
		max-height: 85vh;
		border-radius: var(--radius);
		box-shadow: var(--shadow-float);
	}
	.lightbox button {
		position: absolute;
		top: 20px;
		right: 20px;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		border: 0;
		background: var(--bg);
		font-size: 24px;
		cursor: pointer;
	}
</style>
