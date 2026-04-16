/**
 * @format
 */

import { AppRegistry } from 'react-native';

import { name as appName } from './app.json';
import App from './src/app';

if (__DEV__) {
  (async () => {
    try {
      if (global.__WS_LOGGER_BOOTSTRAP_DONE__) {
        return;
      }
      global.__WS_LOGGER_BOOTSTRAP_DONE__ = true;

      const [{ default: storage }, { default: STORAGE_KEYS }] = await Promise.all([
        import('./src/utils/storage'),
        import('./src/common/storage-keys'),
      ]);

      const raw = storage.getItemSync(STORAGE_KEYS.WS_LOGGER_CONFIG);
      const isObj = !!raw && typeof raw === 'object' && !Array.isArray(raw);
      const wsEnabled = isObj && raw.wsEnabled === true;
      const wsIp = isObj && typeof raw.wsIp === 'string' ? raw.wsIp.trim() : '';

      if (wsEnabled && wsIp) {
        global.__LOG_SERVER_IP__ = wsIp;
      }

      if (wsEnabled) {
        console.info('[WS Logger] 已启用，将在开发环境安装转发器', wsIp ? `(IP: ${wsIp})` : '');

        // Delay installing monkey-patches (console/fetch/XHR) until after bootstrap.
        const { installWSLogger } = await import('./src/common/ws-log-forwarder');
        setTimeout(() => {
          try {
            installWSLogger();
          } catch (error) {
            console.warn('[WS Logger] install failed:', error);
          }
        }, 0);
      } else {
        console.info('[WS Logger] 未启用（仅开发环境可用）');
      }
    } catch (error) {
      // Don't block app startup if dev logger fails to load.
      console.warn('[WS Logger] bootstrap failed:', error);
    }
  })().catch(() => undefined);
}

AppRegistry.registerComponent(appName, () => App);
