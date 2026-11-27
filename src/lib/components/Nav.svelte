<script>
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';

	let { onsearch } = $props();

	const links = [
		{ href: `${base}/balgarski/`, label: 'Български', subj: 'bel' },
		{ href: `${base}/francais/`, label: 'Français', subj: 'fr', lang: 'fr' },
		{ href: `${base}/praktiki/`, label: 'Практики' },
		{ href: `${base}/portfolio/`, label: 'Портфолио' },
		{ href: '#kontakt', label: 'Контакт' }
	];


	let scrolled = $state(false);
	let hidden = $state(false);
	let menuOpen = $state(false);

	// Плъзгащ се индикатор под менюто
	let navEl = $state();
	let ind = $state({ x: 0, w: 0, show: false });

	const isActive = (href) =>
		href === `${base}/` ? page.url.pathname === `${base}/` : page.url.pathname.startsWith(href);

	function moveTo(el) {
		if (!el || !navEl) return;
		const a = el.getBoundingClientRect();
		const n = navEl.getBoundingClientRect();
		ind = { x: a.left - n.left, w: a.width, show: true };
	}
	function resetIndicator() {
		const active = navEl?.querySelector('[aria-current="page"]');
		if (active) moveTo(active);
		else ind = { ...ind, show: false };
	}

	$effect(() => {
		let lastY = window.scrollY;
		const onScroll = () => {
			const y = window.scrollY;
			scrolled = y > 24;
			if (!menuOpen) hidden = y > 320 && y > lastY + 4;
			if (y < lastY - 4) hidden = false;
			lastY = y;
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', resetIndicator);
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', resetIndicator);
		};
	});

	afterNavigate(() => {
		menuOpen = false;
		requestAnimationFrame(resetIndicator);
	});

	$effect(() => {
		document.documentElement.style.overflow = menuOpen ? 'hidden' : '';
	});

</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') {
			menuOpen = false;
		}
	}}
/>

<header class="site-nav" class:scrolled class:hidden={hidden && !menuOpen}>
	<div class="bar">
		<a href="{base}/" class="brand" aria-label="Маргарита Маджарова – начало">
			<span class="mono" aria-hidden="true">ММ</span>
			<span class="brand-text">
				<span class="name">Маргарита Маджарова</span>
			</span>
		</a>

		<nav aria-label="Основно меню" class="desktop" bind:this={navEl} onpointerleave={resetIndicator}>
			<span
				class="indicator"
				class:show={ind.show}
				style="transform: translateX({ind.x}px); width: {ind.w}px"
				aria-hidden="true"
			></span>
			{#each links as l}
					<a
						href={l.href}
						lang={l.lang}
						class:subj-fr={l.subj === 'fr'}
						aria-current={isActive(l.href) ? 'page' : undefined}
						onpointerenter={(e) => moveTo(e.currentTarget)}
						onfocus={(e) => moveTo(e.currentTarget)}>{l.label}</a
					>
			{/each}
		</nav>

		<div class="tools">
			<button class="icon-btn search" onclick={onsearch} aria-label="Търсене (Ctrl + K)">
				<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"
					><circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" stroke-width="1.4" /><path
						d="m16 16 4.5 4.5"
						stroke="currentColor"
						stroke-width="1.4"
						stroke-linecap="round"
					/></svg
				>
				<kbd>Ctrl K</kbd>
			</button>
			<button
				class="icon-btn burger"
				class:open={menuOpen}
				onclick={() => (menuOpen = !menuOpen)}
				aria-label={menuOpen ? 'Затвори менюто' : 'Отвори менюто'}
				aria-expanded={menuOpen}
				aria-controls="mobile-menu"
			>
				<span></span><span></span>
			</button>
		</div>
	</div>
</header>

<!-- Мобилно меню на цял екран -->
<div id="mobile-menu" class="overlay" class:open={menuOpen} aria-hidden={!menuOpen} inert={!menuOpen}>
	<nav aria-label="Мобилно меню">
		{#each [{ href: `${base}/`, label: 'Начало' }, ...links] as l, i}
			<a href={l.href} style="--i: {i}" aria-current={isActive(l.href) ? 'page' : undefined} onclick={() => (menuOpen = false)}>
				<span class="idx">0{i + 1}</span>{l.label}
			</a>
		{/each}
		<div class="overlay-sub" style="--i: 6">
			<a href="{base}/resursi/">Всички ресурси</a>
		</div>
	</nav>
	<p class="overlay-motto" style="--i: 7">Уча се, като живея. Живея, като се уча.</p>
</div>

<style>
	.site-nav {
		position: fixed;
		inset: 0 0 auto 0;
		z-index: 50;
		padding: 18px var(--gutter) 0;
		transition: transform 0.55s var(--ease);
		pointer-events: none;
	}
	.site-nav.hidden {
		transform: translateY(-140%);
	}
	.bar {
		pointer-events: auto;
		max-width: var(--wrap);
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		padding: 10px 12px 10px 18px;
		border-radius: 999px;
		border: 1px solid transparent;
		transition:
			background 0.4s,
			border-color 0.4s,
			box-shadow 0.4s,
			max-width 0.6s var(--ease),
			padding 0.4s;
	}
	.scrolled .bar {
		max-width: 980px;
		background: rgb(250 248 245 / 0.72);
		backdrop-filter: blur(18px) saturate(1.4);
		-webkit-backdrop-filter: blur(18px) saturate(1.4);
		border-color: rgb(227 221 208 / 0.9);
		box-shadow: var(--shadow-float);
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 12px;
		text-decoration: none;
		min-width: 0;
	}
	.mono {
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 1.5px solid var(--coral);
		font-family: var(--serif);
		font-size: 17px;
		font-weight: 600;
		color: var(--sea);
		letter-spacing: 0.04em;
		flex-shrink: 0;
		transition: background 0.3s, color 0.3s;
	}
	.brand:hover .mono {
		background: var(--coral);
		color: #fff;
	}
	.brand-text {
		min-width: 0;
		display: flex;
		flex-direction: column;
		line-height: 1.15;
	}
	.name {
		font-family: var(--serif);
		font-weight: 600;
		font-size: 22px;
		letter-spacing: 0.01em;
		color: var(--sea);
		white-space: nowrap;
	}

	.desktop {
		position: relative;
		display: flex;
		align-items: center;
		gap: 2px;
	}
	.desktop > a {
		position: relative;
		z-index: 1;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 10px 16px;
		border-radius: 999px;
		font-size: 15px;
		font-weight: 500;
		text-decoration: none;
		color: var(--ink);
		transition: color 0.25s;
	}
	.desktop a[aria-current='page'] {
		color: var(--sea);
	}
	.desktop a.subj-fr[aria-current='page'] {
		color: var(--coral);
	}
	.indicator {
		position: absolute;
		left: 0;
		top: 50%;
		height: 40px;
		margin-top: -20px;
		border-radius: 999px;
		background: var(--sea-mist);
		opacity: 0;
		transition:
			transform 0.45s var(--ease),
			width 0.45s var(--ease),
			opacity 0.3s;
	}
	.indicator.show {
		opacity: 1;
	}

	.tools {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.icon-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		min-width: 44px;
		height: 44px;
		padding: 0 12px;
		border-radius: 999px;
		border: 1px solid var(--line);
		background: rgb(255 255 255 / 0.6);
		color: var(--ink);
		cursor: pointer;
		transition: border-color 0.25s, background 0.25s;
	}
	.icon-btn:hover {
		border-color: var(--sea);
		background: #fff;
	}
	kbd {
		font: 500 11px var(--sans);
		color: var(--ink-soft);
		border: 1px solid var(--line);
		border-radius: 5px;
		padding: 2px 5px;
	}
	.burger {
		display: none;
		flex-direction: column;
		gap: 6px;
		padding: 0;
		width: 44px;
	}
	.burger span {
		display: block;
		width: 18px;
		height: 1.4px;
		background: currentColor;
		transition: transform 0.4s var(--ease);
	}
	.burger.open span:first-child {
		transform: translateY(3.7px) rotate(45deg);
	}
	.burger.open span:last-child {
		transform: translateY(-3.7px) rotate(-45deg);
	}

	/* Мобилно меню */
	.overlay {
		position: fixed;
		inset: 0;
		z-index: 40;
		background: rgb(250 248 245 / 0.96);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		padding: 120px var(--gutter) 40px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		clip-path: circle(0% at calc(100% - 46px) 46px);
		transition: clip-path 0.7s var(--ease);
		overflow-y: auto;
	}
	.overlay.open {
		clip-path: circle(150% at calc(100% - 46px) 46px);
	}
	.overlay nav {
		display: flex;
		flex-direction: column;
	}
	.overlay nav > a {
		display: flex;
		align-items: baseline;
		gap: 16px;
		padding: 10px 0;
		border-bottom: 1px solid var(--line);
		font-family: var(--serif);
		font-size: clamp(34px, 9vw, 48px);
		line-height: 1.1;
		text-decoration: none;
		color: var(--sea);
	}
	.idx {
		font-family: var(--sans);
		font-size: 12px;
		letter-spacing: 0.1em;
		color: var(--ink-soft);
	}
	.overlay-sub {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		padding-top: 20px;
	}
	.overlay-sub a {
		padding: 8px 14px;
		border: 1px solid var(--line);
		border-radius: 999px;
		font-size: 14px;
		text-decoration: none;
		color: var(--ink);
	}
	.overlay-motto {
		font-family: var(--serif);
		font-style: italic;
		font-size: 20px;
		color: var(--ink-soft);
		margin: 32px 0 0;
	}
	.overlay nav > a,
	.overlay-sub,
	.overlay-motto {
		opacity: 0;
		transform: translateY(16px);
		transition:
			opacity 0.5s var(--ease),
			transform 0.6s var(--ease);
	}
	.overlay.open nav > a,
	.overlay.open .overlay-sub,
	.overlay.open .overlay-motto {
		opacity: 1;
		transform: none;
		transition-delay: calc(0.15s + var(--i) * 0.06s);
	}

	@media (max-width: 900px) {
		.desktop,
		kbd {
			display: none;
		}
		.burger {
			display: inline-flex;
		}
		.search {
			width: 44px;
			padding: 0;
		}
	}
	@media (max-width: 520px) {
		.bar {
			padding-left: 10px;
			gap: 10px;
		}
		.brand {
			gap: 8px;
		}
		.name {
			font-size: 16.5px;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.mono {
			width: 36px;
			height: 36px;
			font-size: 15px;
		}
	}
	@media (max-width: 380px) {
		.name {
			font-size: 14.5px;
		}
	}
	@media (min-width: 901px) {
		.overlay {
			display: none;
		}
	}
</style>
