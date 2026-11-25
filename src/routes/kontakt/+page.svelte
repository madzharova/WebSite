<script>
	import { base } from '$app/paths';
	import { reveal } from '$lib/actions/reveal.js';
	import TitleLine from '$lib/components/TitleLine.svelte';
	import { contacts } from '$lib/data/contacts.js';
	import mailIcon from '$lib/icons/mail.svg?raw';
	import linkedinIcon from '$lib/icons/linkedin.svg?raw';
	import schoolIcon from '$lib/icons/school.svg?raw';
	import copyIcon from '$lib/icons/copy.svg?raw';
	import checkIcon from '$lib/icons/check.svg?raw';
	import arrowIcon from '$lib/icons/arrow-up-right.svg?raw';
	import bookIcon from '$lib/icons/book-2.svg?raw';
	import usersIcon from '$lib/icons/users.svg?raw';
	import messageIcon from '$lib/icons/message-circle.svg?raw';

	let copied = $state('');
	async function copy(v) {
		try {
			await navigator.clipboard.writeText(v);
			copied = v;
			setTimeout(() => (copied = ''), 2000);
		} catch {}
	}

	const topics = [
		{ icon: bookIcon, title: 'Ресурси', text: 'Въпрос за материал от сайта, идея как да се използва или предложение за нов.' },
		{ icon: usersIcon, title: 'Съвместни уроци', text: 'Бинарни и интегрирани уроци по български език и литература и френски език.' },
		{ icon: messageIcon, title: 'Обратна връзка', text: 'Забелязали сте грешка или имате идея как сайтът да стане по-полезен.' }
	];
</script>

<svelte:head><title>Контакт · Маргарита Маджарова</title></svelte:head>

<section class="contact">
	<div class="wrap layout">
		<header class="head">
			<p class="eyebrow" use:reveal>Контакт</p>
			<h1 use:reveal={{ delay: 80 }}>Да поговорим</h1>
			<TitleLine />
			<p class="lead" use:reveal={{ delay: 160 }}>
				Пишете ми за ресурсите, за съвместни уроци или просто за идея. Ще се радвам на всяко писмо от колега.
			</p>
		</header>

		<div class="intro">
			<ul class="topics">
				{#each topics as t, i}
					<li use:reveal={{ delay: 200 + i * 80 }}>
						<span class="ti" aria-hidden="true">{@html t.icon}</span>
						<div>
							<p class="tt">{t.title}</p>
							<p class="tx">{t.text}</p>
						</div>
					</li>
				{/each}
			</ul>
		</div>

		<div class="card" use:reveal={{ delay: 120 }}>
			<figure class="who">
				<img src="{base}/img/margarita-560.webp" alt="Маргарита Маджарова" width="72" height="72" />
				<figcaption>
					<strong>Маргарита Маджарова</strong>
					<span>Учител по български език и литература и френски език</span>
				</figcaption>
			</figure>

			<ul class="list">
				{#each contacts.emails as e}
					<li>
						<span class="i" aria-hidden="true">{@html mailIcon}</span>
						<a class="val" href="mailto:{e.value}">{e.value.split('@')[0]}<wbr />@{e.value.split('@')[1]}</a>
						<button class="act" onclick={() => copy(e.value)} aria-label="Копирай {e.value}" title="Копирай">
							{@html copied === e.value ? checkIcon : copyIcon}
						</button>
					</li>
				{/each}
				<li>
					<span class="i" aria-hidden="true">{@html linkedinIcon}</span>
					<a class="val" href={contacts.linkedin} rel="noopener">LinkedIn</a>
					<a class="act" href={contacts.linkedin} rel="noopener" aria-label="Отвори LinkedIn" title="Отвори">{@html arrowIcon}</a>
				</li>
				<li>
					<span class="i" aria-hidden="true">{@html schoolIcon}</span>
					<a class="val" href={contacts.school.url} rel="noopener">{contacts.school.name}, {contacts.school.city}</a>
					<a class="act" href={contacts.school.url} rel="noopener" aria-label="Отвори сайта на училището" title="Отвори">{@html arrowIcon}</a>
				</li>
			</ul>

			<a class="btn" href="mailto:{contacts.emails[0].value}">Напишете ми</a>
			<p class="sr" aria-live="polite">{copied ? 'Имейлът е копиран' : ''}</p>
		</div>
	</div>
</section>

<style>
	.contact {
		padding: clamp(140px, 16vw, 190px) 0 clamp(72px, 9vw, 120px);
		background:
			radial-gradient(55% 70% at 95% 0%, rgb(228 238 244 / 0.7), transparent 70%),
			var(--bg);
	}
	.layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 520px);
		gap: 56px clamp(40px, 6vw, 96px);
		align-items: start;
	}
	h1 {
		margin: 18px 0 0;
		font-size: var(--h1-page);
	}
	.lead {
		margin: 0;
		max-width: 44ch;
		font-size: 19px;
		line-height: 1.6;
		color: var(--ink-soft);
	}
	.head {
		grid-column: 1 / -1;
	}
	.topics {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		border-top: 1px solid var(--line);
	}
	.topics li {
		display: grid;
		grid-template-columns: 40px 1fr;
		gap: 16px;
		padding: 20px 0;
		border-bottom: 1px solid var(--line);
	}
	.ti {
		color: var(--coral);
		padding-top: 2px;
	}
	.ti :global(svg) {
		width: 26px;
		height: 26px;
		stroke-width: 1.4;
	}
	.tt {
		margin: 0;
		font-family: var(--serif);
		font-size: 22px;
		font-weight: 600;
		color: var(--ink);
		line-height: 1.2;
	}
	.tx {
		margin: 4px 0 0;
		font-size: 15.5px;
		color: var(--ink-soft);
	}

	.card {
		position: sticky;
		top: 110px;
		display: flex;
		flex-direction: column;
		gap: 24px;
		padding: 32px;
		border: 1px solid var(--line);
		border-radius: var(--radius-lg);
		background: var(--card);
		box-shadow: var(--shadow-soft);
	}
	.who {
		display: flex;
		align-items: center;
		gap: 16px;
		margin: 0;
		padding-bottom: 24px;
		border-bottom: 1px solid var(--line);
	}
	.who img {
		width: 72px;
		height: 72px;
		border-radius: 50%;
		object-fit: cover;
		object-position: top;
		flex-shrink: 0;
	}
	.who strong {
		display: block;
		font-family: var(--serif);
		font-size: 24px;
		font-weight: 600;
		color: var(--sea);
		line-height: 1.15;
	}
	.who span {
		display: block;
		margin-top: 4px;
		font-size: 14px;
		color: var(--ink-soft);
	}
	.list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.list li {
		display: grid;
		grid-template-columns: 40px minmax(0, 1fr) 40px;
		align-items: center;
		gap: 12px;
		padding: 8px 8px 8px 0;
		border-radius: 12px;
		transition: background 0.2s;
	}
	.list li:hover {
		background: var(--bg);
	}
	.i {
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 1px solid var(--sea);
		color: var(--sea);
	}
	.i :global(svg) {
		width: 20px;
		height: 20px;
		stroke-width: 1.7;
	}
	.val {
		font-size: 16px;
		font-weight: 500;
		color: var(--ink);
		text-decoration: none;
		overflow-wrap: normal;
	}
	.val:hover {
		color: var(--sea);
	}
	.act {
		display: grid;
		place-items: center;
		width: 36px;
		height: 36px;
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: none;
		color: var(--ink-soft);
		cursor: pointer;
		transition: background 0.2s, color 0.2s;
	}
	.act:hover {
		background: var(--paper);
		color: var(--sea);
	}
	.act :global(svg) {
		width: 18px;
		height: 18px;
		stroke-width: 1.7;
	}
	.btn {
		align-self: stretch;
		justify-content: center;
		text-align: center;
	}
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		margin: 0;
	}
	@media (max-width: 900px) {
		.layout {
			grid-template-columns: 1fr;
		}
		.card {
			position: static;
			order: -1;
		}
		.head {
			order: -2;
		}
	}
	@media (max-width: 480px) {
		.card {
			padding: 22px 18px;
		}
		.val {
			font-size: 15px;
		}
		.list li {
			grid-template-columns: 34px minmax(0, 1fr) 34px;
			gap: 10px;
		}
		.i {
			width: 34px;
			height: 34px;
		}
	}
</style>
