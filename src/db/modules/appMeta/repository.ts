import { Q } from '@nozbe/watermelondb';

import { database } from '~/db/database';

import type AppMeta from '~/db/modules/appMeta/model';

interface TAppMetaRecord {
  key: string;
  value?: string;
}

const appMetaCollection = database.get<AppMeta>('app_meta');

export const getAllAppMeta = async (): Promise<TAppMetaRecord[]> => {
  const records = await appMetaCollection.query().fetch();
  return records.map((record) => ({ key: record.key, value: record.value }));
};

export const getAppMetaByKey = async (key: string): Promise<string | undefined> => {
  const record = await appMetaCollection.query(Q.where('key', key)).fetch();
  return record[0]?.value;
};

export const setAppMeta = async (key: string, value?: string): Promise<void> => {
  const existing = await appMetaCollection.query(Q.where('key', key)).fetch();

  await database.write(async () => {
    if (existing[0]) {
      await existing[0].update((record) => {
        record.value = value;
      });
      return;
    }

    await appMetaCollection.create((record) => {
      record.key = key;
      record.value = value;
    });
  });
};

export const deleteAppMetaByKey = async (key: string): Promise<void> => {
  const existing = await appMetaCollection.query(Q.where('key', key)).fetch();
  if (!existing[0]) {
    return;
  }

  await database.write(async () => {
    await existing[0].markAsDeleted();
    await existing[0].destroyPermanently();
  });
};
