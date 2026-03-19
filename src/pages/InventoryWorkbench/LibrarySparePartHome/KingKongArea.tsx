import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import colors from '~/common/colors';
import { CheckIcon, MinusIcon, PlusIcon, ScanIcon } from '~/components/SvgIcons';

type KingKongKey =
  | 'reserveOrder'
  | 'orderManage'
  | 'engineerMaterial'
  | 'transferReturn'
  | 'receiveSend'
  | 'inventory';

interface KingKongAreaProps {
  onPressItem?: (key: KingKongKey) => void;
}

const BG = {
  container: '#F2F6FF',
} as const;

const ICON_BG: Record<KingKongKey, string> = {
  reserveOrder: '#7C4DFF',
  orderManage: '#FF4D4F',
  engineerMaterial: '#2B6BFF',
  transferReturn: '#FF7A45',
  receiveSend: '#7C4DFF',
  inventory: '#7C4DFF',
};

const ITEMS: Array<{ key: KingKongKey; label: string }> = [
  { key: 'reserveOrder', label: '储备订料' },
  { key: 'orderManage', label: '订单管理' },
  { key: 'engineerMaterial', label: '工程师用料' },
  { key: 'transferReturn', label: '调拨返还' },
  { key: 'receiveSend', label: '收发货管理' },
  { key: 'inventory', label: '盘点' },
];

const ItemIcon: React.FC<{ itemKey: KingKongKey }> = ({ itemKey }) => {
  if (itemKey === 'reserveOrder') return <CheckIcon color={colors.white} size={22} />;
  if (itemKey === 'orderManage') return <PlusIcon color={colors.white} size={22} />;
  if (itemKey === 'engineerMaterial') return <MinusIcon color={colors.white} size={22} />;
  if (itemKey === 'transferReturn') return <ScanIcon color={colors.white} size={22} />;
  if (itemKey === 'receiveSend') return <CheckIcon color={colors.white} size={22} />;
  return <CheckIcon color={colors.white} size={22} />;
};

const KingKongArea: React.FC<KingKongAreaProps> = ({ onPressItem }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        contentContainerStyle={styles.contentContainer}
        showsHorizontalScrollIndicator={false}
      >
        {ITEMS.map((item) => {
          return (
            <TouchableOpacity
              key={item.key}
              accessibilityRole='button'
              activeOpacity={0.85}
              style={styles.item}
              onPress={() => onPressItem?.(item.key)}
            >
              <View style={[styles.iconWrap, { backgroundColor: ICON_BG[item.key] }]}>
                <ItemIcon itemKey={item.key} />
              </View>
              <Text style={styles.label}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: BG.container,
  },
  contentContainer: {
    paddingHorizontal: 4,
    paddingRight: 22,
  },
  item: {
    width: 72,
    alignItems: 'center',
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '400',
    color: colors.textMain,
  },
});

export default KingKongArea;
