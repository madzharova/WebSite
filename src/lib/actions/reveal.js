// use:reveal – плавно появяване, когато елементът влезе в екрана.
// <div use:reveal={{ delay: 120 }}>
//
// Страниците са prerender-нати, т.е. HTML-ът се вижда още преди JavaScript да тръгне.
// Ако при hydration скрием елементи, които потребителят вече гледа, те ще изчезнат и
// ще се появят отново (примигване). Затова при първото зареждане всичко, което е в
// екрана, остава видимо без анимация; анимират се само елементите под него и
// съдържанието при навигация между страниците.
let observer;
let hydrated = false;

/** Извиква се от +layout.svelte след първото монтиране. */
export function markHydrated() {
	hydrated = true;
}

function getObserver() {
	if (observer) return observer;
	observer = new IntersectionObserver(
		(entries) => {
			for (const e of entries) {
				if (e.isIntersecting) {
					e.target.classList.add('is-in');
					observer.unobserve(e.target);
				}
			}
		},
		{ rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
	);
	return observer;
}

function inViewport(node) {
	const r = node.getBoundingClientRect();
	return r.bottom > 0 && r.top < window.innerHeight;
}

/** @param {HTMLElement} node */
export function reveal(node, opts = {}) {
	if (!hydrated && inViewport(node)) {
		// Вече е на екрана: is-in преди data-reveal → стилът не се сменя, няма преход.
		node.classList.add('is-in');
		node.dataset.reveal = '';
		return {};
	}
	node.dataset.reveal = '';
	if (opts.delay) node.style.setProperty('--delay', `${opts.delay}ms`);
	const io = getObserver();
	io.observe(node);
	return { destroy: () => io.unobserve(node) };
}
