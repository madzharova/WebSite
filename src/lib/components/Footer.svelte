<script>
	import { portfolioMeta } from '$lib/data/portfolio.js';
	import { contacts } from '$lib/data/contacts.js';
	import linkedinIcon from '$lib/icons/linkedin-filled.svg?raw';
	import copyIcon from '$lib/icons/copy.svg?raw';
	import checkIcon from '$lib/icons/check.svg?raw';

	let copied = $state('');
	let timer;
	async function copy(v) {
		try {
			await navigator.clipboard.writeText(v);
		} catch {
			return;
		}
		copied = v;
		clearTimeout(timer);
		timer = setTimeout(() => (copied = ''), 2000);
	}

	const projects = [
		{ href: 'https://madzharova.github.io/konvertor/', label: 'Конвертор на точки в оценка' },
		{ href: 'https://litero.cc/', label: 'litero' },
		{ href: 'https://v2.e-class.live/', label: 'e-class.live' }
	];
	const useful = [
		{ href: 'https://ibl.bas.bg/rbe/', label: 'Речник на българския език' },
		{ href: 'https://beron.mon.bg/', label: 'БЕРОН – правописен речник' },
		{ href: 'https://dictionnaire.lerobert.com/', label: 'Le Robert – dictionnaire', lang: 'fr' },
		{ href: 'https://www.larousse.fr/dictionnaires/francais', label: 'Larousse – dictionnaire', lang: 'fr' },
		{ href: 'https://apprendre.tv5monde.com/fr', label: 'TV5Monde – Apprendre le français', lang: 'fr' },
		{ href: 'https://www.pgmtplovdiv.info/', label: 'ПГМТ „Проф. Цв. Лазаров“' }
	];
	const year = new Date().getFullYear();
</script>

<footer class="footer">
	<div class="wrap">
		<div class="top">
			<div class="brand">
				<p class="motto">Уча се, като живея.<br /><em>Живея, като се уча.</em></p>
				<div class="contact">
					{#each contacts.emails as e}
						<button class="mail" class:done={copied === e.value} onclick={() => copy(e.value)} title="Копирай имейла">
							<span class="mv">{copied === e.value ? 'Копирано в клипборда' : e.value}</span>
							<span class="mi" aria-hidden="true">{@html copied === e.value ? checkIcon : copyIcon}</span>
						</button>
					{/each}
					<span class="sr" aria-live="polite">{copied ? 'Имейлът е копиран' : ''}</span>
					<a class="li" href={contacts.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Margarita Madzharova в LinkedIn"><span class="lii" aria-hidden="true">{@html linkedinIcon}</span><span lang="en">Margarita Madzharova</span></a>
				</div>
			</div>
			<nav aria-label="Навигация">
				<p class="h">Навигация</p>
				<a href="/balgarski/">Български</a>
				<a href="/francais/" lang="fr">Français</a>
				<a href="/resursi/">Всички ресурси</a>
				<a href="/praktiki/">Практики</a>
				<a href="/portfolio/">Портфолио</a>
				<a href="/kontakt/">Контакт</a>
			</nav>
			<nav aria-label="Проекти и партньори">
				<p class="h">Проекти и партньори</p>
				{#each projects as pr}
					<a href={pr.href} target="_blank" rel="noopener noreferrer">{pr.label}</a>
				{/each}
			</nav>
			<nav aria-label="Полезни връзки">
				<p class="h">Полезни връзки</p>
				{#each useful as u}
					<a href={u.href} target="_blank" rel="noopener noreferrer" lang={u.lang}>{u.label}</a>
				{/each}
			</nav>
		</div>
		<hr class="hairline" />
		<div class="bottom">
			<span>© {year} Маргарита Маджарова</span>
			<span>Последна актуализация на портфолиото: {portfolioMeta.lastUpdated.split('-').reverse().join('.')}</span>
		</div>
	</div>
</footer>

<style>
	.footer {
		background: var(--bg);
		border-top: 1px solid var(--line);
		padding: 56px 0 28px;
		margin-top: auto;
	}
	.top {
		display: grid;
		grid-template-columns: 1.4fr 0.65fr 1fr 1.15fr;
		gap: 40px;
		padding-bottom: 36px;
	}
	.top > * {
		display: flex;
		flex-direction: column;
		gap: 8px;
		font-size: 15px;
		min-width: 0;
	}
	.brand {
		gap: 22px;
	}
	.motto {
		font-family: var(--serif);
		font-size: 30px;
		line-height: 1.15;
		color: var(--sea);
		margin: 0;
		white-space: nowrap;
	}
	.motto em {
		color: var(--coral);
	}
	.contact {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.top a.li {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin-top: 4px;
	}
	.lii {
		display: inline-flex;
		color: #0a66c2;
	}
	.lii :global(svg) {
		width: 22px;
		height: 22px;
	}
	.top a {
		color: var(--ink);
		text-decoration: none;
		white-space: nowrap;
		width: fit-content;
		background: linear-gradient(var(--sea), var(--sea)) 0 100% / 0 1px no-repeat;
		transition: background-size 0.4s var(--ease), color 0.2s;
	}
	.top a:hover {
		color: var(--sea);
		background-size: 100% 1px;
	}
	.mail {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		width: fit-content;
		padding: 0;
		border: 0;
		background: none;
		font: inherit;
		font-size: 15px;
		color: var(--ink);
		cursor: pointer;
		text-align: left;
	}
	.mv {
		white-space: nowrap;
		background: linear-gradient(var(--sea), var(--sea)) 0 100% / 0 1px no-repeat;
		transition: background-size 0.4s var(--ease), color 0.2s;
	}
	.mail:hover .mv {
		color: var(--sea);
		background-size: 100% 1px;
	}
	.mail.done .mv {
		color: var(--sea);
		font-weight: 500;
	}
	.mi {
		display: inline-flex;
		flex-shrink: 0;
		color: var(--ink-soft);
		opacity: 0.6;
		transition: opacity 0.2s, color 0.2s;
	}
	.mail:hover .mi,
	.mail.done .mi {
		opacity: 1;
		color: var(--sea);
	}
	.mi :global(svg) {
		width: 15px;
		height: 15px;
		stroke-width: 1.8;
	}
	.mail:focus-visible {
		outline: 2px solid var(--sea);
		outline-offset: 3px;
		border-radius: 4px;
	}
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
	}
	.h {
		margin: 0 0 6px;
		font-size: 11px;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	.bottom {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 12px;
		padding-top: 20px;
		font-size: 13px;
		color: var(--ink-soft);
	}
	@media (max-width: 960px) {
		.top {
			grid-template-columns: 1fr 1fr;
			gap: 36px 32px;
		}
		.brand {
			grid-column: 1 / -1;
		}
	}
	@media (max-width: 560px) {
		.top {
			grid-template-columns: 1fr;
		}
		.motto {
			font-size: 28px;
		}
		.top a,
		.mv {
			white-space: normal;
			overflow-wrap: anywhere;
		}
	}
</style>
