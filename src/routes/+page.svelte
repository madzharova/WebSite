<script>
	import { base } from '$app/paths';
	import { reveal } from '$lib/actions/reveal.js';
	import { resources } from '$lib/content.js';
	import ResourceCard from '$lib/components/ResourceCard.svelte';
	import { subjectPages, bridge } from '$lib/data/subjects.js';

	const doors = Object.values(subjectPages).map((S) => ({
		...S,
		own: resources.filter((r) => r.subject === S.key)
	}));
	const shared = resources.filter((r) => r.subject === 'bel-fr');
	let hover = $state(null);

	const latest = resources.slice(0, 3);



	const paths = [
		{
			n: '01',
			href: `${base}/praktiki/`,
			title: 'Практики',
			text: 'Как работя в час: проблем → решение → резултат. Кратки и честни истории от класната стая.',
			cta: 'Вижте практиките'
		},
		{
			n: '02',
			href: `${base}/portfolio/`,
			title: 'Портфолио',
			text: 'Професионалното ми портфолио, подредено по 25-те критерия на атестационната карта – с доказателства към всеки.',
			cta: 'Отворете портфолиото'
		},
		{
			n: '03',
			href: `${base}/resursi/`,
			title: 'Всички ресурси',
			text: 'Цялата библиотека на едно място – с филтри по предмет, вид и клас.',
			cta: 'Към библиотеката'
		}
	];

</script>

<svelte:head>
	<title>Маргарита Маджарова · Уроци, ресурси и портфолио</title>
	<meta name="description" content="Интерактивни уроци, игри и ресурси по български език, литература и френски език. Професионално портфолио на Маргарита Маджарова." />
</svelte:head>

<!-- ───── Hero ───── -->
<section class="hero">
	<div class="wrap hero-grid">
		<div class="hero-text">
			<p class="eyebrow" use:reveal>Учител · БЕЛ и френски език · Пловдив</p>
			<h1 use:reveal={{ delay: 80 }}>Интерактивни уроци и&nbsp;ресурси <em>за&nbsp;учители</em></h1>
			<p class="motto" use:reveal={{ delay: 160 }}>
				<span lang="bg">Уча се, като живея.</span>
				<span lang="fr">J’apprends en vivant.</span>
			</p>
			<p class="lead" use:reveal={{ delay: 220 }}>
				Създавам безплатни игри, упражнения и уроци по български език, литература и френски език. Тук е и професионалното ми портфолио.
			</p>
			<div class="ctas" use:reveal={{ delay: 300 }}>
				<a class="btn" href="#predmeti">Ресурси <span class="arrow">↓</span></a>
				<a class="btn btn--ghost" href="{base}/portfolio/">Портфолио</a>
			</div>
		</div>

		<div class="hero-visual" use:reveal={{ delay: 200 }}>
			<div class="frame" aria-hidden="true"></div>
			<img
				class="photo"
				src="{base}/img/margarita-900.webp"
				srcset="{base}/img/margarita-560.webp 560w, {base}/img/margarita-900.webp 900w"
				sizes="(max-width: 900px) 70vw, 360px"
				alt="Маргарита Маджарова в класната стая, зад нея – табло за Деня на Франкофонията и урок по френски на дъската"
				width="900"
				height="1125"
			/>
			{#if resources[0]}
				<a class="float-card" href="{base}/resursi/{resources[0].slug}/">
					<span class="fc-k">Ново</span>
					<span class="fc-t">{resources[0].title}</span>
				</a>
			{/if}
		</div>
	</div>
</section>



<!-- ───── Двата предмета ───── -->
<section class="section doors-sec" id="predmeti" aria-labelledby="predmeti-h">
	<div class="wrap">
		<p class="eyebrow" use:reveal>Ресурси</p>
		<h2 id="predmeti-h" use:reveal={{ delay: 60 }}>Два предмета, два свята</h2>
		<div class="doors" class:has-hover={hover !== null}>
			{#each doors as d, i}
				<a
					href={d.href}
					class="door"
					class:active={hover === i}
					style="--accent: {d.accent}"
					onpointerenter={() => (hover = i)}
					onpointerleave={() => (hover = null)}
					onfocus={() => (hover = i)}
					onblur={() => (hover = null)}
					use:reveal={{ delay: i * 120 }}
				>
					<span class="dmark" aria-hidden="true">{d.mark}</span>
					<span class="dfull">{d.full}</span>
					<span class="dname" lang={d.lang}>{d.name}</span>
					<span class="dtag">{d.tagline}</span>
					<ul class="dtopics" lang={d.lang}>
						{#each d.topics as t}<li>{t.label}</li>{/each}
					</ul>
					<span class="dfoot">
						<span>{d.own.length} {d.own.length === 1 ? 'ресурс' : 'ресурса'}</span>
						<span class="darr" aria-hidden="true">→</span>
					</span>
				</a>
			{/each}
			{#if shared.length}
				<a class="bridge-pill" href="{base}/balgarski/#binarni" use:reveal={{ delay: 260 }}>
					{bridge.name}
				</a>
			{/if}
		</div>
	</div>
</section>

<!-- ───── Нови ресурси ───── -->
<section class="section section--paper" id="novi" aria-labelledby="novi-h">
	<div class="wrap">
		<div class="head">
			<div>
				<p class="eyebrow" use:reveal>Библиотека</p>
				<h2 id="novi-h" use:reveal={{ delay: 60 }}>Нови ресурси</h2>
			</div>
			<a href="{base}/resursi/" class="more" use:reveal>Всички ресурси <span>→</span></a>
		</div>
		<div class="cards">
			{#each latest as r, i}
				<div use:reveal={{ delay: i * 90 }}><ResourceCard {r} /></div>
			{/each}
		</div>
	</div>
</section>

<!-- ───── Три пътя (разгъващи се редове) ───── -->
<section class="section" aria-labelledby="paths-h">
	<div class="wrap">
		<p class="eyebrow" use:reveal>Какво ще намерите</p>
		<h2 id="paths-h" class="visually-hidden">Раздели на сайта</h2>
		<ol class="paths">
			{#each paths as p, i}
				<li use:reveal={{ delay: i * 80 }}>
					<a href={p.href}>
						<span class="pn">{p.n}</span>
						<span class="pt">{p.title}</span>
						<span class="pa" aria-hidden="true">→</span>
					</a>
					<div class="pbody">
						<div>
							<p>{p.text}</p>
							<a href={p.href} class="plink">{p.cta}</a>
						</div>
					</div>
				</li>
			{/each}
		</ol>
	</div>
</section>


<!-- ───── Философия ───── -->
<section class="section quote-sec">
	<div class="wrap narrow">
		<p class="eyebrow" use:reveal>Педагогическа философия</p>
		<blockquote use:reveal={{ delay: 80 }}>
			Образованието трябва да отговаря на нуждите на учениците. Малките стъпки, последователността и дисциплината подобряват резултатите.
		</blockquote>
		<a href="{base}/portfolio/filosofia/" class="more" use:reveal={{ delay: 140 }}>Прочетете повече <span>→</span></a>
	</div>
</section>

<style>
	/* Hero */
	.hero {
		position: relative;
		min-height: min(100svh, 920px);
		display: flex;
		align-items: center;
		padding: 140px 0 90px;
		overflow: hidden;
		background:
			radial-gradient(50% 60% at 85% 20%, rgb(228 238 244 / 0.9), transparent 70%),
			radial-gradient(40% 50% at 5% 90%, rgb(240 236 225 / 0.9), transparent 70%),
			var(--bg);
	}
	.hero-grid {
		display: grid;
		grid-template-columns: 1.25fr 1fr;
		gap: clamp(40px, 6vw, 96px);
		align-items: center;
	}
	h1 {
		margin-top: 22px;
		font-weight: 500;
	}
	h1 em {
		font-style: italic;
		color: var(--ink);
		font-weight: 500;
	}
	.motto {
		display: flex;
		flex-wrap: wrap;
		gap: 0 0.6em;
		margin: 22px 0 20px;
		font-family: var(--serif);
		font-style: italic;
		font-size: 24px;
		line-height: 1.3;
		color: var(--coral);
	}
	.motto span[lang='fr'] {
		color: var(--ink-soft);
	}
	.ctas {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		margin-top: 34px;
	}

	.hero-visual {
		position: relative;
		justify-self: center;
		width: min(360px, 80vw);
		aspect-ratio: 4 / 5;
	}
	.photo {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: 50% 30%;
		border-radius: 200px 200px var(--radius-lg) var(--radius-lg);
		background-color: var(--paper);
	}
	.frame {
		position: absolute;
		inset: 0;
		translate: 18px 18px;
		border: 1px solid var(--sea);
		border-radius: 200px 200px var(--radius-lg) var(--radius-lg);
		opacity: 0.5;
		transition: translate 0.8s var(--ease);
	}
	.hero-visual:hover .frame {
		translate: 10px 10px;
	}
	.float-card {
		position: absolute;
		left: -48px;
		bottom: 36px;
		display: flex;
		flex-direction: column;
		gap: 2px;
		max-width: 240px;
		padding: 14px 18px;
		border-radius: 14px;
		background: rgb(250 248 245 / 0.78);
		backdrop-filter: blur(14px);
		-webkit-backdrop-filter: blur(14px);
		border: 1px solid rgb(227 221 208 / 0.9);
		box-shadow: var(--shadow-float);
		text-decoration: none;
		color: var(--ink);
	}
	.fc-k {
		font-size: 10.5px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--coral);
		font-weight: 600;
	}
	.fc-t {
		font-family: var(--serif);
		font-size: 19px;
		font-weight: 600;
		color: var(--sea);
		line-height: 1.2;
	}


	/* Двете врати */
	.doors-sec h2 {
		margin: 12px 0 40px;
	}
	.doors {
		position: relative;
		display: flex;
		gap: 20px;
		min-height: 460px;
	}
	.door {
		position: relative;
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 40px;
		border-radius: 24px;
		border: 1px solid var(--line);
		background:
			radial-gradient(80% 70% at 100% 0%, color-mix(in srgb, var(--accent) 10%, transparent), transparent 70%),
			var(--card);
		color: var(--ink);
		text-decoration: none;
		overflow: hidden;
		transition:
			flex-grow 0.8s var(--ease),
			box-shadow 0.6s var(--ease),
			border-color 0.4s;
	}
	.door.active {
		flex-grow: 1.45;
		border-color: color-mix(in srgb, var(--accent) 50%, transparent);
		box-shadow: var(--shadow-float);
		color: var(--ink);
	}
	.dmark {
		position: absolute;
		right: -10px;
		bottom: -40px;
		font-family: var(--serif);
		font-size: 260px;
		line-height: 1;
		color: transparent;
		-webkit-text-stroke: 1px color-mix(in srgb, var(--accent) 30%, transparent);
		transition: transform 0.9s var(--ease);
		pointer-events: none;
	}
	.door.active .dmark {
		transform: translate(-16px, -10px) rotate(-4deg);
	}
	.dfull {
		font-size: 12px;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	.dname {
		font-family: var(--serif);
		font-size: clamp(48px, 6vw, 76px);
		line-height: 1;
		color: var(--accent);
	}
	.dtag {
		max-width: 38ch;
		font-size: 15.5px;
		line-height: 1.6;
		color: var(--ink-soft);
	}
	.dtopics {
		list-style: none;
		margin: 12px 0 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		max-width: 440px;
	}
	.dtopics li {
		padding: 4px 12px;
		border-radius: 999px;
		border: 1px solid var(--line);
		background: rgb(255 255 255 / 0.7);
		font-size: 13px;
		opacity: 0.65;
		transform: translateY(6px);
		transition: opacity 0.5s var(--ease), transform 0.5s var(--ease);
	}
	.door.active .dtopics li,
	.doors:not(.has-hover) .dtopics li {
		opacity: 1;
		transform: none;
	}
	.door.active .dtopics li:nth-child(2) { transition-delay: 0.04s; }
	.door.active .dtopics li:nth-child(3) { transition-delay: 0.08s; }
	.door.active .dtopics li:nth-child(4) { transition-delay: 0.12s; }
	.door.active .dtopics li:nth-child(5) { transition-delay: 0.16s; }
	.dfoot {
		margin-top: auto;
		display: flex;
		align-items: center;
		gap: 14px;
		font-size: 14px;
		font-weight: 500;
	}
	.darr {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		border: 1px solid var(--accent);
		color: var(--accent);
		transition: background 0.4s, color 0.4s, transform 0.5s var(--ease);
	}
	.door.active .darr {
		background: var(--accent);
		color: #fff;
		transform: translateX(6px);
	}
	.bridge-pill {
		position: absolute;
		left: 50%;
		bottom: -22px;
		translate: -50% 0;
		z-index: 2;
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 10px 20px;
		border-radius: 999px;
		background: rgb(250 248 245 / 0.9);
		backdrop-filter: blur(10px);
		-webkit-backdrop-filter: blur(10px);
		border: 1px solid var(--line);
		box-shadow: var(--shadow-soft);
		font-size: 14px;
		font-weight: 500;
		color: var(--ink);
		text-decoration: none;
		white-space: nowrap;
		transition: transform 0.4s var(--ease);
	}
	.bridge-pill:hover {
		transform: translateY(-2px);
		color: var(--ink);
	}
	@media (max-width: 800px) {
		.doors {
			flex-direction: column;
			min-height: 0;
		}
		.door {
			min-height: 340px;
			padding: 30px;
		}
		.door.active {
			flex-grow: 1;
		}
		.dtopics li {
			opacity: 1;
			transform: none;
		}
		.bridge-pill {
			position: static;
			translate: none;
			align-self: center;
		}
	}

	/* Лента */

	/* Заглавни редове на секции */
	.head {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 40px;
	}
	.head h2 {
		margin-top: 12px;
	}
	.more {
		display: inline-flex;
		gap: 8px;
		font-weight: 500;
		text-decoration: none;
	}
	.more span {
		transition: transform 0.4s var(--ease);
	}
	.more:hover span {
		transform: translateX(4px);
	}
	.cards {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 24px;
	}

	/* Разгъващи се пътеки */
	.paths {
		list-style: none;
		margin: 28px 0 0;
		padding: 0;
		border-top: 1px solid var(--line-strong);
	}
	.paths li {
		border-bottom: 1px solid var(--line-strong);
	}
	.paths li > a {
		display: grid;
		grid-template-columns: 64px 1fr auto;
		align-items: baseline;
		gap: 16px;
		padding: 26px 0;
		text-decoration: none;
	}
	.pn {
		font-size: 13px;
		letter-spacing: 0.12em;
		color: var(--ink-soft);
	}
	.pt {
		font-family: var(--serif);
		font-size: clamp(38px, 6vw, 72px);
		line-height: 1;
		color: var(--sea);
		transition: transform 0.6s var(--ease), color 0.3s;
	}
	.pa {
		font-size: 28px;
		color: var(--sea);
		opacity: 0.4;
		transition: transform 0.5s var(--ease), opacity 0.3s;
	}
	.pbody > div {
		padding-left: 80px;
	}
	.pbody p {
		max-width: 56ch;
		color: var(--ink);
		margin-bottom: 10px;
	}
	.plink {
		display: inline-block;
		margin-bottom: 28px;
		font-weight: 500;
	}

	/* Числа */

	/* Цитат */
	.narrow {
		max-width: 860px;
	}
	blockquote {
		margin: 24px 0 28px;
		font-family: var(--serif);
		font-size: clamp(30px, 4vw, 46px);
		line-height: 1.22;
		color: var(--ink);
	}


	@media (max-width: 900px) {
		.hero-grid {
			grid-template-columns: 1fr;
		}
		.hero-visual {
			width: min(300px, 70vw);
			margin-top: 20px;
		}
		.float-card {
			left: -20px;
		}
		.cards {
			grid-template-columns: 1fr;
		}
		.pbody > div {
			padding-left: 0;
		}
		.paths li > a {
			grid-template-columns: 40px 1fr auto;
		}
	}
	@media (min-width: 901px) and (max-width: 1100px) {
		.cards {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
