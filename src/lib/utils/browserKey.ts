const KEY = 'wedding_browser_key';

// Stable random key per browser, persisted in localStorage.
export function getBrowserKey(): string {
  if (typeof localStorage === 'undefined') return '';
  const existing = localStorage.getItem(KEY);
  if (existing) return existing;
  const key = crypto.randomUUID();
  localStorage.setItem(KEY, key);
  return key;
}