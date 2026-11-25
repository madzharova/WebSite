# madzharova.e-class.live

Личен сайт, библиотека с ресурси и професионално портфолио на Маргарита Маджарова.
SvelteKit (Svelte 5) · статичен build · съдържание в Markdown.

## Стартиране

```bash
npm install        # веднъж
npm run dev        # локален преглед на http://localhost:5173 (показва и подсказките към критериите)
npm run build      # готовият сайт е в папка build/
```

Нужен е Node.js 20 или по-нов (https://nodejs.org → LTS).

## Как се добавя съдържание

Всичко е в `src/content/`. Един файл = една страница. Полетата между `---` най-отгоре управляват
къде се появява съдържанието.

### Ресурс – `src/content/resources/ime-na-resursa.md`

```yaml
---
title: Заглавие
summary: Едно изречение за картата.
subject: bel          # bel | fr | bel-fr | all
type: урок            # урок | игра | упражнение | тест | презентация | инструмент
grade: 11             # по желание
date: 2027-01-15
link: https://…       # по желание – външна връзка
drive: https://…      # по желание – файлът в училищния Google Drive (критерий IV.4)
interactive: true     # по желание
criteria: [I-2.3, IV-4]               # към кои критерии да се покаже като доказателство
evidence: [dinamika, rezultati]       # вид по чл. 66, ал. 3: dinamika | rezultati | politiki | razvitie
draft: true           # скрива файла, докато го пишете
example: true         # примерно съдържание за визията – вижда се само при npm run dev
---
Текст на страницата…
```

Ресурсът се появява **веднъж въведен на три места**: в библиотеката, на собствена страница и
на страницата на всеки критерий от `criteria`.

В ресурс може да се вгради интерактивен компонент (виж `albatros-dumite-na-bodler.md`).

### Практика – `src/content/practices/*.md`
Полета `problem`, `solution`, `result`, `criteria`, по желание `resource` (slug на свързан ресурс).

### Бележка към критерий – `src/content/criteria/I-2.3.md`
`basis` (колоната „формира се на базата на“ от картата) и текст.
Точките от самооценката не се въвеждат в сайта – те са в атестационната карта на хартия.

### Отзив – `src/content/testimonials/*.md`
`author`, `context`, `order`, `image` (скрийншот в `static/img/otzivi/`).

### Документи (опис по чл. 67, т. 4) – `src/lib/data/documents.js`
Самите файлове са в Google Drive с ограничен достъп; в сайта е само описът.

### Общи данни – `src/lib/data/portfolio.js`
Период на атестацията и дата на актуализация.

## Какво остава за попълване

Незавършените места се отбелязват с `[ПОЛЕ ЗА ПОПЪЛВАНЕ: какво точно]` – в Markdown текста,
в полетата между `---` или в `src/lib/data/*.js`.

- `npm run dev` – виждат се оцветени;
- на публичния сайт (`npm run build`, `build:github`) се скриват автоматично;
- `npm run todo` – списък на всички по файлове и редове, плюс критериите без бележка
  „формира се на базата на“.

## Критериите

`src/lib/data/criteria.js` – 25-те критерия (Приложение № 20 + 5 критерия на училището).
Идентификаторите са `I-1.1` … `IV-5`. Полето `hint` е лична подсказка, вижда се само при `npm run dev`.

## Деплой

Съдържанието на `build/` се качва на сървъра. Всяка страница е готов HTML файл (`trailingSlash: always`),
а `404.html` е страницата за грешка.

### GitHub Pages

При всеки push в `main` GitHub Actions (`.github/workflows/deploy.yml`) пуска `npm run build:github`
и публикува сайта на https://madzharova.github.io/WebSite/.
Адресът е в `.env.github` (`VITE_SITE_URL`); пътят от него (`/WebSite`) става базов път на всички страници.
Затова вътрешните връзки в кода се пишат с `{base}` от `$app/paths` (`href="{base}/resursi/"`),
а в Markdown – обикновено (`](/portfolio/opis/)`), те получават базовия път автоматично.
В GitHub: Settings → Pages → Source → **GitHub Actions**.

## Шрифтове

Cormorant Garamond и Manrope са инсталирани през npm (`@fontsource`) и се зареждат от самия сайт –
без Google Fonts и без бисквитки.
