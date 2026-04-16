import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';

import { appMetaMigrations } from '~/db/modules/appMeta/migrations';

export default schemaMigrations({
  migrations: [...appMetaMigrations],
});
