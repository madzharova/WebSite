// Публичният адрес идва от конфигурацията на build-а (виж .env.github).
export const SITE = (import.meta.env.VITE_SITE_URL || 'https://madzharova.e-class.live').replace(/\/$/, '');
// Само домейнът – за пълни адреси от page.url.pathname, който вече съдържа базовия път.
export const ORIGIN = new URL(SITE).origin;
export const SITE_NAME = 'Маргарита Маджарова';
export const SITE_DESC = 'Интерактивни уроци, игри и ресурси по български език, литература и френски език.';
