import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import migrations from '~/db/migrations';
import AppMeta from '~/db/modules/appMeta/model';
import schema from '~/db/schema';

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  // 先用非 JSI 模式跑通（RN 新架构/NDK/JSI 兼容性差异较多；需要时再开启）
  jsi: false,
  onSetUpError: (error) => {
    // 避免阻塞启动流程；必要时可上报并提示用户重启/重新登录
    console.warn('[WatermelonDB] set up failed:', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [AppMeta],
});
