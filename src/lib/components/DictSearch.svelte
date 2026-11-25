<script>
	// Поле за търсене в официален речник – думата се отваря на сайта на речника.
	import searchIcon from '$lib/icons/search.svg?raw';

	let { name, url, placeholder = 'Потърсете дума', lang = undefined } = $props();
	let word = $state('');

	function go(e) {
		e.preventDefault();
		const w = word.trim();
		if (!w) return;
		window.open(url(w), '_blank', 'noopener');
	}
</script>

<form class="dict" onsubmit={go} role="search">
	<label class="lbl" for="dict-{name}">Търсене в {name}</label>
	<div class="row">
		<span class="ic" aria-hidden="true">{@html searchIcon}</span>
		<input id="dict-{name}" type="search" bind:value={word} {placeholder} {lang} autocomplete="off" spellcheck="false" />
		<button type="submit">Търси</button>
	</div>
</form>

<style>
	.dict {
		max-width: 460px;
		margin-top: 28px;
	}
	.lbl {
		display: block;
		margin-bottom: 8px;
		font-size: 13px;
		color: var(--ink-soft);
	}
	.row {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 4px 4px 4px 14px;
		border: 1px solid var(--line-strong, var(--line));
		border-radius: 999px;
		background: var(--card);
		transition: border-color 0.2s, box-shadow 0.2s;
	}
	.row:focus-within {
		border-color: var(--accent, var(--sea));
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent, var(--sea)) 14%, transparent);
	}
	.ic {
		display: inline-flex;
		color: var(--ink-soft);
	}
	.ic :global(svg) {
		width: 18px;
		height: 18px;
		stroke-width: 1.7;
	}
	input {
		flex: 1;
		min-width: 0;
		height: 40px;
		border: 0;
		outline: 0;
		background: none;
		font: inherit;
		font-size: 16px;
		color: var(--ink);
	}
	input::-webkit-search-cancel-button {
		display: none;
	}
	button {
		height: 40px;
		padding: 0 18px;
		border: 0;
		border-radius: 999px;
		background: var(--accent, var(--sea));
		color: #fff;
		font: inherit;
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: opacity 0.2s;
	}
	button:hover {
		opacity: 0.88;
	}
</style>
