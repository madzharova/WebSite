<script>
	// Цял урок на проектор: етапи (въведение → връзки с други езици → новото → упражнение → рефлексия),
	// по един слайд на екран. Съдържанието е данни: $lib/data/lessons/*.json.
	// Употреба в .md:  <LessonSlides {lesson} {quiz} />  (quiz – за етапа с "quiz": true, формат като GrammarQuiz)
	// Клавиши (след клик в урока или на цял екран): ← → / PageUp PageDown, Space/Enter – отговорът, F – цял екран.
	import GrammarQuiz from './GrammarQuiz.svelte';

	let { lesson, quiz = null } = $props();

	// Плосък списък на слайдовете; етапът с упражнението е един „слайд“
	// svelte-ignore state_referenced_locally
	const flat = lesson.stages.flatMap((st, si) => (st.quiz ? [{ si, quiz: true }] : st.slides.map((s, k) => ({ si, k, ...s }))));
	const firstOf = (si) => flat.findIndex((x) => x.si === si);

	let i = $state(0);
	let shown = $state({});
	let active = $state(false);
	let full = $state(false);
	let root;

	let cur = $derived(flat[i]);
	let stage = $derived(lesson.stages[cur.si]);
	let inStage = $derived(flat.filter((x) => x.si === cur.si));
	let pos = $derived(inStage.indexOf(cur));

	const go = (n) => {
		if (n >= 0 && n < flat.length) i = n;
	};
	const reveal = () => {
		if (cur.answer) shown[i] = true;
	};

	function fs() {
		try {
			if (document.fullscreenElement) document.exitFullscreen();
			else root.requestFullscreen?.().catch(() => {});
		} catch (e) {}
	}
	function onkey(e) {
		if (!(active || full) || cur.quiz || e.ctrlKey || e.metaKey || e.altKey) return;
		const t = e.target;
		if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
		const k = e.key.toLowerCase();
		if (k === 'arrowright' || k === 'pagedown') go(i + 1);
		else if (k === 'arrowleft' || k === 'pageup') go(i - 1);
		else if (k === ' ' || k === 'enter') reveal();
		else if (k === 'f' || k === 'ф') fs();
		else if (k === 'escape') active = false;
		else return;
		e.preventDefault();
	}
</script>

<svelte:window onkeydown={onkey} onpointerdown={(e) => (active = root.contains(e.target))} />
<svelte:document onfullscreenchange={() => (full = document.fullscreenElement === root)} />

<div class="lesson" class:active class:full bind:this={root} role="region" aria-label={lesson.name}>
	<header>
		<nav class="stages" aria-label="Етапи на урока">
			{#each lesson.stages as st, si}
				<button class="st" class:on={si === cur.si} class:past={si < cur.si} onclick={() => go(firstOf(si))}>
					<span class="n">{si + 1}</span>
					<span class="lb"><b>{st.fr}</b><small>{st.bg}</small></span>
				</button>
			{/each}
		</nav>
		<button class="tab" onclick={fs}>{full ? 'Изход' : 'Цял екран'}</button>
	</header>

	<main class:q={cur.quiz}>
		{#if cur.quiz && quiz}
			<GrammarQuiz {quiz} bare />
		{:else}
			{#key i}
				<article class="slide">
					{#if cur.kick}<p class="kick">{cur.kick}</p>{/if}
					<h2>{@html cur.h}</h2>
					{#if cur.sub}<p class="sub">{@html cur.sub}</p>{/if}
					{#if cur.big}<p class="big">{@html cur.big}</p>{/if}
					{#if cur.html}<div class="body">{@html cur.html}</div>{/if}
					{#if cur.table}
						<table>
							<thead><tr>{#each cur.table.head as h}<th>{h}</th>{/each}</tr></thead>
							<tbody>
								{#each cur.table.rows as row}<tr>{#each row as c}<td>{@html c}</td>{/each}</tr>{/each}
							</tbody>
						</table>
					{/if}
					{#if cur.note}<p class="note">{@html cur.note}</p>{/if}
					{#if cur.ask}<p class="ask"><span class="qm" aria-hidden="true">?</span><span>{@html cur.ask}</span></p>{/if}
					{#if cur.answer}
						{#if shown[i]}
							<div class="answer">{@html cur.answer}</div>
						{:else}
							<button class="reveal" onclick={reveal}>Покажи отговора <kbd>Space</kbd></button>
						{/if}
					{/if}
				</article>
			{/key}
		{/if}
	</main>

	<footer>
		<button class="nav" onclick={() => go(i - 1)} disabled={i === 0}>← Назад</button>
		<div class="dots" aria-label="Слайдове в етапа">
			{#if !cur.quiz}
				{#each inStage as _, k}
					<button class="dot" aria-current={k === pos} aria-label="Слайд {k + 1}" onclick={() => go(firstOf(cur.si) + k)}></button>
				{/each}
				<span class="cnt">{pos + 1} / {inStage.length}</span>
			{:else}
				<span class="cnt">Упражнението има свои бутони за въпросите</span>
			{/if}
		</div>
		<button class="nav main" onclick={() => go(i + 1)} disabled={i === flat.length - 1}>Напред →</button>
	</footer>
</div>

<style>
	/* Цветовете и шрифтовете – като в GrammarQuiz (бледосиньо, синьото на сайта, корал); системни шрифтове. */
	.lesson {
		--bg: #f5f8fa;
		--card: #ffffff;
		--ink: #1f2430;
		--soft: #4a5060;
		--line: #d6e2ea;
		--c: #e4eef4;
		--l: #f7e9ea;
		--d: #2a6f97;
		--accent: #a95a61;
		--fs: clamp(16px, 1.3vw, 23px);
		display: grid;
		grid-template-rows: auto 1fr auto;
		height: min(86vh, 820px);
		min-height: 560px;
		margin: 8px 0 40px;
		background: var(--bg);
		color: var(--ink);
		border: 1.5px solid #c9d9e4;
		border-radius: 18px;
		overflow: hidden;
		font: var(--fs) / 1.45 'Segoe UI', 'Noto Sans', 'Helvetica Neue', Arial, sans-serif;
	}
	.lesson.active { box-shadow: 0 0 0 4px var(--l); }
	.lesson.full {
		--fs: clamp(18px, 1.75vw, 36px);
		height: 100vh;
		min-height: 0;
		margin: 0;
		border: 0;
		border-radius: 0;
	}
	.lesson :global(*) { box-sizing: border-box; }
	button { font: inherit; color: inherit; cursor: pointer; }
	button:disabled { opacity: 0.45; cursor: default; }
	button:focus-visible { outline: 4px solid var(--d); outline-offset: 3px; }

	header {
		display: flex;
		align-items: center;
		gap: 0.8em;
		padding: 0.5em 1.2em;
		background: var(--c);
		border-bottom: 2px solid var(--d);
	}
	.stages { display: flex; gap: 0.35em; flex: 1; overflow-x: auto; }
	.st {
		display: flex;
		align-items: center;
		gap: 0.5em;
		padding: 0.3em 0.8em 0.3em 0.35em;
		border: 2px solid transparent;
		border-radius: 999px;
		background: transparent;
		text-align: left;
		font-size: 0.72em;
		white-space: nowrap;
	}
	.st .n {
		flex: none;
		width: 1.9em;
		height: 1.9em;
		border-radius: 50%;
		display: grid;
		place-items: center;
		background: var(--card);
		color: var(--accent);
		font-weight: 800;
	}
	.st .lb { display: grid; line-height: 1.15; }
	.st small { color: var(--soft); font-size: 0.85em; }
	.st:hover { border-color: var(--d); }
	.st.past .n { background: var(--d); color: #fff; }
	.st.on { background: var(--card); border-color: var(--d); }
	.st.on .n { background: var(--accent); color: #fff; }
	.tab {
		flex: none;
		border: 2px solid var(--d);
		background: var(--card);
		border-radius: 999px;
		padding: 0.2em 0.9em;
		font-size: 0.75em;
		font-weight: 600;
	}

	main { overflow: auto; display: grid; padding: 1.4em 2em; }
	main.q { padding: 0; overflow: hidden; }
	.slide { margin: auto; width: min(100%, 52em); }
	.kick { margin: 0 0 0.3em; font-size: 0.8em; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent); }
	h2 { margin: 0 0 0.25em; font: 700 2em/1.15 Georgia, 'Times New Roman', serif; color: var(--d); text-wrap: balance; }
	.sub { margin: 0 0 1em; font-size: 1.1em; color: var(--soft); }
	.big {
		margin: 0.4em 0 0.8em;
		padding: 0.6em 0.9em;
		background: var(--card);
		border-left: 8px solid var(--c);
		border-radius: 8px;
		font: 1.45em/1.5 Georgia, 'Times New Roman', serif;
	}
	.body { font-size: 1.1em; }
	.body :global(ul), .body :global(ol) { margin: 0; padding-left: 1.2em; display: grid; gap: 0.45em; }
	.body :global(ul.check) { list-style: none; padding: 0; }
	.body :global(ul.check li)::before { content: '☐'; color: var(--d); margin-right: 0.5em; }
	.body :global(ul.n321) { list-style: none; padding: 0; }
	.body :global(ul.n321 b) {
		display: inline-grid;
		place-items: center;
		width: 1.7em;
		height: 1.7em;
		margin-right: 0.5em;
		border-radius: 50%;
		background: var(--l);
		color: var(--accent);
	}
	/* .slide пред селекторите – за да не важат общите стилове на .prose table (15px) */
	.slide table { width: 100%; border-collapse: separate; border-spacing: 0; margin: 0.3em 0 0.8em; font-size: 1.25em; line-height: 1.4; background: var(--card); border: 2px solid var(--line); border-radius: 12px; overflow: hidden; }
	.slide th { background: var(--c); color: var(--d); text-align: left; font-size: 0.75em; padding: 0.5em 0.9em; border: 0; }
	.slide td { padding: 0.45em 0.9em; border: 0; border-top: 1px solid var(--line); }
	.slide td :global(small) { color: var(--soft); font-size: 0.7em; margin-left: 0.2em; }
	.slide :global(b) { color: var(--accent); }
	h2 :global(i) { font-weight: 400; }
	.note { margin: 0.2em 0 0.8em; padding: 0.5em 0.8em; background: var(--l); border-left: 6px solid var(--accent); border-radius: 6px; }
	.ask { display: flex; gap: 0.6em; align-items: baseline; margin: 0.4em 0 0.6em; font-size: 1.1em; font-weight: 600; }
	.ask .qm {
		flex: none;
		display: grid;
		place-items: center;
		width: 1.6em;
		height: 1.6em;
		border-radius: 50%;
		background: var(--d);
		color: #fff;
		font-weight: 800;
	}
	.reveal { border: 2px dashed var(--d); background: var(--card); border-radius: 10px; padding: 0.4em 1em; font-weight: 700; color: var(--d); }
	.answer { padding: 0.6em 0.9em; background: #d8efdd; border-left: 6px solid #2e7d4f; border-radius: 8px; font-size: 1.05em; }
	.answer :global(ol) { margin: 0; padding-left: 1.2em; }
	kbd { display: inline-block; margin-left: 0.4em; border: 2px solid var(--line); border-bottom-width: 3px; border-radius: 6px; padding: 0 0.35em; font: inherit; font-size: 0.75em; background: #fff; color: var(--ink); }

	footer {
		display: flex;
		align-items: center;
		gap: 0.8em;
		padding: 0.5em 1.2em;
		border-top: 2px solid var(--line);
		background: var(--card);
		font-size: 0.8em;
	}
	.nav { border: 2px solid var(--d); background: var(--card); border-radius: 10px; padding: 0.25em 0.9em; font-weight: 700; min-height: 44px; }
	.nav.main { background: var(--d); color: #fff; }
	.dots { display: flex; gap: 0.4em; align-items: center; margin: 0 auto; }
	.dot { width: 0.9em; height: 0.9em; padding: 0; border-radius: 50%; border: 2px solid var(--d); background: var(--card); }
	.dot[aria-current='true'] { background: var(--d); }
	.cnt { margin-left: 0.4em; color: var(--soft); }

	@media (max-width: 760px) {
		.lesson { height: auto; min-height: 0; }
		main { padding: 1em; }
		.st .lb small { display: none; }
		h2 { font-size: 1.6em; }
	}
	@media (prefers-reduced-motion: no-preference) {
		.slide { animation: in 0.25s ease-out; }
		@keyframes in { from { opacity: 0; transform: translateY(6px); } }
	}
</style>
