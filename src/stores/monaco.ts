import { get, writable } from 'svelte/store';

export const monacoVscodeInitialized = writable<boolean>(false);

export const monacoVscodeInit = () => {
  monacoVscodeInitialized.set(true);
};

export const isMonacoVscodeInitialized = () => {
  return get(monacoVscodeInitialized);
};
