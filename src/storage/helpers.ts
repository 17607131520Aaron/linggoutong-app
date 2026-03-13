import type { KeyValueStorage, StorageKey, StructuredStorage } from '~/storage/types';

/**
 * 通用 KV 存储：新增 / 编辑（写入）
 */
export async function saveKV<T>(
  storage: KeyValueStorage,
  key: StorageKey,
  value: T,
): Promise<void> {
  await storage.setItem<T>(key, value);
}

/**
 * 通用 KV 存储：查询 / 读取
 */
export async function loadKV<T>(storage: KeyValueStorage, key: StorageKey): Promise<T | null> {
  return storage.getItem<T>(key);
}

/**
 * 通用 KV 存储：删除单个 key
 */
export async function removeKV(storage: KeyValueStorage, key: StorageKey): Promise<void> {
  await storage.removeItem(key);
}

/**
 * 通用 KV 存储：清空所有 key
 */
export async function clearKV(storage: KeyValueStorage): Promise<void> {
  await storage.clear();
}

/**
 * 通用结构化存储：新增单条记录
 */
export async function insertRecord<TRecord, TQuery>(
  storage: StructuredStorage<TRecord, TQuery>,
  record: TRecord,
): Promise<void> {
  await storage.insert(record);
}

/**
 * 通用结构化存储：批量新增
 */
export async function bulkInsertRecords<TRecord, TQuery>(
  storage: StructuredStorage<TRecord, TQuery>,
  records: TRecord[],
): Promise<void> {
  await storage.bulkInsert(records);
}

/**
 * 通用结构化存储：按查询参数获取列表
 */
export async function queryRecords<TRecord, TQuery>(
  storage: StructuredStorage<TRecord, TQuery>,
  query: TQuery,
): Promise<TRecord[]> {
  return storage.query(query);
}

/**
 * 通用结构化存储：按 id 读取单条
 */
export async function getRecordById<TRecord, TQuery>(
  storage: StructuredStorage<TRecord, TQuery>,
  id: string,
): Promise<TRecord | null> {
  return storage.getById(id);
}

/**
 * 通用结构化存储：编辑（部分更新）
 */
export async function updateRecord<TRecord, TQuery>(
  storage: StructuredStorage<TRecord, TQuery>,
  id: string,
  partial: Partial<TRecord>,
): Promise<void> {
  await storage.update(id, partial);
}

/**
 * 通用结构化存储：删除单条
 */
export async function deleteRecord<TRecord, TQuery>(
  storage: StructuredStorage<TRecord, TQuery>,
  id: string,
): Promise<void> {
  await storage.delete(id);
}

/**
 * 通用结构化存储：清空所有记录
 */
export async function clearRecords<TRecord, TQuery>(
  storage: StructuredStorage<TRecord, TQuery>,
): Promise<void> {
  await storage.clear();
}
