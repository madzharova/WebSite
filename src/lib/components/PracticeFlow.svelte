<script>
	// Трите стъпки на една практика: Проблем → Решение → Резултат.
	import { reveal } from '$lib/actions/reveal.js';
	import arrow from '$lib/icons/arrow-right.svg?raw';

	let { problem, solution, result, large = false, animate = true } = $props();
	const fill = (s) => /\[ПОЛЕ/.test(s ?? '');
	let steps = $derived([
		{ k: 'Проблем', hint: 'Какво забелязах', v: problem },
		{ k: 'Решение', hint: 'Какво направих', v: solution },
		{ k: 'Резултат', hint: 'Какво се получи', v: result }
	]);
</script>

<ol class="flow" class:large>
	{#each steps as s, i}
		<li class="s{i + 1}" use:reveal={{ delay: animate ? i * 140 : 0 }}>
			<div class="head">
				<span class="n" aria-hidden="true">{i + 1}</span>
				<span class="k">{s.k}</span>
				<span class="hint">{s.hint}</span>
			</div>
			<p class:fill={fill(s.v)}>{s.v}</p>
			{#if i < 2}<span class="arr" aria-hidden="true">{@html arrow}</span>{/if}
		</li>
	{/each}
</ol>

<style>
	.flow {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 28px;
	}
	li {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 22px 22px 24px;
		border-radius: 16px;
		border: 1px solid;
	}
	/* Тонът се засилва от проблема към резултата */
	.s1 {
		background: #f8efed;
		border-color: #ead4d5;
		--c: var(--coral);
	}
	.s2 {
		background: #eef3f6;
		border-color: #d6e3eb;
		--c: var(--sea);
	}
	.s3 {
		background: #e1ecf2;
		border-color: #bfd5e2;
		--c: var(--sea);
	}
	.head {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: center;
		column-gap: 12px;
	}
	.n {
		grid-row: span 2;
		display: grid;
		place-items: center;
		width: 34px;
		height: 34px;
		border-radius: 50%;
		border: 1.5px solid var(--c);
		color: var(--c);
		background: #fff;
		font-family: var(--sans);
		font-size: 15px;
		font-weight: 600;
		line-height: 1;
	}
	.s3 .n {
		background: var(--sea);
		color: #fff;
	}
	.k {
		font-size: 12px;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		font-weight: 700;
		color: var(--c);
		line-height: 1.2;
	}
	.hint {
		font-size: 13px;
		color: var(--ink-soft);
		line-height: 1.3;
	}
	p {
		margin: 0;
		font-size: 15.5px;
		line-height: 1.6;
		color: var(--ink);
		width: fit-content;
	}
	.large p {
		font-family: var(--serif);
		font-size: 21px;
		line-height: 1.4;
	}
	.large li {
		padding: 28px 28px 30px;
	}
	.arr {
		position: absolute;
		top: 50%;
		right: -26px;
		translate: 0 -50%;
		z-index: 2;
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: #fff;
		border: 1px solid var(--line-strong);
		color: var(--sea);
		box-shadow: 0 2px 8px rgb(43 45 66 / 0.08);
	}
	.arr :global(svg) {
		width: 18px;
		height: 18px;
		stroke-width: 1.8;
	}
	@media (max-width: 760px) {
		.flow {
			grid-template-columns: 1fr;
			gap: 26px;
		}
		.arr {
			top: auto;
			bottom: -26px;
			right: auto;
			left: 50%;
			translate: -50% 0;
			rotate: 90deg;
		}
	}
</style>
