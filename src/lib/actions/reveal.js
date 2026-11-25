// use:reveal – плавно появяване, когато елементът влезе в екрана.
// <div use:reveal={{ delay: 120 }}>
let observer;

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

/** @param {HTMLElement} node */
export function reveal(node, opts = {}) {
	node.dataset.reveal = '';
	if (opts.delay) node.style.setProperty('--delay', `${opts.delay}ms`);
	const io = getObserver();
	io.observe(node);
	return { destroy: () => io.unobserve(node) };
}
