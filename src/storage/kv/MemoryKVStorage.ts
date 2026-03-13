import type { KeyValueStorage, StorageKey } from '~/storage/types';

const memoryStore = new Map<StorageKey, unknown>();

export class MemoryKVStorage implements KeyValueStorage {
  async getItem<T = unknown>(key: StorageKey): Promise<T | null> {
    if (!memoryStore.has(key)) {
      return null;
    }
    return memoryStore.get(key) as T;
  }

  async setItem<T = unknown>(key: StorageKey, value: T): Promise<void> {
    memoryStore.set(key, value);
  }

  async removeItem(key: StorageKey): Promise<void> {
    memoryStore.delete(key);
  }

  async clear(): Promise<void> {
    memoryStore.clear();
  }
}

