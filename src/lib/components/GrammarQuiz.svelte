<script>
	// Интерактивен тест по езикова норма – по един въпрос на екран, разбор вдясно.
	// Употреба в .md файл:
	//   import quiz from '$lib/data/quizzes/broyna-forma.json';
	//   <GrammarQuiz {quiz} />
	// Формат на задачите: виж „Указания-интерактивни-тестове.md“, т. 4.
	// Клавиши (след клик в теста или на цял екран): 1–4 / А–Г, Space/Enter, ← →, R, F, ?
	let { quiz, theme = 'peach' } = $props();

	const L = ['А', 'Б', 'В', 'Г'];
	const KEY = { 1: 0, 2: 1, 3: 2, 4: 3, а: 0, б: 1, в: 2, г: 3, a: 0, b: 1, v: 2, w: 2, g: 3 };

	let qi = $state(0);
	// Състоянието се създава веднъж за подадения тест – това е умишлено.
	// svelte-ignore state_referenced_locally
	let st = $state(quiz.qs.map(() => ({ tried: [], done: false })));
	let active = $state(false);
	let full = $state(false);
	let help = $state(false);
	let root;

	let q = $derived(quiz.qs[qi]);
	let s = $derived(st[qi]);

	const split = (x) => ({ k: x.slice(0, 1), tx: x.slice(2) });

	function go(i) {
		if (i >= 0 && i < quiz.qs.length) qi = i;
	}
	function pick(i) {
		if (s.done || i > 3) return;
		if (i === q.a) s.done = true;
		else if (!s.tried.includes(i)) s.tried.push(i);
	}
	const reveal = () => (s.done = true);
	const reset = () => (st[qi] = { tried: [], done: false });

	function fs() {
		try {
			if (document.fullscreenElement) document.exitFullscreen();
			else root.requestFullscreen?.().catch(() => {});
		} catch (e) {}
	}

	function onkey(e) {
		if (!(active || full) || e.ctrlKey || e.metaKey || e.altKey) return;
		const t = e.target;
		if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
		const k = e.key.toLowerCase();
		if (help) {
			if (k === 'escape' || k === '?') help = false;
			return;
		}
		if (k in KEY) pick(KEY[k]);
		else if (k === ' ' || k === 'enter') reveal();
		else if (k === 'arrowright' || k === 'pagedown') go(qi + 1);
		else if (k === 'arrowleft' || k === 'pageup') go(qi - 1);
		else if (k === 'r' || k === 'р' || k === 'к') reset();
		else if (k === 'f' || k === 'ф') fs();
		else if (k === '?') help = true;
		else if (k === 'escape') active = false;
		else return;
		e.preventDefault();
	}
	function ondown(e) {
		active = root.contains(e.target);
	}
</script>

<svelte:window onkeydown={onkey} onpointerdown={ondown} />
<svelte:document onfullscreenchange={() => (full = document.fullscreenElement === root)} />

<div class="quiz {theme}" class:active class:full bind:this={root} role="region" aria-label={quiz.name}>
	<header>
		<p class="title">{quiz.name}</p>
		<span class="kbd-state" title="Клавишите работят, когато тестът е избран">{active || full ? 'клавишите са включени' : 'кликнете в теста за клавишите'}</span>
		<button class="tab" onclick={() => (help = true)} aria-label="Клавиши">Клавиши ?</button>
		<button class="tab" onclick={fs}>{full ? 'Изход от цял екран' : 'Цял екран'}</button>
	</header>

	<main>
		<section class="col">
			<p class="meta">Въпрос {qi + 1} от {quiz.qs.length}</p>
			<h2 class="q">{qi + 1}. {q.q}</h2>
			{#if q.p}<div class="p">{@html q.p}</div>{/if}
			<div class="opts">
				{#each q.o as o, i}
					{@const yes = s.done && i === q.a}
					{@const no = s.tried.includes(i) && i !== q.a}
					<button class="opt" class:yes class:no onclick={() => pick(i)}>
						<span class="k">{L[i]}</span>
						<span class="tx">{o}</span>
						{#if yes}<span class="st">верен отговор</span>{:else if no}<span class="st">грешен отговор</span>{/if}
					</button>
				{/each}
			</div>
		</section>

		<section class="col">
			<div class="panel" aria-live="polite">
				{#if s.done}
					<p class="verdict good">Верен отговор: {L[q.a]}) {q.o[q.a]}</p>
					<div class="rule">
						<p class="h">Правило</p>
						<p>{@html q.r}</p>
					</div>
					<p class="meta">Разбор</p>
					<ul class="why">
						{#each q.f ?? q.w as line, i}
							{@const x = split(line)}
							<li class:ans={!q.f && i === q.a}>
								<span class="k">{q.f ? '•' : L[i] + ')'}</span>
								<span><span class="chip {x.k}">{x.k === 'e' ? 'грешка' : 'правилно'}</span>{@html x.tx}</span>
							</li>
						{/each}
					</ul>
				{:else if s.tried.length}
					<p class="verdict bad">Грешен отговор — опитайте пак.</p>
					{#each s.tried as i}
						<div class="tried">
							<b>{L[i]}) {q.o[i]}</b><br />
							{#if q.f}{q.miss ?? 'Не е този брой грешки. Проверете отново всяка форма.'}{:else}{@html split(q.w[i]).tx}{/if}
						</div>
					{/each}
					<p class="hint"><b>Space</b> — показва верния отговор и разбора.</p>
				{:else}
					<p class="hint">Изберете отговор с клик или с клавиш <b>1–4</b> (<b>А–Г</b>).</p>
					<p class="hint">При грешен избор ще видите защо не е верен и можете да опитате отново. <b>Space</b> показва отговора директно.</p>
					<p class="hint"><b>←</b> <b>→</b> — предишен/следващ въпрос · <b>?</b> — всички клавиши</p>
				{/if}
			</div>
		</section>
	</main>

	<footer>
		<button class="nav" onclick={() => go(qi - 1)} disabled={qi === 0}>← Предишен</button>
		<div class="dots">
			{#each quiz.qs as _, i}
				<button class="dot" class:done={st[i].done} aria-current={i === qi} aria-label="Въпрос {i + 1}" onclick={() => go(i)}>{i + 1}</button>
			{/each}
		</div>
		<button class="nav" onclick={reveal}>Покажи отговора</button>
		<button class="nav main" onclick={() => go(qi + 1)} disabled={qi === quiz.qs.length - 1}>Следващ →</button>
	</footer>

	{#if help}
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<div class="help" role="dialog" aria-modal="true" aria-label="Клавиши" tabindex="-1" onclick={(e) => e.target === e.currentTarget && (help = false)}>
			<div class="box">
				<h2>Управление от лаптопа</h2>
				<table>
					<tbody>
						<tr><td><kbd>1</kbd>–<kbd>4</kbd> или <kbd>А</kbd>–<kbd>Г</kbd></td><td>избира отговор (или клик върху картата)</td></tr>
						<tr><td><kbd>Space</kbd> / <kbd>Enter</kbd></td><td>показва верния отговор и пълния разбор</td></tr>
						<tr><td><kbd>→</kbd> <kbd>←</kbd></td><td>следващ / предишен въпрос (работи и с дистанционно за презентации)</td></tr>
						<tr><td><kbd>R</kbd></td><td>изчиства въпроса, за да се реши отначало</td></tr>
						<tr><td><kbd>F</kbd></td><td>цял екран</td></tr>
						<tr><td><kbd>?</kbd> / <kbd>Esc</kbd></td><td>отваря / затваря този прозорец</td></tr>
					</tbody>
				</table>
				<p class="small">Клавишите работят, след като кликнете в теста. Грешен избор се оцветява и показва обяснение защо не е верен — класът може да опита отново.</p>
				<button class="nav main" onclick={() => (help = false)}>Затвори</button>
			</div>
		</div>
	{/if}
</div>

<style>
	/* Видът следва образеца „Граматична-норма-упражнения.html“; системни шрифтове – работи офлайн */
	.quiz {
		--bg: #f7f5f0;
		--card: #ffffff;
		--ink: #1f2430;
		--soft: #4a5060;
		--line: #ddd8ce;
		--ok: #2e7d4f;
		--okbg: #d8efdd;
		--no: #a8323f;
		--nobg: #f7d9dc;
		--c: #f6d9c6;
		--l: #fbede3;
		--d: #8a4a26;
		--fs: clamp(16px, 1.15vw, 21px);
		position: relative;
		display: grid;
		grid-template-rows: auto 1fr auto;
		height: min(86vh, 820px);
		min-height: 560px;
		margin: 8px 0 40px;
		background: var(--bg);
		color: var(--ink);
		border: 2px solid var(--d);
		border-radius: 16px;
		overflow: hidden;
		font: var(--fs) / 1.45 'Segoe UI', 'Noto Sans', 'Helvetica Neue', Arial, sans-serif;
	}
	.quiz.lilac { --c: #dcd6f0; --l: #eeebf8; --d: #4e4380; }
	.quiz.green { --c: #cfe3d4; --l: #e7f1ea; --d: #34604a; }
	.quiz.blue { --c: #cde0ee; --l: #e6f0f7; --d: #2a5878; }
	.quiz.active { box-shadow: 0 0 0 4px var(--l); }
	.quiz.full {
		--fs: clamp(18px, 1.5vw, 30px);
		height: 100vh;
		min-height: 0;
		margin: 0;
		border: 0;
		border-radius: 0;
	}
	.quiz :global(*) { box-sizing: border-box; min-width: 0; }
	button { font: inherit; color: inherit; cursor: pointer; }
	button:disabled { opacity: 0.45; cursor: default; }
	button:focus-visible { outline: 4px solid var(--d); outline-offset: 3px; }
	header {
		display: flex;
		align-items: center;
		gap: 0.8em;
		flex-wrap: wrap;
		padding: 0.55em 1.6em;
		background: var(--c);
		border-bottom: 2px solid var(--d);
	}
	.title { margin: 0 auto 0 0; font: 700 1em/1.2 Georgia, 'Times New Roman', serif; }
	.kbd-state { font-size: 0.7em; color: var(--soft); }
	.tab {
		border: 2px solid var(--d);
		background: var(--card);
		border-radius: 999px;
		padding: 0.2em 0.9em;
		font-size: 0.8em;
		font-weight: 600;
	}
	main {
		display: grid;
		grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
		gap: 1.6em;
		padding: 1.2em 1.6em;
		overflow: hidden;
	}
	.col { overflow: auto; padding-right: 0.3em; }
	.meta { font-size: 0.72em; font-weight: 700; color: var(--d); margin: 0 0 0.3em; }
	.q { font: 700 1.15em/1.3 Georgia, 'Times New Roman', serif; margin: 0 0 0.6em; text-wrap: balance; color: var(--ink); }
	.p { background: var(--card); border-left: 6px solid var(--c); padding: 0.6em 0.9em; margin: 0 0 0.8em; border-radius: 6px; }
	.p :global(u) { text-decoration-thickness: 2px; text-underline-offset: 4px; }
	.opts { display: grid; gap: 0.5em; }
	.opt {
		display: flex;
		gap: 0.7em;
		align-items: flex-start;
		text-align: left;
		width: 100%;
		background: var(--card);
		border: 2px solid var(--line);
		border-radius: 12px;
		padding: 0.5em 0.8em;
		min-height: 44px;
	}
	.opt:hover { border-color: var(--d); }
	.opt .k {
		flex: none;
		width: 1.8em;
		height: 1.8em;
		border-radius: 50%;
		display: grid;
		place-items: center;
		background: var(--l);
		color: var(--d);
		font-weight: 800;
	}
	.opt .tx { padding-top: 0.12em; }
	.opt .st {
		margin-left: auto;
		flex: none;
		font-size: 0.7em;
		font-weight: 800;
		padding: 0.2em 0.6em;
		border-radius: 999px;
		align-self: center;
		color: #fff;
	}
	.opt.no { background: var(--nobg); border-color: var(--no); }
	.opt.no .st, .opt.no .k { background: var(--no); color: #fff; }
	.opt.yes { background: var(--okbg); border-color: var(--ok); }
	.opt.yes .st, .opt.yes .k { background: var(--ok); color: #fff; }
	.panel {
		background: var(--card);
		border: 2px solid var(--line);
		border-radius: 14px;
		padding: 1em 1.2em;
		min-height: 100%;
		font-size: 0.9em;
	}
	.panel p { margin: 0 0 0.6em; }
	.hint { color: var(--soft); }
	.hint b { color: var(--ink); }
	.verdict { font: 700 1.15em/1.25 Georgia, serif; }
	.verdict.good { color: var(--ok); }
	.verdict.bad { color: var(--no); }
	.rule { background: var(--l); border-left: 6px solid var(--d); border-radius: 6px; padding: 0.55em 0.8em; margin: 0.2em 0 0.8em; }
	.rule .h { font-size: 0.75em; font-weight: 800; color: var(--d); margin: 0 0 0.15em; }
	.rule p:last-child { margin: 0; }
	.why { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.45em; }
	.why li {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		gap: 0.6em;
		align-items: start;
		margin: 0;
		padding: 0.35em 0.5em;
		border-radius: 8px;
	}
	.why li::marker { content: none; }
	.why li.ans { background: var(--okbg); }
	.why .k { font-weight: 800; color: var(--d); }
	.chip { display: inline-block; font-size: 0.72em; font-weight: 800; padding: 0.05em 0.5em; border-radius: 999px; margin-right: 0.4em; vertical-align: 0.1em; }
	.chip.e { background: var(--nobg); color: var(--no); }
	.chip.o { background: var(--okbg); color: var(--ok); }
	.why li.ans .chip.o { background: #fff; }
	.tried { margin: 0 0 0.6em; padding: 0.5em 0.7em; border-radius: 8px; background: var(--nobg); }
	footer {
		display: flex;
		align-items: center;
		gap: 0.8em;
		flex-wrap: wrap;
		padding: 0.5em 1.6em;
		border-top: 2px solid var(--line);
		background: var(--card);
		font-size: 0.8em;
	}
	.nav { border: 2px solid var(--d); background: var(--card); border-radius: 10px; padding: 0.25em 0.8em; font-weight: 700; min-height: 44px; }
	.nav.main { background: var(--d); color: #fff; }
	.dots { display: flex; gap: 0.3em; flex-wrap: wrap; margin: 0 auto; }
	.dot { width: 1.9em; height: 1.9em; border-radius: 50%; border: 2px solid var(--d); background: var(--card); font-size: 0.75em; font-weight: 700; padding: 0; }
	.dot.done { background: var(--c); }
	.dot[aria-current='true'] { background: var(--d); color: #fff; }
	.help { position: absolute; inset: 0; background: rgb(20 24 32 / 0.55); display: grid; place-items: center; z-index: 5; }
	.help .box { background: var(--card); border-radius: 16px; padding: 1.2em 1.6em; max-width: min(900px, 92%); font-size: 0.9em; }
	.help h2 { margin: 0 0 0.5em; font-family: Georgia, serif; font-size: 1.3em; }
	.help table { border-collapse: collapse; width: 100%; margin: 0 0 0.8em; }
	.help td { padding: 0.3em 0.6em; border: 0; border-bottom: 1px solid var(--line); vertical-align: top; }
	.help td:first-child { white-space: nowrap; font-weight: 700; }
	.small { font-size: 0.8em; color: var(--soft); }
	kbd { display: inline-block; border: 2px solid var(--line); border-bottom-width: 3px; border-radius: 6px; padding: 0 0.35em; font: inherit; font-size: 0.85em; background: #fff; }
	@media (max-width: 900px) {
		.quiz { height: auto; min-height: 0; }
		main { grid-template-columns: 1fr; overflow: visible; }
		.col { overflow: visible; }
		.kbd-state { display: none; }
	}
	@media (prefers-reduced-motion: no-preference) {
		.opt { transition: background 0.2s, border-color 0.2s; }
	}
</style>
