// Двата предмета – всеки има своя начална страница, раздели и нива.
// Ресурс с subject: bel-fr (бинарен/интердисциплинарен) се показва и в двата.

import { base } from '$app/paths';

export const subjectPages = {
	bel: {
		key: 'bel',
		slug: 'balgarski',
		href: `${base}/balgarski/`,
		name: 'Български',
		full: 'Български език и литература',
		tagline: 'Граматика, правопис, литература и писане – с игри, упражнения и интерактивни уроци.',
		lang: 'bg',
		accent: 'var(--sea)',
		mark: 'Аа',
		topics: [
			{ id: 'gramatika', label: 'Граматика' },
			{ id: 'pravopis', label: 'Правопис и пунктуация' },
			{ id: 'literatura', label: 'Литература' },
			{ id: 'pisane', label: 'Писане и развитие на речта' },
			{ id: 'izpiti', label: 'НВО и ДЗИ' }
		],
		levels: ['8', '9', '10', '11', '12'],
		levelLabel: (l) => `${l} клас`,
		dict: {
			name: 'Речника на българския език',
			placeholder: 'Потърсете дума',
			url: (w) => `https://ibl.bas.bg/rbe/lang/bg/${encodeURIComponent(w.toLowerCase())}/`
		}
	},
	fr: {
		key: 'fr',
		slug: 'francais',
		href: `${base}/francais/`,
		name: 'Français',
		full: 'Френски език',
		tagline: 'Grammaire, vocabulaire, civilisation et Francophonie – уроци и игри за втори чужд език.',
		lang: 'fr',
		accent: 'var(--coral)',
		mark: 'Fr',
		topics: [
			{ id: 'grammaire', label: 'Grammaire' },
			{ id: 'vocabulaire', label: 'Vocabulaire' },
			{ id: 'comprehension', label: 'Compréhension' },
			{ id: 'expression', label: 'Expression écrite et orale' },
			{ id: 'civilisation', label: 'Civilisation et Francophonie' }
		],
		levels: ['A1', 'A2', 'B1', 'B2'],
		levelLabel: (l) => `ниво ${l}`,
		dict: {
			name: 'Le Robert',
			placeholder: 'Chercher un mot',
			// Le Robert пише адресите без ударения и с тирета: „pomme de terre“ → pomme-de-terre
			url: (w) =>
				'https://dictionnaire.lerobert.com/definition/' +
				encodeURIComponent(
					w.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[\s']+/g, '-')
				)
		}
	}
};

// Мостът между двата предмета
export const bridge = {
	key: 'bel-fr',
	name: 'БЕЛ ↔ Français',
	full: 'Бинарни и интердисциплинарни уроци',
	text: 'Литература в оригинал и превод, общи теми и уроци, водени заедно с колега.'
};

export const topicLabel = (id) => {
	for (const s of Object.values(subjectPages)) {
		const t = s.topics.find((x) => x.id === id);
		if (t) return t.label;
	}
	return id;
};
