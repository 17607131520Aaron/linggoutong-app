import { type NavigationProp, type ParamListBase, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import colors from '~/common/colors';
import STORAGE_KEYS from '~/common/storage-keys';
import ListItem from '~/components/ListItem';
import { useWSLoggerModal } from '~/pages/Debug/components/WSLoggerConfigModal';
import storage from '~/utils/storage';

interface WSLoggerConfig {
  wsEnabled: boolean;
  wsIp: string;
}

const DEFAULT_WS_LOGGER_CONFIG: WSLoggerConfig = {
  wsEnabled: false,
  wsIp: '',
};

const readLocalWSLoggerConfig = (): WSLoggerConfig => {
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

const Debug: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { opne } = useWSLoggerModal();
  const [wsConfig, setWsConfig] = useState<WSLoggerConfig>(() => readLocalWSLoggerConfig());

  const persistWSLoggerConfig = (nextConfig: WSLoggerConfig): void => {
    const payload: Record<string, boolean | string> = {
      wsEnabled: nextConfig.wsEnabled,
      wsIp: nextConfig.wsIp,
    };
    storage.setItemSync(STORAGE_KEYS.WS_LOGGER_CONFIG, payload);
    setWsConfig(nextConfig);
  };

  const debugItems = [
    { key: 'env', label: '切换环境', value: 'test', onPress: () => {} },
    {
      key: 'wsLogger',
      label: 'WS Logger 调试工具',
      value: wsConfig.wsEnabled ? `已启用${wsConfig.wsIp ? ` (${wsConfig.wsIp})` : ''}` : '未启用',
      onPress: () => {
        const localConfig = readLocalWSLoggerConfig();
        setWsConfig(localConfig);
        opne({
          initialWsEnabled: localConfig.wsEnabled,
          initialWsIp: localConfig.wsIp,
          onSave: (values) => {
            persistWSLoggerConfig({
              wsEnabled: values.wsEnabled,
              wsIp: values.wsIp.trim(),
            });
          },
        });
      },
    },
    {
      key: 'storageTest',
      label: '存储工具测试',
      value: 'MMKV',
      onPress: () => {
        navigation.navigate('StorageTest');
      },
    },
  ];
  return (
    <View style={styles.listContent}>
      <FlatList
        data={debugItems}
        renderItem={({ item }) => <ListItem item={item} showSeparator={false} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContent: {
    flex: 1,
    backgroundColor: colors.pageBackground,
  },
});

export default Debug;
