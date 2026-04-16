/**
 * @format
 */

import { AppRegistry } from 'react-native';

import { name as appName } from './app.json';
import App from './src/app';
// import { installWSLogger } from './src/common/ws-log-forwarder';
// import { readLocalWSLoggerConfig } from './src/pages/Debug/utils';

// if (__DEV__) {
//   const wsConfig = readLocalWSLoggerConfig();
//   if (wsConfig.wsEnabled && wsConfig.wsIp) {
//     global.__LOG_SERVER_IP__ = wsConfig.wsIp;
//   }

//   try {
//     if (wsConfig.wsEnabled) {
//       installWSLogger();
//     }
//   } catch (error) {
//     // Don't block app startup if dev logger fails to load.
//     console.warn('[WS Logger] installWSLogger failed:', error);
//   }
// }

AppRegistry.registerComponent(appName, () => App);
