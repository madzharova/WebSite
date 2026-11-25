<script>
	// Интерактивно упражнение „Свържи двойките“.
	// Употреба в .md файл:  <MatchPairs pairs={[['le ciel', 'небето'], ...]} />
	let { pairs = [], left = 'Français', right = 'Български' } = $props();

	const shuffle = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);

	let rightOrder = $state(shuffle(pairs.map((_, i) => i)));
	let picked = $state(null);
	let done = $state(new Set());
	let wrong = $state(null);
	let tries = $state(0);

	function pickLeft(i) {
		if (done.has(i)) return;
		picked = picked === i ? null : i;
	}
	function pickRight(j) {
		if (picked === null || done.has(j)) return;
		tries++;
		if (picked === j) {
			done = new Set([...done, j]);
			picked = null;
		} else {
			wrong = j;
			setTimeout(() => (wrong = null), 500);
		}
	}
	function reset() {
		rightOrder = shuffle(pairs.map((_, i) => i));
		done = new Set();
		picked = null;
		tries = 0;
	}
	let finished = $derived(done.size === pairs.length && pairs.length > 0);
</script>

<div class="game" aria-live="polite">
	<div class="cols">
		<div class="col">
			<p class="h">{left}</p>
			{#each pairs as p, i}
				<button class="item" class:picked={picked === i} class:done={done.has(i)} onclick={() => pickLeft(i)} disabled={done.has(i)}>
					{p[0]}
				</button>
			{/each}
		</div>
		<div class="col">
			<p class="h">{right}</p>
			{#each rightOrder as j}
				<button class="item" class:done={done.has(j)} class:wrong={wrong === j} onclick={() => pickRight(j)} disabled={done.has(j)}>
					{pairs[j][1]}
				</button>
			{/each}
		</div>
	</div>
	<div class="status">
		{#if finished}
			<span class="ok">Браво! {pairs.length} от {pairs.length} с {tries} опита.</span>
		{:else}
			<span>Свързани: {done.size} / {pairs.length}</span>
		{/if}
		<button class="reset" onclick={reset}>Отначало</button>
	</div>
</div>

<style>
	.game {
		margin: 2em 0;
		padding: 24px;
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		background: var(--card);
		max-width: 720px;
	}
	.cols {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}
	.col {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.h {
		margin: 0 0 4px;
		font-size: 11px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	.item {
		min-height: 48px;
		padding: 10px 14px;
		border: 1px solid var(--line);
		border-radius: 12px;
		background: var(--bg);
		font: 500 16px var(--sans);
		color: var(--ink);
		text-align: left;
		cursor: pointer;
		transition: border-color 0.2s, background 0.2s, transform 0.3s var(--ease), opacity 0.4s;
	}
	.item:hover:not(:disabled) {
		border-color: var(--sea);
		transform: translateX(2px);
	}
	.picked {
		border-color: var(--sea);
		background: var(--sea-mist);
	}
	.done {
		opacity: 0.45;
		text-decoration: line-through;
		text-decoration-color: var(--sea);
		cursor: default;
	}
	.wrong {
		border-color: var(--coral);
		animation: shake 0.4s;
	}
	.status {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 18px;
		font-size: 15px;
		color: var(--ink-soft);
	}
	.ok {
		color: var(--sea);
		font-weight: 600;
	}
	.reset {
		border: 1px solid var(--line);
		background: none;
		border-radius: 999px;
		padding: 8px 16px;
		cursor: pointer;
		font: 500 14px var(--sans);
		color: var(--ink);
		min-height: 40px;
	}
	@keyframes shake {
		25% { transform: translateX(-4px); }
		75% { transform: translateX(4px); }
	}
</style>
