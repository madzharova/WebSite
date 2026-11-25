<script>
	import { goto } from '$app/navigation';
	import { searchIndex } from '$lib/content.js';

	let { open = $bindable(false) } = $props();

	let q = $state('');
	let active = $state(0);
	let input = $state();

	const norm = (s) => (s ?? '').toLowerCase().normalize('NFKD');

	let results = $derived.by(() => {
		const t = norm(q).trim();
		if (!t) return searchIndex.filter((r) => r.kind !== 'Критерий' && !r.kind.startsWith('Критерий')).slice(0, 6);
		const words = t.split(/\s+/);
		return searchIndex
			.map((r) => {
				const title = norm(r.title);
				const all = `${title} ${norm(r.text)} ${norm(r.kind)}`;
				if (!words.every((w) => all.includes(w))) return null;
				const score = words.reduce((s, w) => s + (title.includes(w) ? 3 : 1), 0);
				return { ...r, score };
			})
			.filter(Boolean)
			.sort((a, b) => b.score - a.score)
			.slice(0, 10);
	});

	$effect(() => {
		if (open) {
			q = '';
			active = 0;
			setTimeout(() => input?.focus(), 30);
		}
	});
	$effect(() => {
		results;
		active = 0;
	});

	function onGlobalKey(e) {
		const k = e.key.toLowerCase();
		if ((e.metaKey || e.ctrlKey) && (k === 'k' || k === 'л')) {
			e.preventDefault();
			open = !open;
		} else if (k === '/' && !open && !/input|textarea/i.test(document.activeElement?.tagName)) {
			e.preventDefault();
			open = true;
		}
	}

	function onKey(e) {
		if (e.key === 'Escape') open = false;
		else if (e.key === 'ArrowDown') {
			e.preventDefault();
			active = Math.min(active + 1, results.length - 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			active = Math.max(active - 1, 0);
		} else if (e.key === 'Enter' && results[active]) {
			open = false;
			goto(results[active].href);
		}
	}
</script>

<svelte:window onkeydown={onGlobalKey} />

{#if open}
	<div class="backdrop" onclick={() => (open = false)} role="presentation"></div>
	<div class="dialog" role="dialog" aria-modal="true" aria-label="Търсене в сайта">
		<label class="field">
			<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"
				><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.4" /><path
					d="m16 16 4.5 4.5"
					stroke="currentColor"
					stroke-width="1.4"
					stroke-linecap="round"
				/></svg
			>
			<span class="visually-hidden">Търсене</span>
			<input
				bind:this={input}
				bind:value={q}
				onkeydown={onKey}
				placeholder="Ресурс, тема, критерий… (напр. Бодлер, 2.3, тест)"
				autocomplete="off"
				role="combobox"
				aria-expanded="true"
				aria-controls="search-results"
			/>
			<kbd>Esc</kbd>
		</label>
		<ul id="search-results" role="listbox">
			{#each results as r, i (r.href)}
				<li role="option" aria-selected={i === active}>
					<a href={r.href} class:active={i === active} onclick={() => (open = false)} onpointerenter={() => (active = i)}>
						<span class="kind">{r.kind}</span>
						<span class="title">{r.title}</span>
						<span class="go" aria-hidden="true">↵</span>
					</a>
				</li>
			{:else}
				<li class="empty">Няма резултати за „{q}“.</li>
			{/each}
		</ul>
		<p class="hint">↑ ↓ за избор · Enter за отваряне · <kbd>/</kbd> отваря търсенето отвсякъде</p>
	</div>
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		z-index: 90;
		background: rgb(43 45 66 / 0.18);
		backdrop-filter: blur(6px);
		-webkit-backdrop-filter: blur(6px);
		animation: fade 0.25s var(--ease);
	}
	.dialog {
		position: fixed;
		z-index: 91;
		top: 12vh;
		left: 50%;
		width: min(640px, calc(100vw - 32px));
		transform: translateX(-50%);
		background: rgb(250 248 245 / 0.96);
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-float);
		overflow: hidden;
		animation: rise 0.4s var(--ease);
	}
	.field {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 16px 20px;
		border-bottom: 1px solid var(--line);
		color: var(--ink-soft);
	}
	input {
		flex: 1;
		border: 0;
		background: transparent;
		font: 400 18px var(--sans);
		color: var(--ink);
		outline: none;
		min-width: 0;
	}
	ul {
		list-style: none;
		margin: 0;
		padding: 8px;
		max-height: 52vh;
		overflow-y: auto;
	}
	li a {
		display: grid;
		grid-template-columns: 120px 1fr auto;
		align-items: center;
		gap: 12px;
		padding: 12px 14px;
		border-radius: 10px;
		text-decoration: none;
		color: var(--ink);
	}
	li a.active {
		background: var(--sea-mist);
	}
	.kind {
		font-size: 11px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	.title {
		font-weight: 500;
	}
	.go {
		opacity: 0;
		color: var(--sea);
	}
	a.active .go {
		opacity: 1;
	}
	.empty {
		padding: 20px 14px;
		color: var(--ink-soft);
	}
	.hint {
		margin: 0;
		padding: 10px 20px;
		border-top: 1px solid var(--line);
		font-size: 12.5px;
		color: var(--ink-soft);
	}
	kbd {
		font: 500 11px var(--sans);
		border: 1px solid var(--line);
		border-radius: 5px;
		padding: 2px 6px;
		color: var(--ink-soft);
	}
	@media (max-width: 560px) {
		li a {
			grid-template-columns: 1fr auto;
		}
		.kind {
			grid-column: 1 / -1;
		}
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
	}
	@keyframes rise {
		from {
			opacity: 0;
			transform: translate(-50%, 12px) scale(0.98);
		}
	}
</style>
