import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import ActionBtn from './ActionBtn';
import { COLORS, MOCK_DATA, TABS } from './constants';
import ProductRow from './ProductRow';

import type { ListRenderItemInfo } from 'react-native';
import type { TodoItem } from './type';

const LibraryHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('missing');

  // 使用 useCallback 优化渲染函数，避免每次重渲染时重新创建引用
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<TodoItem>) => (
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <Text style={styles.applicantText}>
            {item.applicant} {item.time}
          </Text>
          <View style={[styles.orderTag, !item.isWorkOrder && styles.orderTagOrange]}>
            <Text style={[styles.orderTagText, !item.isWorkOrder && styles.orderTagTextOrange]}>
              {item.orderType} | {item.orderId}
            </Text>
            <Ionicons
              color={item.isWorkOrder ? COLORS.primary : COLORS.orange}
              name='chevron-forward'
              size={12}
            />
          </View>
        </View>

        {/* Products */}
        {item.items.map((prod) => (
          <ProductRow key={prod.id} item={prod} />
        ))}

        {/* Footer Actions */}
        <View style={styles.cardFooter}>
          {item.actions.map((action, index) => (
            <ActionBtn key={`${item.id}-action-${index}`} type={action} />
          ))}
        </View>
      </View>
    ),
    [],
  );

  // 将上半部分不参与列表循环的 UI 放入 ListHeaderComponent
  const renderHeader = (): React.JSX.Element => (
    <View style={styles.headerContainer}>
      {/* 快捷金刚区 */}
      <View style={styles.quickActions}>
        <View style={styles.actionIconWrapper}>
          <View style={[styles.iconBox, { backgroundColor: COLORS.primary }]}>
            <Ionicons color={COLORS.white} name='grid' size={24} />
          </View>
          <Text style={styles.actionIconLabel}>缺料管理</Text>
        </View>
        <View style={styles.actionIconWrapper}>
          <View style={[styles.iconBox, { backgroundColor: COLORS.orange }]}>
            <Ionicons color={COLORS.white} name='cube' size={24} />
          </View>
          <Text style={styles.actionIconLabel}>到货入库</Text>
        </View>
        <View style={styles.actionIconWrapper}>
          <View style={[styles.iconBox, { backgroundColor: COLORS.red }]}>
            <MaterialCommunityIcons color={COLORS.white} name='cube-send' size={24} />
          </View>
          <Text style={styles.actionIconLabel}>物料派发</Text>
        </View>
        <View style={styles.actionIconWrapper}>
          <View style={[styles.iconBox, { backgroundColor: COLORS.purple }]}>
            <MaterialCommunityIcons color={COLORS.white} name='clipboard-check' size={24} />
          </View>
          <Text style={styles.actionIconLabel}>盘点</Text>
        </View>
      </View>

      {/* 扫码 Banner */}
      <View style={styles.scanBanner}>
        <View>
          <Text style={styles.scanTitle}>到货入库</Text>
          <Text style={styles.scanSub}>请扫描调拨单条码、二维码</Text>
        </View>
        <TouchableOpacity activeOpacity={0.8} style={styles.scanBtn}>
          <Ionicons color={COLORS.white} name='scan' size={16} />
          <Text style={styles.scanBtnText}>扫码入库</Text>
        </TouchableOpacity>
      </View>

      {/* 待办列表头部 */}
      <View style={styles.todoSectionHeader}>
        <Text style={styles.sectionTitle}>我的待办 (12)</Text>
        <View style={styles.tabsContainer}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                  {tab.label} {tab.count}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.bgBlue} barStyle='light-content' />

      {/* 蓝底顶部区域 */}
      <SafeAreaView style={styles.topBlueArea}>
        <View style={styles.navBar}>
          <Text style={styles.navTitle}>广东湛江城南汇鑫子站Z</Text>
          <View style={styles.navTag}>
            <Text style={styles.navTagText}>服销一体店</Text>
          </View>
        </View>
      </SafeAreaView>

      {/* 核心列表区 - 使用 FlatList 保证性能 */}
      <FlatList
        contentContainerStyle={styles.listContentContainer}
        data={MOCK_DATA}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgBlue, // 底层铺满蓝色
  },
  topBlueArea: {
    backgroundColor: COLORS.bgBlue,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40, // 为白色圆角容器留出重叠高度
  },
  navTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginRight: 8,
  },
  navTag: {
    backgroundColor: COLORS.bgLightBlue,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  navTagText: {
    color: COLORS.white,
    fontSize: 11,
  },
  flatList: {
    flex: 1,
    marginTop: -20, // 向上负边距实现重叠覆盖效果
  },
  listContentContainer: {
    backgroundColor: COLORS.bgGray, // 列表整体底色为灰
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 40,
    minHeight: '100%',
  },
  headerContainer: {
    backgroundColor: COLORS.bgGray,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  actionIconWrapper: {
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16, // 圆角图标背景
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIconLabel: {
    fontSize: 12,
    color: COLORS.textMain,
  },
  scanBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 12,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  scanTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textMain,
    marginBottom: 4,
  },
  scanSub: {
    fontSize: 12,
    color: COLORS.textSub,
  },
  scanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  scanBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
  },
  todoSectionHeader: {
    paddingHorizontal: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textMain,
    marginBottom: 12,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tabButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 10,
  },
  tabButtonActive: {
    borderColor: COLORS.primary,
    borderWidth: 1,
    backgroundColor: COLORS.white,
  },
  tabText: {
    fontSize: 13,
    color: COLORS.textSub,
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 12,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth, // 更细的边线
    borderBottomColor: COLORS.border,
    paddingBottom: 12,
    marginBottom: 12,
  },
  applicantText: {
    fontSize: 14,
    color: COLORS.textMain,
  },
  orderTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.tagBlueBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  orderTagOrange: {
    backgroundColor: COLORS.tagOrangeBg,
  },
  orderTagText: {
    fontSize: 12,
    color: COLORS.primary,
    marginRight: 2,
  },
  orderTagTextOrange: {
    color: COLORS.orange,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
});

export default LibraryHome;
