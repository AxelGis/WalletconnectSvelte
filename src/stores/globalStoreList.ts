import { writable } from 'svelte/store';
export const currency = writable(localStorage.getItem('CURRENCY') || 'usd');
