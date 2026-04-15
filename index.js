/**
 * @format
 */

import { AppRegistry } from 'react-native';

import { installWSLogger } from '~/common/ws-log-forwarder';

import { name as appName } from './app.json';
import App from './src/app';

if (__DEV__) {
  global.__LOG_SERVER_IP__ = '172.23.101.37';
  try {
    installWSLogger();
  } catch (error) {
    console.warn('[WS Logger] installWSLogger failed:', error);
  }
}

AppRegistry.registerComponent(appName, () => App);
