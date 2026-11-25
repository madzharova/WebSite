<script>
	import { base } from '$app/paths';
	import { dev } from '$app/environment';
	import { sections } from '$lib/data/criteria.js';
	import { criteriaWithEvidence, criterionHref } from '$lib/content.js';
	import { reveal } from '$lib/actions/reveal.js';

	let { only = null } = $props();

	const status = (n) => (n >= 2 ? 'covered' : n === 1 ? 'progress' : 'todo');
	const statusLabel = { covered: 'покрит', progress: 'в процес', todo: 'предстои' };

	let list = $derived(only ? sections.filter((s) => s.id === only) : sections);
</script>

<div class="map">
	{#each list as s}
		{@const items = criteriaWithEvidence.filter((c) => c.section === s.id)}
		{@const covered = items.filter((c) => c.evidenceCount >= 2).length}
		<section class="sec" aria-labelledby="sec-{s.id}">
			<header use:reveal>
				<span class="roman" aria-hidden="true">{s.roman}</span>
				<div>
					<h3 id="sec-{s.id}"><a href="{base}/portfolio/{s.slug}/">{s.title}</a></h3>
					<p>{s.subtitle}</p>
				</div>
				<!-- напредък по доказателствата – само локално -->
				{#if dev}
					<div class="meter" title="{covered} от {items.length} критерия с поне 2 доказателства">
						<span style="width: {(covered / items.length) * 100}%"></span>
					</div>
				{/if}
			</header>
			<ol class="tiles">
				{#each items as c, i}
					{@const st = dev ? status(c.evidenceCount) : ''}
					<li use:reveal={{ delay: (i % 6) * 50 }}>
						<a href={criterionHref(c)} class="tile {st}">
							<span class="top">
								<span class="num">{c.section}.{c.num}</span>
								{#if dev}<span class="st">{statusLabel[st]}</span>{/if}
							</span>
							<span class="short">{c.short}</span>
							{#if c.evidenceCount > 0}
								<span class="foot">
									<span class="dots" aria-hidden="true">
										{#each Array(Math.min(c.evidenceCount, 6)) as _}<i></i>{/each}
									</span>
									<span>{c.evidenceCount} {c.evidenceCount === 1 ? 'доказателство' : 'доказателства'}</span>
								</span>
							{/if}
						</a>
					</li>
				{/each}
			</ol>
		</section>
	{/each}
</div>

<style>
	.map {
		display: flex;
		flex-direction: column;
		gap: 64px;
	}
	header {
		display: grid;
		grid-template-columns: auto 1fr minmax(120px, 200px);
		align-items: center;
		gap: 20px;
		padding-bottom: 20px;
		margin-bottom: 20px;
		border-bottom: 1px solid var(--line);
	}
	.roman {
		font-family: var(--serif);
		font-size: 64px;
		line-height: 0.8;
		color: var(--sea);
		opacity: 0.25;
		min-width: 70px;
	}
	h3 a {
		text-decoration: none;
	}
	h3 a:hover {
		text-decoration: underline;
	}
	header p {
		margin: 4px 0 0;
		font-size: 14px;
		color: var(--ink-soft);
	}
	.meter {
		height: 2px;
		background: var(--line);
		border-radius: 2px;
		overflow: hidden;
	}
	.meter span {
		display: block;
		height: 100%;
		background: var(--sea);
		transition: width 1s var(--ease);
	}
	.tiles {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
		gap: 12px;
	}
	.tiles li {
		display: flex;
	}
	.tile {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 14px 16px 14px;
		border-radius: 14px;
		border: 1px solid var(--line);
		background: var(--card);
		text-decoration: none;
		color: var(--ink);
		transition: transform 0.45s var(--ease), border-color 0.3s, box-shadow 0.45s var(--ease);
	}
	.tile:hover {
		transform: translateY(-3px);
		border-color: var(--sea);
		box-shadow: var(--shadow-soft);
		color: var(--ink);
	}
	.top {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 8px;
	}
	.st {
		font-size: 11px;
		letter-spacing: 0.06em;
		padding: 2px 8px;
		border-radius: 999px;
		border: 1px solid currentColor;
		white-space: nowrap;
	}
	.num {
		font-family: var(--serif);
		font-size: 21px;
		line-height: 1;
		font-weight: 600;
		color: var(--sea);
	}
	.short {
		font-size: 15px;
		line-height: 1.4;
		font-weight: 500;
	}
	.foot {
		margin-top: auto;
		display: flex;
		align-items: center;
		gap: 8px;
		padding-top: 4px;
		font-size: 12px;
		letter-spacing: 0.06em;
		color: var(--ink-soft);
	}
	.dots {
		display: flex;
		gap: 4px;
	}
	.dots i {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--sea);
	}
	.todo {
		background: transparent;
		border-style: dashed;
	}
	.todo .st {
		color: #8a5a2b;
	}
	.progress .st {
		color: var(--coral);
	}
	.covered .st {
		color: var(--sea);
	}
	@media (max-width: 640px) {
		header {
			grid-template-columns: auto 1fr;
		}
		.meter {
			grid-column: 1 / -1;
		}
		.tiles {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
