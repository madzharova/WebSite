<script>
	// Неравната черта под заглавието на страницата – рисува се при отваряне.
	let { color = 'var(--sea)' } = $props();
</script>

<svg class="line" viewBox="0 0 240 12" aria-hidden="true">
	<path d="M1 6 C 60 1, 120 11, 239 6" fill="none" stroke={color} stroke-width="1" pathLength="1" />
</svg>

<style>
	.line {
		display: block;
		width: 200px;
		height: 12px;
		margin: 26px 0 22px;
	}
	.line path {
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		animation: draw 1.6s 0.3s var(--ease) forwards;
	}
	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.line path {
			animation: none;
			stroke-dashoffset: 0;
		}
	}
</style>
