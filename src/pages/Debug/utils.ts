import STORAGE_KEYS from '~/common/storage-keys';
import storage from '~/utils/storage';

import type { WSLoggerConfig } from './types';

// interface WSLoggerConfig {
//   wsEnabled: boolean;
//   wsIp: string;
// }

const DEFAULT_WS_LOGGER_CONFIG: WSLoggerConfig = {
  wsEnabled: false,
  wsIp: '',
};
export const readLocalWSLoggerConfig = (): WSLoggerConfig => {
  const raw = storage.getItemSync(STORAGE_KEYS.WS_LOGGER_CONFIG);
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return DEFAULT_WS_LOGGER_CONFIG;
  }

  const config = raw as Record<string, unknown>;
  return {
    wsEnabled: typeof config.wsEnabled === 'boolean' ? config.wsEnabled : false,
    wsIp: typeof config.wsIp === 'string' ? config.wsIp : '',
  };
};
