// use:spotlight – мека светлина, която следва курсора върху карта.
/** @param {HTMLElement} node */
export function spotlight(node) {
	const move = (e) => {
		const r = node.getBoundingClientRect();
		node.style.setProperty('--mx', `${e.clientX - r.left}px`);
		node.style.setProperty('--my', `${e.clientY - r.top}px`);
	};
	node.addEventListener('pointermove', move);
	return { destroy: () => node.removeEventListener('pointermove', move) };
}
