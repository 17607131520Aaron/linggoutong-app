import {} from 'ahooks';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import colors from '~/common/colors';
import ListItem from '~/components/ListItem';
import { SafeAreaWrapper } from '~/components/SafeAreaWrapper';

interface DebugItem {
  key: string;
  label: string;
  value?: string;
  onPress?: () => void;
}

const Debug: React.FC = () => {
  const handleItemPress = (item: DebugItem): void => {
    // 预留统一处理逻辑，后续可以根据 item.key 分发不同动作
    // eslint-disable-next-line no-console
    console.log(item, 'item');
  };

  const debugItems: DebugItem[] = [
    { key: 'env', label: '切换环境', value: 'test', onPress: () => {} },
    // 调试工具
    { key: 'debugTool', label: '调试工具', value: '调试工具', onPress: () => handleItemPress },
  ];

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} style={styles.safeArea}>
      <View style={styles.listContent}>
        <FlatList
          data={debugItems}
          renderItem={({ item }) => (
            <ListItem item={item} showSeparator={false} onPress={handleItemPress} />
          )}
        />
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.pageBackground,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },
});

export default Debug;
