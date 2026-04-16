export const CONFIG = {
  METRO_PORT: 8081,
  LOG_SERVER_PORT: 8082,
  RECONNECT_DELAY: 5000,
  REINSTALL_CHECK_INTERVAL: 2000,
  STATUS_CHECK_DELAY: 3000,
  LOG_SAMPLE_RATE: 0.1,
  MAX_QUEUE_SIZE: 500,
  // Set to Infinity to disable "[truncated ... chars]" markers.
  // NOTE: This can make WebSocket messages very large and may impact performance.
  MAX_PAYLOAD_PREVIEW_LENGTH: Infinity,
} as const;

export const WS_READY_STATES = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
} as const;

export const WS_READY_STATE_NAMES = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'] as const;

export const DEFAULT_HOSTS = {
  IOS_SIMULATOR: 'localhost',
  ANDROID_EMULATOR: '10.0.2.2',
} as const;

export const NATIVE_IP_METHODS = [
  'getHotspotGatewayIp',
  'getLocalIpAddress',
  'getLocalIP',
  'getDeviceIP',
] as const;
