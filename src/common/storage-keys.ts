export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_INFO: 'user_info',
  USER_ID: 'user_id',
  WS_LOGGER_CONFIG: 'ws_logger_config',
  LANGUAGE: 'language',
  THEME: 'theme',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export default STORAGE_KEYS;
