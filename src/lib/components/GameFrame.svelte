<script>
	// Вградена самостоятелна HTML игра от static/igri/…
	// Употреба в .md:  <GameFrame src="/igri/fr/verbe-etre.html" title="Le verbe être" />
	import { base } from '$app/paths';

	let { src, title = 'Игра' } = $props();
	let url = $derived(src.startsWith('/') ? base + src : src);
	let box;
	let full = $state(false);

	// На цял екран отива цялата кутия (с лентата), за да има бутон за изход – и на дъска без клавиатура
	function fullscreen() {
		if (document.fullscreenElement) return document.exitFullscreen();
		if (box?.requestFullscreen) box.requestFullscreen().catch(() => window.open(url, '_blank'));
		else window.open(url, '_blank'); // напр. iPhone – отваря играта на отделна страница
	}
</script>

<svelte:document onfullscreenchange={() => (full = document.fullscreenElement === box)} />

<div class="game" class:full bind:this={box}>
	<div class="bar">
		<button onclick={fullscreen}>{full ? '✕ Изход от цял екран' : '⛶ Цял екран'}</button>
		{#if !full}<a href={url} target="_blank" rel="noopener">Отвори в нов прозорец ↗</a>{/if}
	</div>
	<iframe src={url} {title} allow="fullscreen" loading="lazy"></iframe>
</div>

<style>
	.game {
		width: 100%;
		margin-bottom: 24px;
	}
	.bar {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
		margin-bottom: 10px;
	}
	.bar button,
	.bar a {
		padding: 7px 16px;
		border: 1px solid var(--sea);
		border-radius: 999px;
		background: transparent;
		font: 500 14px var(--sans);
		color: var(--sea);
		text-decoration: none;
		cursor: pointer;
		transition: background 0.2s, color 0.2s;
	}
	.bar button:hover,
	.bar a:hover {
		background: var(--sea);
		color: #fff;
	}
	/* Висока колкото екрана (без горното меню) – играта вътре сама се приспособява */
	iframe {
		display: block;
		width: 100%;
		height: calc(100vh - 120px);
		height: calc(100svh - 120px);
		min-height: 520px;
		max-height: 900px;
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		background: #fbf7ef;
	}
	/* Цял екран: лентата горе, играта – в цялото останало място */
	.game.full {
		display: flex;
		flex-direction: column;
		height: 100vh;
		padding: 10px 14px 0;
		background: #fbf7ef;
	}
	.game.full iframe {
		flex: 1;
		height: auto;
		max-height: none;
		min-height: 0;
		border: 0;
		border-radius: 0;
	}
</style>
