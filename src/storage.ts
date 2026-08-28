import type { TapeState } from './types';

const DB_NAME = 'local-caption-tape';
const STORE = 'private';

function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getValue<T>(key: string): Promise<T | undefined> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE).objectStore(STORE).get(key);
    request.onsuccess = () => resolve(request.result as T | undefined);
    request.onerror = () => reject(request.error);
  });
}

async function putValue(key: string, value: unknown): Promise<void> {
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function key(): Promise<CryptoKey> {
  const saved = await getValue<CryptoKey>('device-key');
  if (saved) return saved;
  const created = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  await putValue('device-key', created);
  return created;
}

export async function saveTape(state: TapeState): Promise<void> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(state));
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await key(), encoded);
  await putValue('encrypted-tape', { iv, ciphertext });
}

export async function loadTape(): Promise<TapeState | null> {
  const saved = await getValue<{ iv: Uint8Array; ciphertext: ArrayBuffer }>('encrypted-tape');
  if (!saved) return null;
  try {
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: saved.iv as BufferSource }, await key(), saved.ciphertext);
    return JSON.parse(new TextDecoder().decode(plain)) as TapeState;
  } catch {
    return null;
  }
}

export async function clearTape(): Promise<void> {
  const db = await database();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete('encrypted-tape');
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
