import type { KeyValueStorage, StorageKey } from '~/storage/types';

/**
 * 占位接口，真正实现时请安装并接入 `react-native-mmkv`。
 * 这里先定义一份通用的加密 KV 存储封装结构。
 */
export interface EncryptionAdapter {
  encrypt(plainText: string): Promise<string>;
  decrypt(cipherText: string): Promise<string>;
}

export interface MMKVLike {
  getString(key: string): string | undefined;
  set(key: string, value: string): void;
  delete(key: string): void;
  clearAll(): void;
}

export class EncryptedMMKVStorage implements KeyValueStorage {
  private readonly kv: MMKVLike;
  private readonly encryption?: EncryptionAdapter;

  constructor(options: { kv: MMKVLike; encryption?: EncryptionAdapter }) {
    this.kv = options.kv;
    this.encryption = options.encryption;
  }

  async getItem<T = unknown>(key: StorageKey): Promise<T | null> {
    const raw = this.kv.getString(key);
    if (raw == null) {
      return null;
    }

    const decoded = await this.decode(raw);
    return JSON.parse(decoded) as T;
  }

  async setItem<T = unknown>(key: StorageKey, value: T): Promise<void> {
    const encoded = JSON.stringify(value);
    const payload = await this.encode(encoded);
    this.kv.set(key, payload);
  }

  async removeItem(key: StorageKey): Promise<void> {
    this.kv.delete(key);
  }

  async clear(): Promise<void> {
    this.kv.clearAll();
  }

  private async encode(plain: string): Promise<string> {
    if (!this.encryption) {
      return plain;
    }
    return this.encryption.encrypt(plain);
  }

  private async decode(cipher: string): Promise<string> {
    if (!this.encryption) {
      return cipher;
    }
    return this.encryption.decrypt(cipher);
  }
}
