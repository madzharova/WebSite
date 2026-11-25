<script>
	import { base } from '$app/paths';
	import { subjects } from '$lib/content.js';
	import { spotlight } from '$lib/actions/tilt.js';
	import { topicLabel } from '$lib/data/subjects.js';
	let { r } = $props();
	const fmt = (d) => (d ? new Date(d).toLocaleDateString('bg-BG', { month: 'long', year: 'numeric' }) : '');
</script>

<a class="card" class:has-cover={r.cover} href="{base}/resursi/{r.slug}/" use:spotlight data-subject={r.subject}>
	{#if r.cover}<div class="cover"><img src={r.cover} alt="" loading="lazy" /></div>{/if}
	<div class="meta">
		<span class="subj">{subjects[r.subject] ?? r.subject}</span>
		<span class="dot" aria-hidden="true">·</span>
		<span>{r.type}</span>
		{#if r.level && !String(r.level).includes('[')}<span class="grade">{r.level}</span>{:else if r.grade}<span class="grade">{r.grade} клас</span>{/if}
	</div>
	{#if r.topic}<p class="topic">{[].concat(r.topic).map(topicLabel).join(' · ')}</p>{/if}
	<h3>{r.title}</h3>
	<p>{r.summary}</p>
	<div class="foot">
		<span class="date">{fmt(r.date)}</span>
		<span class="flags">
			{#if r.interactive}<span class="chip">интерактивно</span>{/if}
			{#if r.files?.length}<span class="chip" title="Материали за сваляне">за печат</span>{/if}
		</span>
		<span class="arrow" aria-hidden="true">→</span>
	</div>
</a>

<style>
	.card {
		--mx: 50%;
		--my: 0%;
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 12px;
		height: 100%;
		min-height: 260px;
		padding: 28px;
		border-radius: var(--radius-lg);
		border: 1px solid var(--line);
		background: var(--card);
		color: var(--ink);
		text-decoration: none;
		overflow: hidden;
		isolation: isolate;
		transition:
			transform 0.5s var(--ease),
			box-shadow 0.5s var(--ease),
			border-color 0.3s;
	}
	.card::before {
		/* светлина под курсора */
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		background: radial-gradient(320px circle at var(--mx) var(--my), rgb(228 238 244 / 0.9), transparent 60%);
		opacity: 0;
		transition: opacity 0.4s;
	}
	.card::after {
		/* тънка линия, която се изтегля отгоре */
		content: '';
		position: absolute;
		top: 0;
		left: 28px;
		right: 28px;
		height: 1px;
		background: var(--sea);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.6s var(--ease);
	}
	.card[data-subject='fr']::after {
		background: var(--coral);
	}
	.card:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow-soft);
		border-color: var(--line-strong);
		color: var(--ink);
	}
	.card:hover::before {
		opacity: 1;
	}
	.card:hover::after {
		transform: scaleX(1);
	}
	.cover {
		margin: -28px -28px 6px;
		aspect-ratio: 16 / 10;
		overflow: hidden;
		background: var(--paper);
	}
	.cover img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 50% 20%;
		transition: transform 1s var(--ease);
	}
	.card:hover .cover img {
		transform: scale(1.04);
	}
	.meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 6px;
		font-size: 12px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	.subj {
		color: var(--sea);
		font-weight: 600;
	}
	[data-subject='fr'] .subj {
		color: var(--coral);
	}
	.topic {
		margin: -4px 0 0;
		font-size: 15px;
		font-style: italic;
		font-family: var(--serif);
		color: var(--ink-soft);
		-webkit-line-clamp: 1;
		line-clamp: 1;
	}
	.card[data-subject='bel-fr']::after {
		background: linear-gradient(90deg, var(--sea), var(--coral));
	}
	.grade {
		margin-left: auto;
		letter-spacing: 0.04em;
	}
	h3 {
		font-size: 25px;
		line-height: 1.18;
	}
	p {
		margin: 0;
		font-size: 15px;
		line-height: 1.6;
		color: var(--ink-soft);
		display: -webkit-box;
		-webkit-line-clamp: 3;
		line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.foot {
		margin-top: auto;
		display: flex;
		align-items: center;
		gap: 8px;
		padding-top: 14px;
		border-top: 1px solid var(--line);
		font-size: 13px;
		color: var(--ink-soft);
	}
	.flags {
		display: flex;
		gap: 6px;
		margin-left: auto;
	}
	.flags .chip {
		font-size: 11.5px;
		padding: 2px 9px;
	}
	.arrow {
		color: var(--sea);
		transition: transform 0.4s var(--ease);
	}
	.card:hover .arrow {
		transform: translateX(4px);
	}
</style>
