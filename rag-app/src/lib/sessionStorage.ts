export function readSessionStorage<T>(key: string): T | null {
  try {
    const value = window.sessionStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch {
    return null;
  }
}

export function writeSessionStorage<T>(key: string, value: T) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
  }
}

export function updateSessionStorage<T>(
  key: string,
  update: (current: T | null) => T,
) {
  const nextValue = update(readSessionStorage<T>(key));
  writeSessionStorage(key, nextValue);
  return nextValue;
}
