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
		tagline: 'Езикови норми, литература и създаване на текст – уроци, упражнения и игри.',
		lang: 'bg',
		accent: 'var(--sea)',
		mark: 'Аа',
		// Темите – по учебната програма. На материала се пише най-конкретното:
		// topic: [punktuacia] → сайтът сам го показва и под „Български език“.
		topics: [
			{
				id: 'ezik',
				label: 'Български език',
				sub: [
					{ id: 'pravopis', label: 'Правописна норма' },
					{ id: 'gramatika', label: 'Граматична норма' },
					{ id: 'punktuacia', label: 'Пунктуационна норма' },
					{ id: 'leksika', label: 'Лексикална норма' }
				]
			},
			{ id: 'literatura', label: 'Литература' },
			{ id: 'tekst', label: 'Създаване на текст' }
		],
		// Подготовка за изпит – отделен знак, който може да има материал от всяка тема: izpit: [nvo]
		exams: [
			{ id: 'nvo', label: 'НВО' },
			{ id: 'dzi', label: 'ДЗИ' }
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
		tagline: 'Grammaire, vocabulaire et civilisation – уроци, упражнения и игри.',
		lang: 'fr',
		accent: 'var(--coral)',
		mark: 'Fr',
		topics: [
			{ id: 'grammaire', label: 'Grammaire' },
			{ id: 'vocabulaire', label: 'Vocabulaire' },
			{ id: 'comprehension', label: 'Compréhension' },
			{ id: 'expression', label: 'Expression écrite et orale' },
			{ id: 'civilisation', label: 'Civilisation' }
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

// Вид материал – основният филтър в страниците на предметите.
// Полето `type` в описанието на материала определя вида му.
export const kinds = [
	{ id: 'prezentacii', label: 'Презентации', types: ['презентация'] },
	{ id: 'uprazhnenia', label: 'Упражнения', types: ['упражнение', 'тест'] },
	{ id: 'uroci', label: 'Уроци', types: ['урок'] },
	{ id: 'igri', label: 'Игри', types: ['игра'] }
];

// Бинарните уроци – общото между двата предмета (subject: bel-fr)
export const bridge = {
	key: 'bel-fr',
	name: 'Бинарни уроци',
	text: 'Литература в оригинал и превод, общи теми и уроци, водени заедно с колега.'
};

export const topicLabel = (id) => {
	for (const s of Object.values(subjectPages)) {
		for (const t of s.topics) {
			if (t.id === id) return t.label;
			const st = t.sub?.find((x) => x.id === id);
			if (st) return st.label;
		}
	}
	return id;
};

export const examLabel = (id) => ({ nvo: 'НВО', dzi: 'ДЗИ' })[id] ?? id.toUpperCase();
