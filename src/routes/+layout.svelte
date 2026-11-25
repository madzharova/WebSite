<script>
	import '@fontsource/cormorant-garamond/cyrillic-500.css';
	import '@fontsource/cormorant-garamond/cyrillic-600.css';
	import '@fontsource/cormorant-garamond/cyrillic-500-italic.css';
	import '@fontsource/cormorant-garamond/latin-500.css';
	import '@fontsource/cormorant-garamond/latin-600.css';
	import '@fontsource/cormorant-garamond/latin-500-italic.css';
	import '@fontsource-variable/manrope/wght.css';
	import '../app.css';

	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { SITE, SITE_NAME, SITE_DESC } from '$lib/data/site.js';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Search from '$lib/components/Search.svelte';
	import ScrollProgress from '$lib/components/ScrollProgress.svelte';

	let { children } = $props();
	let searchOpen = $state(false);

	// Плавен преход между страниците, където браузърът го поддържа
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="canonical" href="{SITE}{page.url.pathname}" />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="bg_BG" />
	<meta property="og:url" content="{SITE}{page.url.pathname}" />
	<meta property="og:description" content={SITE_DESC} />
	<meta name="twitter:card" content="summary" />
</svelte:head>

<a class="skip" href="#main">Към съдържанието</a>
<ScrollProgress />
<Nav onsearch={() => (searchOpen = true)} />
<Search bind:open={searchOpen} />

<div class="shell">
	<main id="main">
		{@render children()}
	</main>
	<Footer />
</div>

<style>
	.shell {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
	main {
		flex: 1;
	}
	.skip {
		position: fixed;
		top: -100px;
		left: 16px;
		z-index: 100;
		padding: 10px 16px;
		background: var(--sea);
		color: #fff;
		border-radius: 8px;
	}
	.skip:focus {
		top: 16px;
	}
</style>
