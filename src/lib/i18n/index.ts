import { writable, get } from 'svelte/store';
import { dicts } from './dictionaries';

export type Locale = 'id' | 'en';
export const LOCALE_KEY = 'locale';

export const locale = writable<Locale>('id');

export function detectLocale(): Locale {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem(LOCALE_KEY);
    if (saved === 'id' || saved === 'en') return saved;
  }
  return 'id';
}

export function initLocale(): void {
  locale.set(detectLocale());
}

export function setLocale(next: Locale): void {
  locale.set(next);
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(LOCALE_KEY, next);
  }
}

export function toggleLocale(): void {
  setLocale(get(locale) === 'id' ? 'en' : 'id');
}

export { dicts as dictionaries };