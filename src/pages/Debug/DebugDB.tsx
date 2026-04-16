import React, { useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import colors from '~/common/colors';
import { deleteAppMetaByKey, getAllAppMeta, setAppMeta } from '~/db';

const defaultKey = 'debug_demo_key';
interface TMetaItem {
  key: string;
  value?: string;
}

const DebugDB: React.FC = () => {
  const [keyInput, setKeyInput] = useState(defaultKey);
  const [valueInput, setValueInput] = useState('');
  const [resultText, setResultText] = useState('等待操作');
  const [listData, setListData] = useState<TMetaItem[]>([]);
  const [loading, setLoading] = useState(false);

  const normalizedKey = keyInput.trim();

  const ensureKey = (): boolean => {
    if (normalizedKey) {
      return true;
    }
    Alert.alert('提示', '请先输入 key');
    return false;
  };

  const withLoading = async (task: () => Promise<void>): Promise<void> => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      await task();
    } finally {
      setLoading(false);
    }
  };

  const loadList = async (): Promise<void> => {
    const allData = await getAllAppMeta();
    const filtered = normalizedKey
      ? allData.filter((item) => item.key.includes(normalizedKey))
      : allData;
    setListData(filtered);
    setResultText(`共 ${filtered.length} 条（总计 ${allData.length} 条）`);
  };

  const handleCreateOrUpdate = (): void => {
    withLoading(async () => {
      if (!ensureKey()) {
        return;
      }
      await setAppMeta(normalizedKey, valueInput);
      setResultText(`已写入: ${normalizedKey} = ${valueInput || '(空字符串)'}`);
      await loadList();
      Alert.alert('成功', '写入完成');
    }).catch(() => {
      Alert.alert('失败', '写入失败');
    });
  };

  const handleReadList = (): void => {
    withLoading(async () => {
      await loadList();
      Alert.alert('成功', normalizedKey ? '按 key 条件读取完成' : '读取全部完成');
    }).catch(() => {
      Alert.alert('失败', '读取失败');
    });
  };

  const handleDelete = (): void => {
    withLoading(async () => {
      if (!ensureKey()) {
        return;
      }
      await deleteAppMetaByKey(normalizedKey);
      setResultText(`已删除: ${normalizedKey}`);
      await loadList();
      Alert.alert('成功', '删除完成');
    }).catch(() => {
      Alert.alert('失败', '删除失败');
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>app_meta 增删改查示例</Text>

      <Text style={styles.label}>Key</Text>
      <TextInput
        autoCapitalize='none'
        autoCorrect={false}
        placeholder='请输入 key'
        placeholderTextColor={colors.textSecondary}
        style={styles.input}
        value={keyInput}
        onChangeText={setKeyInput}
      />

      <Text style={styles.label}>Value</Text>
      <TextInput
        autoCapitalize='none'
        autoCorrect={false}
        placeholder='请输入 value'
        placeholderTextColor={colors.textSecondary}
        style={styles.input}
        value={valueInput}
        onChangeText={setValueInput}
      />

      <View style={styles.actionRow}>
        <Pressable style={styles.button} onPress={handleCreateOrUpdate}>
          <Text style={styles.buttonText}>{loading ? '处理中...' : '新增/修改'}</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={handleReadList}>
          <Text style={styles.buttonText}>读取列表</Text>
        </Pressable>
        <Pressable style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.buttonText}>删除</Text>
        </Pressable>
      </View>

      <Text style={styles.resultLabel}>结果</Text>
      <Text style={styles.resultText}>{resultText}</Text>

      <FlatList
        contentContainerStyle={styles.listContainer}
        data={listData}
        keyExtractor={(item) => item.key}
        ListEmptyComponent={<Text style={styles.emptyText}>暂无数据</Text>}
        renderItem={({ item }) => {
          return (
            <View style={styles.listItem}>
              <Text style={styles.listItemKey}>{item.key}</Text>
              <Text style={styles.listItemValue}>{item.value ?? '(空)'}</Text>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.pageBackground,
    padding: 16,
  },
  title: {
    color: colors.textMain,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  label: {
    color: colors.textMain,
    fontSize: 14,
    marginBottom: 6,
  },
  input: {
    height: 42,
    borderRadius: 10,
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderDefault,
    paddingHorizontal: 12,
    color: colors.textMain,
    marginBottom: 14,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 2,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.brandPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  deleteButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  resultLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
  resultText: {
    color: colors.textMain,
    fontSize: 14,
    lineHeight: 20,
  },
  listContainer: {
    paddingTop: 12,
    paddingBottom: 24,
  },
  listItem: {
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderDefault,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  listItemKey: {
    color: colors.textMain,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  listItemValue: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 13,
    paddingVertical: 8,
  },
});

export default DebugDB;
