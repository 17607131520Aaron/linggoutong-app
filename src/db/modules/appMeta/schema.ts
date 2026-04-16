import { tableSchema } from '@nozbe/watermelondb';

export const appMetaTableSchema = tableSchema({
  name: 'app_meta',
  columns: [
    { name: 'key', type: 'string', isIndexed: true },
    { name: 'value', type: 'string', isOptional: true },
  ],
});
