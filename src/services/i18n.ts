import { dictionary, locale, _ } from 'svelte-i18n';

const MESSAGE_FILE_URL_TEMPLATE = '../data/lang/{locale}.json';

let cachedLocale;

function setupI18n({ withLocale: _locale } = { withLocale: 'en' }) {
  const messsagesFileUrl = MESSAGE_FILE_URL_TEMPLATE.replace('{locale}', _locale);

  return fetch(messsagesFileUrl)
    .then((response) => response.json())
    .then((messages) => {
      dictionary.set({ [_locale]: messages });

      cachedLocale = _locale;

      locale.set(_locale);
    });
}

function getCurrentLocale() {
  return localStorage.getItem('I18N_LANGUAGE') || 'en';
}

export { _, locale, setupI18n, getCurrentLocale };
