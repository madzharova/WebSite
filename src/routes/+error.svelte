<script>
	import { page } from '$app/state';
</script>

<svelte:head><title>Страницата не е намерена</title></svelte:head>

<section class="err wrap">
	<p class="code">{page.status}</p>
	<h1>Тази страница я няма – или се е преместила.</h1>
	<p class="lead">Сайтът е обновен и някои адреси са променени.</p>
	<div class="ctas">
		<a class="btn" href="/">Към началото</a>
		<a class="btn btn--ghost" href="/resursi/">Ресурси</a>
		<a class="btn btn--ghost" href="/portfolio/">Портфолио</a>
	</div>
</section>

<style>
	.err {
		padding-top: 180px;
		padding-bottom: 120px;
	}
	.code {
		font-family: var(--serif);
		font-size: 140px;
		line-height: 1;
		color: var(--sea);
		opacity: 0.2;
		margin: 0;
	}
	h1 {
		font-size: clamp(34px, 4vw, 52px);
		max-width: 20ch;
	}
	.ctas {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 28px;
	}
</style>
