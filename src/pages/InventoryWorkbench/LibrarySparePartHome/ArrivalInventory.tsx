import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import colors from '~/common/colors';
import { ScanIcon } from '~/components/SvgIcons';

interface ArrivalInventoryProps {
  onPressScan?: () => void;
}

const ArrivalInventory: React.FC<ArrivalInventoryProps> = ({ onPressScan }) => {
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <Text style={styles.title}>到货入库</Text>
        <Text style={styles.subtitle}>请扫描调拨单条码、二维码</Text>
      </View>

      <TouchableOpacity
        accessibilityRole='button'
        activeOpacity={0.85}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        style={styles.scanButton}
        onPress={onPressScan}
      >
        <ScanIcon color={colors.white} size={18} />
        <Text style={styles.scanButtonText}>扫码入库</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  left: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    color: colors.textMain,
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 6,
    color: colors.textSecondary,
    fontSize: 13,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.brandPrimary,
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 22,
  },
  scanButtonText: {
    marginLeft: 8,
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ArrivalInventory;
