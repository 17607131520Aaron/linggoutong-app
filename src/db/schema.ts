import { appSchema } from '@nozbe/watermelondb';

import { appMetaTableSchema } from '~/db/modules/appMeta/schema';

export default appSchema({
  version: 1,
  tables: [appMetaTableSchema],
});
