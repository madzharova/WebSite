<script>
	let p = $state(0);
	let showTop = $state(false);
	$effect(() => {
		const f = () => {
			const h = document.documentElement.scrollHeight - innerHeight;
			p = h > 0 ? scrollY / h : 0;
			showTop = scrollY > innerHeight * 1.2;
		};
		f();
		addEventListener('scroll', f, { passive: true });
		addEventListener('resize', f);
		return () => {
			removeEventListener('scroll', f);
			removeEventListener('resize', f);
		};
	});
</script>

<div class="progress no-print" style="transform: scaleX({p})" aria-hidden="true"></div>

<button class="to-top no-print" class:show={showTop} onclick={() => scrollTo({ top: 0 })} aria-label="Към началото на страницата">
	<svg viewBox="0 0 44 44" width="44" height="44" aria-hidden="true">
		<circle cx="22" cy="22" r="20" fill="none" stroke="var(--line)" stroke-width="1" />
		<circle cx="22" cy="22" r="20" fill="none" stroke="var(--sea)" stroke-width="1.2" stroke-dasharray="125.7"
			stroke-dashoffset={125.7 * (1 - p)} transform="rotate(-90 22 22)" />
		<path d="M22 28V16m-5 5 5-5 5 5" fill="none" stroke="var(--sea)" stroke-width="1.3" stroke-linecap="round" />
	</svg>
</button>

<style>
	.progress {
		position: fixed;
		inset: 0 0 auto 0;
		height: 2px;
		z-index: 60;
		background: var(--coral);
		transform-origin: 0 50%;
	}
	.to-top {
		position: fixed;
		right: 22px;
		bottom: 22px;
		z-index: 30;
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: rgb(250 248 245 / 0.85);
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
		box-shadow: var(--shadow-soft);
		cursor: pointer;
		opacity: 0;
		transform: translateY(16px);
		pointer-events: none;
		transition: opacity 0.4s var(--ease), transform 0.4s var(--ease);
	}
	.to-top.show {
		opacity: 1;
		transform: none;
		pointer-events: auto;
	}
</style>
