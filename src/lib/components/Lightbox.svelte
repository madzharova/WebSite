<script>
	// Галерия на цял екран: ← → и Esc от клавиатурата, плъзгане на телефон.
	import { fade, fly } from 'svelte/transition';

	let { images = [], index = $bindable(-1), title = '', children = undefined } = $props();

	let open = $derived(index >= 0 && images.length > 0);
	let startX = 0;

	const prev = () => (index = (index - 1 + images.length) % images.length);
	const next = () => (index = (index + 1) % images.length);
	const close = () => (index = -1);

	function key(e) {
		if (!open) return;
		if (e.key === 'Escape') close();
		if (e.key === 'ArrowLeft') prev();
		if (e.key === 'ArrowRight') next();
	}

	$effect(() => {
		document.documentElement.style.overflow = open ? 'hidden' : '';
	});
</script>

<svelte:window onkeydown={key} />

{#if open}
	<div class="lb" role="dialog" aria-modal="true" aria-label={title} transition:fade={{ duration: 200 }}>
		<button class="bg" aria-label="Затвори" onclick={close}></button>
		<div class="stage" ontouchstart={(e) => (startX = e.touches[0].clientX)} ontouchend={(e) => {
				const dx = e.changedTouches[0].clientX - startX;
				if (Math.abs(dx) > 40) dx > 0 ? prev() : next();
			}} role="presentation">
			{#key index}
				<img src={images[index]} alt="{title} – снимка {index + 1}" in:fly={{ x: 30, duration: 350 }} />
			{/key}
		</div>
		<aside class="panel">
			<button class="x" onclick={close} aria-label="Затвори">×</button>
			<p class="t">{title}</p>
			{#if children}<div class="body">{@render children()}</div>{/if}
			{#if images.length > 1}
				<div class="ctrl">
					<button onclick={prev} aria-label="Предишна">←</button>
					<span>{index + 1} / {images.length}</span>
					<button onclick={next} aria-label="Следваща">→</button>
				</div>
			{/if}
		</aside>
	</div>
{/if}

<style>
	.lb {
		position: fixed;
		inset: 0;
		z-index: 95;
		display: grid;
		grid-template-columns: minmax(0, 1fr) 380px;
	}
	.bg {
		position: absolute;
		inset: 0;
		border: 0;
		background: rgb(43 45 66 / 0.88);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		cursor: zoom-out;
	}
	.stage {
		position: relative;
		display: grid;
		place-items: center;
		padding: 32px;
		min-height: 0;
		height: 100vh;
		height: 100dvh;
		pointer-events: none;
	}
	img {
		display: block;
		max-width: 100%;
		max-height: calc(100dvh - 64px);
		width: auto;
		height: auto;
		object-fit: contain;
		border-radius: 12px;
		box-shadow: 0 20px 60px rgb(0 0 0 / 0.35);
		pointer-events: auto;
	}
	.panel {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 14px;
		height: 100vh;
		height: 100dvh;
		padding: 72px 32px 32px;
		background: var(--bg);
		color: var(--ink);
		overflow-y: auto;
		border-left: 1px solid var(--line);
	}
	.t {
		margin: 0;
		font-family: var(--serif);
		font-size: 28px;
		font-weight: 600;
		color: var(--sea);
		line-height: 1.2;
	}
	.body {
		font-size: 16px;
		line-height: 1.65;
		color: var(--ink);
	}
	.body :global(p) {
		margin: 0 0 10px;
	}
	.ctrl {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		margin-top: auto;
		padding-top: 20px;
		border-top: 1px solid var(--line);
		font-size: 14px;
		color: var(--ink-soft);
	}
	button.x,
	.ctrl button {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		border: 1px solid var(--line);
		background: var(--card);
		font-size: 18px;
		cursor: pointer;
		color: var(--ink);
		transition: border-color 0.2s;
	}
	button.x {
		position: absolute;
		top: 20px;
		right: 20px;
		font-size: 22px;
	}
	button.x:hover,
	.ctrl button:hover {
		border-color: var(--sea);
	}
	@media (max-width: 860px) {
		.lb {
			grid-template-columns: 1fr;
			grid-template-rows: auto minmax(0, 1fr);
		}
		.stage {
			height: auto;
			padding: 16px 12px 12px;
		}
		img {
			max-height: 52dvh;
		}
		.panel {
			height: auto;
			min-height: 0;
			padding: 20px 20px 24px;
			border-left: 0;
			border-radius: 18px 18px 0 0;
		}
		.t {
			font-size: 22px;
			padding-right: 52px;
		}
		button.x {
			top: 14px;
			right: 14px;
		}
		.body {
			font-size: 15.5px;
		}
	}
</style>
