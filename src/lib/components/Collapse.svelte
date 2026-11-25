<script>
	// Скриваща се секция с плавна височина (grid-template-rows трик)
	let { title, open = $bindable(false), children, level = 'h3', meta = undefined } = $props();
	const id = 'c' + Math.random().toString(36).slice(2, 8);
</script>

<div class="collapse" class:open>
	<svelte:element this={level} class="head">
		<button aria-expanded={open} aria-controls={id} onclick={() => (open = !open)}>
			<span class="t">{title}</span>
			{#if meta}<span class="meta">{@render meta()}</span>{/if}
			<span class="plus" aria-hidden="true"></span>
		</button>
	</svelte:element>
	<div class="body" {id} role="region" inert={!open}>
		<div class="inner">{@render children()}</div>
	</div>
</div>

<style>
	.collapse {
		border-top: 1px solid var(--line);
	}
	.collapse:last-child {
		border-bottom: 1px solid var(--line);
	}
	.head {
		margin: 0;
		font: inherit;
	}
	button {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 22px 0;
		border: 0;
		background: none;
		cursor: pointer;
		text-align: left;
		color: var(--sea);
		font-family: var(--serif);
		font-size: 24px;
		font-weight: 500;
		line-height: 1.25;
	}
	.t {
		flex: 1;
	}
	.meta {
		font-family: var(--sans);
		font-size: 13px;
		color: var(--ink-soft);
	}
	.plus {
		position: relative;
		width: 36px;
		height: 36px;
		flex-shrink: 0;
		border: 1px solid var(--line-strong);
		border-radius: 50%;
		transition: transform 0.5s var(--ease), background 0.3s, border-color 0.3s;
	}
	.plus::before,
	.plus::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 50%;
		width: 12px;
		height: 1px;
		background: var(--sea);
		translate: -50% -50%;
	}
	.plus::after {
		rotate: 90deg;
		transition: rotate 0.5s var(--ease);
	}
	button:hover .plus {
		border-color: var(--sea);
	}
	.open .plus {
		transform: rotate(180deg);
		background: var(--sea-mist);
	}
	.open .plus::after {
		rotate: 0deg;
	}
	.body {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows 0.6s var(--ease);
	}
	.open .body {
		grid-template-rows: 1fr;
	}
	.inner {
		overflow: hidden;
		min-height: 0;
	}
	.open .inner {
		padding-bottom: 24px;
	}
</style>
