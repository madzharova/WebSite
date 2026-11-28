<script>
	import { base } from '$app/paths';
	import { subjects, gradeLabel } from '$lib/content.js';
	import { topicLabel, examLabel } from '$lib/data/subjects.js';
	// hideSubject – на страницата на предмета името му не се повтаря върху всяка карта
	let { r, hideSubject = false } = $props();
</script>

<a class="card" class:has-cover={r.cover} href="{base}/resursi/{r.slug}/" data-subject={r.subject}>
	{#if r.cover}<div class="cover"><img src={r.cover} alt="" loading="lazy" /></div>{/if}
	<div class="meta">
		{#if !hideSubject}
			<span class="subj">{subjects[r.subject] ?? r.subject}</span>
			<span class="dot" aria-hidden="true">·</span>
		{/if}
		<span>{r.type}</span>
		{#if r.level && !String(r.level).includes('[')}<span class="grade">{r.level}</span>{:else if r.grade}<span class="grade">{gradeLabel(r)}</span>{/if}
	</div>
	{#if r.topic}<p class="topic">{[].concat(r.topic).map(topicLabel).join(' · ')}</p>{/if}
	<h3>{r.title}</h3>
	<p>{r.summary}</p>
	<div class="foot">
		<span class="flags">
			{#each [].concat(r.izpit ?? []) as e}<span class="chip">{examLabel(e)}</span>{/each}
		</span>
		<span class="arrow" aria-hidden="true">→</span>
	</div>
</a>

<style>
	.card {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 8px;
		height: 100%;
		padding: 20px 22px;
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
		font-size: 21px;
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
		padding-top: 10px;
		border-top: 1px solid var(--line);
		font-size: 13px;
		color: var(--ink-soft);
	}
	.flags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.flags .chip {
		font-size: 11.5px;
		padding: 2px 9px;
	}
	.arrow {
		margin-left: auto;
		color: var(--sea);
		transition: transform 0.4s var(--ease);
	}
	.card:hover .arrow {
		transform: translateX(4px);
	}
</style>
