import { derived, writable } from 'svelte/store';
import { locale } from 'svelte-i18n';

export const dayjsLocale = writable('en');

const localeStore = derived([dayjsLocale, locale], () => {
  return (value) => value;
});

export { localeStore as __ };
