import React, { useCallback, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import colors from '~/common/colors';
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>首页 - KV 存储示例</Text>
      <View style={styles.buttonRow}>
        <Button title='保存设置' onPress={handleSave} />
        <Button title='读取设置' onPress={handleLoad} />
      </View>
      <Text style={styles.resultText}>
        当前设置：
        {settings ? `${settings.theme} / ${settings.language}` : '暂无'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.orange,
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
  resultText: {
    fontSize: 16,
  },
});

export default HomePage;
