import React, { useCallback, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import colors from '~/common/colors';
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
  const [isInitializing, setIsInitializing] = useState(true);
  const [permissionMessage, setPermissionMessage] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    const initializeHome = async (): Promise<void> => {
      try {
        const latest = await loadKV<UserSettings>(kvStorage, USER_SETTINGS_KEY);
        if (isMounted) {
          setSettings(latest);
        }
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };

    initializeHome().catch(() => {
      if (isMounted) {
        setIsInitializing(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

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

  if (isInitializing) {
    return (
      <View style={styles.skeletonContainer}>
        <View style={styles.skeletonTitle} />
        <View style={styles.skeletonCard}>
          <View style={styles.skeletonButtonRow}>
            <View style={styles.skeletonButton} />
            <View style={styles.skeletonButton} />
          </View>
        </View>
        <View style={styles.skeletonCard}>
          <View style={styles.skeletonLineShort} />
          <View style={styles.skeletonLine} />
          <View style={styles.skeletonLine} />
          <View style={styles.skeletonLine} />
        </View>
      </View>
    );
  }

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
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  title: {
    fontSize: 18,
    marginBottom: 16,
    color: colors.textPrimary,
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
    color: colors.textPrimary,
  },
  permissionResultText: {
    fontSize: 14,
    marginTop: 8,
    color: colors.textSecondary,
  },
  skeletonContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: colors.bg,
  },
  skeletonTitle: {
    width: '52%',
    height: 24,
    borderRadius: 8,
    backgroundColor: colors.placeholder,
    marginBottom: 20,
  },
  skeletonCard: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.white,
    marginBottom: 16,
  },
  skeletonButtonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  skeletonButton: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: colors.placeholder,
  },
  skeletonLineShort: {
    width: '36%',
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.placeholder,
    marginBottom: 12,
  },
  skeletonLine: {
    width: '100%',
    height: 14,
    borderRadius: 8,
    backgroundColor: colors.placeholder,
    marginBottom: 10,
  },
});

export default HomePage;
