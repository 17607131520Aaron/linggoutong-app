import React, { useCallback, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import {
  isGranted,
  requestCameraPermission,
  requestLocationPermission,
  requestMicrophonePermission,
  requestNotificationPermission,
  requestPhotoPermission,
} from '~/common/permissions';
import { loadKV, saveKV } from '~/storage/helpers';
import { MemoryKVStorage } from '~/storage/kv/MemoryKVStorage';

export interface UserSettings {
  theme: 'light' | 'dark';
  language: 'zh' | 'en';
}

const kvStorage = new MemoryKVStorage();
const USER_SETTINGS_KEY = 'user_settings_demo';

const HomePage: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [permissionMessage, setPermissionMessage] = useState<string>('');

  const handleSave = useCallback(async () => {
    const next: UserSettings = {
      theme: 'dark',
      language: 'zh',
    };
    await saveKV<UserSettings>(kvStorage, USER_SETTINGS_KEY, next);
    const latest = await loadKV<UserSettings>(kvStorage, USER_SETTINGS_KEY);
    setSettings(latest);
  }, []);

  const handleLoad = useCallback(async () => {
    const latest = await loadKV<UserSettings>(kvStorage, USER_SETTINGS_KEY);
    setSettings(latest);
  }, []);

  const makePermissionHandler = (label: string, fn: () => Promise<string>) => {
    return async () => {
      try {
        const status = await fn();
        setPermissionMessage(`${label}：${status}`);
      } catch {
        setPermissionMessage(`${label}：出错`);
      }
    };
  };

  const handleCameraPermission = makePermissionHandler('相机权限', async () => {
    const status = await requestCameraPermission();
    return isGranted(status) ? '已授权' : status;
  });

  const handlePhotoPermission = makePermissionHandler('相册权限', async () => {
    const status = await requestPhotoPermission();
    return isGranted(status) ? '已授权' : status;
  });

  const handleLocationPermission = makePermissionHandler('定位权限', async () => {
    const status = await requestLocationPermission();
    return isGranted(status) ? '已授权' : status;
  });

  const handleMicrophonePermission = makePermissionHandler('麦克风权限', async () => {
    const status = await requestMicrophonePermission();
    return isGranted(status) ? '已授权' : status;
  });

  const handleNotificationPermission = makePermissionHandler('通知权限', async () => {
    const status = await requestNotificationPermission();
    return isGranted(status) ? '已授权' : status;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>首页 - KV 存储示例</Text>
      <View style={styles.buttonRow}>
        <Button title='保存设置' onPress={handleSave} />
        <Button title='读取设置' onPress={handleLoad} />
      </View>
      <Text style={styles.title}>权限示例</Text>
      <View style={styles.permissionButtons}>
        <Button title='检查/获取相机权限' onPress={handleCameraPermission} />
        <Button title='检查/获取相册权限' onPress={handlePhotoPermission} />
        <Button title='检查/获取定位权限' onPress={handleLocationPermission} />
        <Button title='检查/获取麦克风权限' onPress={handleMicrophonePermission} />
        <Button title='检查/获取通知权限' onPress={handleNotificationPermission} />
      </View>
      <Text style={styles.resultText}>
        当前设置：
        {settings ? `${settings.theme} / ${settings.language}` : '暂无'}
      </Text>
      {permissionMessage ? (
        <Text style={styles.permissionResultText}>{permissionMessage}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  permissionButtons: {
    width: '80%',
    gap: 8,
    marginBottom: 16,
  },
  resultText: {
    fontSize: 16,
  },
  permissionResultText: {
    fontSize: 14,
    marginTop: 8,
  },
});

export default HomePage;
