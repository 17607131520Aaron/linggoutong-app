import type { StructuredStorage } from '~/storage/types';

export interface InMemoryRecord {
  id: string;
  [key: string]: unknown;
}

export interface InMemoryQuery {
  predicate?: (record: InMemoryRecord) => boolean;
}

export class StructuredMemoryStorage
  implements StructuredStorage<InMemoryRecord, InMemoryQuery>
{
  private readonly store = new Map<string, InMemoryRecord>();

  async insert(record: InMemoryRecord): Promise<void> {
    this.store.set(record.id, { ...record });
  }

  async bulkInsert(records: InMemoryRecord[]): Promise<void> {
    records.forEach((record) => {
      this.store.set(record.id, { ...record });
    });
  }

  async update(id: string, partial: Partial<InMemoryRecord>): Promise<void> {
    const existing = this.store.get(id);
    if (!existing) {
      return;
    }
    this.store.set(id, { ...existing, ...partial, id });
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id);
  }

  async getById(id: string): Promise<InMemoryRecord | null> {
    const record = this.store.get(id);
    return record ? { ...record } : null;
  }

  async query(params: InMemoryQuery): Promise<InMemoryRecord[]> {
    const { predicate } = params;
    const all = Array.from(this.store.values()).map((r) => ({ ...r }));
    if (!predicate) {
      return all;
    }
    return all.filter(predicate);
  }

  async clear(): Promise<void> {
    this.store.clear();
  }
}

