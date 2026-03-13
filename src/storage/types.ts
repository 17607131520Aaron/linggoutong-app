export type StorageKey = string;

export interface KeyValueStorage {
  getItem<T = unknown>(key: StorageKey): Promise<T | null>;
  setItem<T = unknown>(key: StorageKey, value: T): Promise<void>;
  removeItem(key: StorageKey): Promise<void>;
  clear(): Promise<void>;
}

export interface StructuredStorage<TRecord, TQuery = unknown> {
  insert(record: TRecord): Promise<void>;
  bulkInsert(records: TRecord[]): Promise<void>;
  update(id: string, partial: Partial<TRecord>): Promise<void>;
  delete(id: string): Promise<void>;
  getById(id: string): Promise<TRecord | null>;
  query(params: TQuery): Promise<TRecord[]>;
  clear(): Promise<void>;
}
