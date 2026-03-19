import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import colors from '~/common/colors';
import { SafeAreaWrapper } from '~/components/SafeAreaWrapper';

import ArrivalInventory from './ArrivalInventory';
import KingKongArea from './KingKongArea';

const UI = {
  headerTagBg: 'rgba(255, 255, 255, 0.22)',
  headerTagBorder: 'rgba(255, 255, 255, 0.18)',
  tabPillBg: 'rgba(43, 107, 255, 0.08)',
  tabPillBorder: 'rgba(43, 107, 255, 0.18)',
} as const;

const LibraryHome: React.FC = () => {
  return (
    <View style={styles.container}>
      <SafeAreaWrapper edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Text style={styles.headerText}>广东湛江城南汇鑫子站Z</Text>
          <View style={styles.headerTag}>
            <Text style={styles.headerTagText}>服销一体店</Text>
          </View>
        </View>
        <KingKongArea />
        <View style={styles.content}>
          <ArrivalInventory />
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>我的待办 (12)</Text>
          </View>

          <View style={styles.todoListDemo}>
            <Text>待办列表待实现中</Text>
          </View>
        </View>
      </SafeAreaWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.brandPrimary, // 底层铺满蓝色
    flexDirection: 'column',
  },
  header: {
    paddingTop: 8,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 18,
    color: colors.white,
    fontWeight: '900',
  },
  headerTag: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: UI.headerTagBg,
    borderWidth: 1,
    borderColor: UI.headerTagBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    marginBottom: 2,
  },
  headerTagText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    width: '100%',
    flex: 1,
    backgroundColor: colors.surfaceBackground,
    paddingHorizontal: 12,
    flexDirection: 'column',
    paddingBottom: 12,
  },
  sectionHeader: {
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    lineHeight: 32,
    fontWeight: '800',
    color: colors.textMain,
  },
  todoListDemo: {
    width: '100%',
    flex: 1,
  },
});

export default LibraryHome;
