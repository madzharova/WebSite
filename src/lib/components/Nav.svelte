<script>
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import { sections } from '$lib/data/criteria.js';

	let { onsearch } = $props();

	const links = [
		{ href: `${base}/balgarski/`, label: 'Български', subj: 'bel' },
		{ href: `${base}/francais/`, label: 'Français', subj: 'fr', lang: 'fr' },
		{ href: `${base}/praktiki/`, label: 'Практики' },
		{ href: `${base}/portfolio/`, label: 'Портфолио', mega: true },
		{ href: `${base}/kontakt/`, label: 'Контакт' }
	];

	const portfolioPages = [
		{ href: `${base}/portfolio/za-men/`, label: 'За мен', note: 'образование и квалификация' },
		{ href: `${base}/portfolio/filosofia/`, label: 'Философия', note: 'как и защо преподавам' },
		{ href: `${base}/portfolio/deinosti/`, label: 'Дейности с ученици', note: 'посещения, конкурси, проекти' },
		{ href: `${base}/portfolio/celi/`, label: 'Цели за развитие', note: 'измерими и със срокове' },
		{ href: `${base}/portfolio/otzivi/`, label: 'Отзиви', note: 'родители и ученици' },
		{ href: `${base}/portfolio/opis/`, label: 'Опис на документите', note: 'чл. 67, т. 4' }
	];

	let scrolled = $state(false);
	let hidden = $state(false);
	let menuOpen = $state(false);
	let megaOpen = $state(false);
	let megaTimer;

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
			if (!menuOpen && !megaOpen) hidden = y > 320 && y > lastY + 4;
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
		megaOpen = false;
		requestAnimationFrame(resetIndicator);
	});

	$effect(() => {
		document.documentElement.style.overflow = menuOpen ? 'hidden' : '';
	});

	const openMega = () => {
		clearTimeout(megaTimer);
		megaOpen = true;
	};
	const closeMega = () => {
		clearTimeout(megaTimer);
		megaTimer = setTimeout(() => (megaOpen = false), 160);
	};
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') {
			megaOpen = false;
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
				<span class="role">БЕЛ · Français</span>
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
				{#if l.mega}
					<div class="has-mega" onpointerenter={openMega} onpointerleave={closeMega} role="presentation">
						<a
							href={l.href}
							aria-current={isActive(l.href) ? 'page' : undefined}
							aria-expanded={megaOpen}
							aria-haspopup="true"
							onpointerenter={(e) => moveTo(e.currentTarget)}
							onfocus={(e) => {
								moveTo(e.currentTarget);
								openMega();
							}}
						>
							{l.label}
							<svg class="caret" class:open={megaOpen} width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"
								><path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" stroke-width="1.2" /></svg
							>
						</a>
						<div class="mega" class:open={megaOpen} onfocusout={(e) => !e.currentTarget.contains(e.relatedTarget) && closeMega()}>
							<div class="mega-col">
								<p class="mega-title">Портфолио</p>
								{#each portfolioPages as p}
									<a href={p.href} class="mega-link">
										<span class="txt">
											<span class="lbl">{p.label}</span>
											<small>{p.note}</small>
										</span>
										<span class="go" aria-hidden="true">→</span>
									</a>
								{/each}
							</div>
							<div class="mega-col mega-col--map">
								<p class="mega-title">Атестационна карта</p>
								{#each sections as s}
									<a href="{base}/portfolio/{s.slug}/" class="mega-sec">
										<span class="roman">{s.roman}</span>
										<span class="sec-name">{s.title}</span>
										<span class="pts">{s.max} т.</span>
										<span class="go" aria-hidden="true">→</span>
									</a>
								{/each}
								<a href="{base}/portfolio/#karta" class="mega-all">Цялата карта – 25 критерия →</a>
							</div>
						</div>
					</div>
				{:else}
					<a
						href={l.href}
						lang={l.lang}
						class:subj-fr={l.subj === 'fr'}
						aria-current={isActive(l.href) ? 'page' : undefined}
						onpointerenter={(e) => moveTo(e.currentTarget)}
						onfocus={(e) => moveTo(e.currentTarget)}>{l.label}</a
					>
				{/if}
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
			<a href={l.href} style="--i: {i}" aria-current={isActive(l.href) ? 'page' : undefined}>
				<span class="idx">0{i + 1}</span>{l.label}
			</a>
		{/each}
		<div class="overlay-sub" style="--i: 6">
			<a href="{base}/resursi/">Всички ресурси</a>
			{#each portfolioPages as p}
				<a href={p.href}>{p.label}</a>
			{/each}
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
		border: 1px solid var(--sea);
		font-family: var(--serif);
		font-size: 17px;
		font-weight: 600;
		color: var(--sea);
		letter-spacing: 0.04em;
		flex-shrink: 0;
		transition: background 0.3s, color 0.3s;
	}
	.brand:hover .mono {
		background: var(--sea);
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
		font-size: 19px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--sea);
		white-space: nowrap;
	}
	.role {
		font-size: 10.5px;
		letter-spacing: 0.24em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}

	.desktop {
		position: relative;
		display: flex;
		align-items: center;
		gap: 2px;
	}
	.desktop > a,
	.has-mega > a {
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
	.caret {
		transition: transform 0.3s var(--ease);
	}
	.caret.open {
		transform: rotate(180deg);
	}

	.has-mega {
		position: relative;
	}
	.mega {
		position: absolute;
		top: calc(100% + 14px);
		left: 50%;
		width: min(640px, 80vw);
		display: grid;
		grid-template-columns: 1fr 1.25fr;
		gap: 8px;
		padding: 14px;
		border-radius: var(--radius-lg);
		background: rgb(250 248 245 / 0.92);
		backdrop-filter: blur(20px) saturate(1.4);
		-webkit-backdrop-filter: blur(20px) saturate(1.4);
		border: 1px solid var(--line);
		box-shadow: var(--shadow-float);
		opacity: 0;
		visibility: hidden;
		transform: translate(-50%, -8px) scale(0.98);
		transform-origin: top center;
		transition:
			opacity 0.3s var(--ease),
			transform 0.4s var(--ease),
			visibility 0.3s;
	}
	.mega::before {
		/* мост, за да не се затваря при движение на мишката */
		content: '';
		position: absolute;
		inset: -16px 0 auto 0;
		height: 16px;
	}
	.mega.open {
		opacity: 1;
		visibility: visible;
		transform: translate(-50%, 0) scale(1);
	}
	.mega-col {
		display: flex;
		flex-direction: column;
		padding: 8px;
	}
	.mega-col--map {
		border-left: 1px solid var(--line);
		padding-left: 16px;
	}
	.mega-title {
		margin: 4px 12px 8px;
		font-size: 11px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	.mega-link,
	.mega-sec {
		position: relative;
		display: flex;
		align-items: center;
		gap: 12px;
		text-decoration: none;
		border-radius: 10px;
		padding: 9px 12px;
		color: var(--ink);
		transition: background 0.3s var(--ease);
	}
	/* тънка синя черта отляво, която „израства“ при посочване */
	.mega-link::before,
	.mega-sec::before {
		content: '';
		position: absolute;
		left: 0;
		top: 10px;
		bottom: 10px;
		width: 2px;
		border-radius: 2px;
		background: var(--sea);
		transform: scaleY(0);
		transition: transform 0.35s var(--ease);
	}
	.mega-link:hover,
	.mega-sec:hover,
	.mega-link:focus-visible,
	.mega-sec:focus-visible {
		background: rgb(42 111 151 / 0.05);
	}
	.mega-link:hover::before,
	.mega-sec:hover::before,
	.mega-link:focus-visible::before,
	.mega-sec:focus-visible::before {
		transform: scaleY(1);
	}
	.txt {
		flex: 1;
		display: flex;
		flex-direction: column;
		line-height: 1.3;
		transition: transform 0.35s var(--ease);
	}
	.lbl {
		font-weight: 500;
		font-size: 15px;
		transition: color 0.2s;
	}
	.mega-link small {
		font-size: 12.5px;
		color: var(--ink-soft);
	}
	.go {
		color: var(--sea);
		font-size: 15px;
		opacity: 0;
		transform: translateX(-6px);
		transition: opacity 0.25s, transform 0.35s var(--ease);
	}
	.mega-link:hover .go,
	.mega-sec:hover .go,
	.mega-link:focus-visible .go,
	.mega-sec:focus-visible .go {
		opacity: 1;
		transform: none;
	}
	.mega-link:hover .txt,
	.mega-sec:hover .sec-name {
		transform: translateX(4px);
	}
	.mega-link:hover .lbl,
	.mega-sec:hover .sec-name {
		color: var(--sea);
	}
	.mega-sec {
		align-items: baseline;
		font-size: 14.5px;
		line-height: 1.35;
	}
	.mega-sec .go {
		align-self: center;
	}
	.roman {
		font-family: var(--serif);
		font-size: 22px;
		font-weight: 600;
		color: var(--sea);
		width: 30px;
		flex-shrink: 0;
	}
	.sec-name {
		flex: 1;
		transition: transform 0.35s var(--ease), color 0.2s;
	}
	.pts {
		font-size: 12px;
		color: var(--ink-soft);
		white-space: nowrap;
		transition: opacity 0.2s;
	}
	.mega-sec:hover .pts {
		opacity: 0.6;
	}
	.mega-all {
		margin: 10px 12px 4px;
		font-size: 14px;
		font-weight: 500;
		text-decoration: none;
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
		.role {
			display: none;
		}
		.name {
			font-size: 15px;
			letter-spacing: 0.03em;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.mono {
			width: 36px;
			height: 36px;
			font-size: 15px;
		}
	}
	@media (min-width: 901px) {
		.overlay {
			display: none;
		}
	}
</style>
