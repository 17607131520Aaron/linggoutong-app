/**
 * @format
 */

import { AppRegistry } from 'react-native';
// import { polyfill as polyfillEncoding } from 'react-native-polyfill-globals/src/encoding';
// import { polyfill as polyfillFetch } from 'react-native-polyfill-globals/src/fetch';
// import { polyfill as polyfillReadableStream } from 'react-native-polyfill-globals/src/readable-stream';

// // 支持流式接口
// polyfillFetch();
// polyfillEncoding();
// polyfillReadableStream();

import { name as appName } from './app.json';
import App from './src/app';

if (__DEV__) {
  (async () => {
    try {
      // Delay loading MMKV-based storage so app bootstrap won't crash
      // if the native module isn't ready or fails to initialize.
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
        // Delay installing monkey-patches (console/fetch/XHR) until after bootstrap.
        const { installWSLogger } = await import('./src/common/ws-log-forwarder');
        setTimeout(() => {
          try {
            installWSLogger();
          } catch (error) {
            console.warn('[WS Logger] install failed:', error);
          }
        }, 0);
      }
    } catch (error) {
      // Don't block app startup if dev logger fails to load.
      console.warn('[WS Logger] bootstrap failed:', error);
    }
  })().catch(() => undefined);
}

AppRegistry.registerComponent(appName, () => App);
