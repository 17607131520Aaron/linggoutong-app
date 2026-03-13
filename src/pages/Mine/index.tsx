import React, { useCallback, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';

import { insertRecord, queryRecords } from '~/storage/helpers';
import { StructuredMemoryStorage } from '~/storage/structured/StructuredMemoryStorage';

import type { InMemoryQuery, InMemoryRecord } from '~/storage/structured/StructuredMemoryStorage';
import type { StructuredStorage } from '~/storage/types';

export interface StudyRecord extends InMemoryRecord {
  userId: string;
  title: string;
  finishedAt: number;
}

const structuredStorage = new StructuredMemoryStorage();

const MinePages: React.FC = () => {
  const [records, setRecords] = useState<StudyRecord[]>([]);

  const handleAddRecord = useCallback(async () => {
    const id = `${Date.now()}`;
    const record: StudyRecord = {
      id,
      userId: 'demo-user',
      title: `学习记录 ${records.length + 1}`,
      finishedAt: Date.now(),
    };
    await insertRecord<StudyRecord, InMemoryQuery>(
      structuredStorage as unknown as StructuredStorage<StudyRecord, InMemoryQuery>,
      record,
    );
    const latest = await queryRecords<StudyRecord, InMemoryQuery>(
      structuredStorage as unknown as StructuredStorage<StudyRecord, InMemoryQuery>,
      {
        predicate: (r: InMemoryRecord) => r.userId === 'demo-user',
      },
    );
    setRecords(latest);
  }, [records.length]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>我的 - 结构化存储示例</Text>
      <Button title='新增学习记录' onPress={handleAddRecord} />
      <FlatList
        contentContainerStyle={styles.listContent}
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemTime}>{new Date(item.finishedAt).toLocaleString()}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    marginBottom: 16,
  },
  listContent: {
    marginTop: 16,
    gap: 8,
  },
  item: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  itemTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  itemTime: {
    fontSize: 12,
    color: '#666',
  },
});

export default MinePages;
