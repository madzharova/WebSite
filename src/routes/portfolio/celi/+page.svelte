<script>
	import { pages, criterionHref } from '$lib/content.js';
	import { byId } from '$lib/data/criteria.js';
	import { reveal } from '$lib/actions/reveal.js';
	import PageHeader from '$lib/components/PageHeader.svelte';
	const p = pages['celi'];
	const Body = p.component;
	const st = { planned: 'планирано', active: 'в изпълнение', done: 'изпълнено' };
</script>

<svelte:head><title>Цели за развитие · Портфолио</title></svelte:head>
<PageHeader eyebrow="Портфолио · Развиваща функция" title={p.title} lead={p.lead} />

<section class="section">
	<div class="wrap">
		<div class="prose"><Body /></div>
		<ol class="timeline">
			{#each p.goals ?? [] as g, i}
				<li class={g.status} use:reveal={{ delay: i * 70 }}>
					<span class="when" class:fill={g.deadline.includes('[')}>{g.deadline}</span>
					<div class="card">
						<div class="row">
							<h3>{g.title}</h3>
							<span class="st">{st[g.status]}</span>
						</div>
						<p class:fill={g.measure.includes('[')}><b>Измерим резултат:</b> {g.measure}</p>
						<div class="crit">
							{#each g.criteria as id}
								{@const c = byId[id]}
								{#if c}<a class="chip" href={criterionHref(c)}>{c.section}.{c.num}</a>{/if}
							{/each}
						</div>
					</div>
				</li>
			{/each}
		</ol>
	</div>
</section>

<style>
	.timeline {
		list-style: none;
		margin: 48px 0 0;
		padding: 0;
		position: relative;
	}
	.timeline::before {
		content: '';
		position: absolute;
		left: 150px;
		top: 0;
		bottom: 0;
		width: 1px;
		background: var(--line-strong);
	}
	.timeline li {
		display: grid;
		grid-template-columns: 150px 1fr;
		gap: 40px;
		position: relative;
		padding-bottom: 28px;
	}
	.timeline li::after {
		content: '';
		position: absolute;
		left: 145px;
		top: 26px;
		width: 11px;
		height: 11px;
		border-radius: 50%;
		background: var(--bg);
		border: 1px solid var(--sea);
	}
	.timeline li.active::after {
		background: var(--coral);
		border-color: var(--coral);
		box-shadow: 0 0 0 6px rgb(169 90 97 / 0.12);
	}
	.timeline li.done::after {
		background: var(--sea);
	}
	.when {
		padding-top: 18px;
		font-family: var(--serif);
		font-size: 20px;
		color: var(--sea);
		text-align: right;
		padding-right: 20px;
		height: fit-content;
	}
	.card {
		padding: 22px 26px;
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		background: var(--card);
	}
	.row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
	}
	.st {
		font-size: 12px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-soft);
		white-space: nowrap;
	}
	.card p {
		margin: 10px 0 14px;
		font-size: 15.5px;
		width: fit-content;
	}
	.crit {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.crit a {
		text-decoration: none;
		color: var(--sea);
	}
	.crit a:hover {
		border-color: var(--sea);
	}
	@media (max-width: 700px) {
		.timeline::before {
			left: 5px;
		}
		.timeline li {
			grid-template-columns: 1fr;
			gap: 6px;
			padding-left: 30px;
		}
		.timeline li::after {
			left: 0;
			top: 6px;
		}
		.when {
			text-align: left;
			padding: 0;
		}
	}
</style>
