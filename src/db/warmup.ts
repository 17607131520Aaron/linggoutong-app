import { getAllAppMeta } from '~/db/modules/appMeta/repository';

export const warmUpDb = async (): Promise<void> => {
  try {
    // 触发一次轻量读取，尽早暴露原生侧/迁移相关问题
    await getAllAppMeta();
  } catch (error) {
    // 不阻塞启动；需要时可接入日志上报
    console.warn('[WatermelonDB] warm up failed:', error);
  }
};
