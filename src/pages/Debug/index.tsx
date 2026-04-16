import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import colors from '~/common/colors';
import ListItem from '~/components/ListItem';

const Debug: React.FC = () => {
  const debugItems = [
    { key: 'env', label: '切换环境', value: 'test', onPress: () => {} },
    {
      key: 'wsLogger',
      label: 'WS Logger 调试工具',
      value: '未启用',
      onPress: () => {},
    },
  ];
  return (
    <View style={styles.listContent}>
      <FlatList
        data={debugItems}
        renderItem={({ item }) => (
          <ListItem item={item} showSeparator={false} onPress={() => item.onPress?.()} />
        )}
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
