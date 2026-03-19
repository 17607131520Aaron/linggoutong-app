import React, { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import colors from '~/common/colors';
import CustomButton from '~/components/CustomButton';
import { SafeAreaWrapper } from '~/components/SafeAreaWrapper';
import ScanCodeCamera, { type ScanResult } from '~/components/ScanCodeCamera';

const torchButtonBackground = 'rgba(0, 0, 0, 0.55)';

const LibraryScan: React.FC = () => {
  const [scanRecords, setScanRecords] = useState<ScanResult[]>([]);
  const [torchEnabled, setTorchEnabled] = useState(false);

  const uniqueCount = useMemo(() => {
    return new Set(scanRecords.map((item) => item.value)).size;
  }, [scanRecords]);

  const handleScan = (result: ScanResult): void => {
    setScanRecords((current) => [result, ...current]);
  };

  const handleFinish = (): void => {
    Alert.alert('扫码完成', `本次共扫描 ${scanRecords.length} 条，去重后 ${uniqueCount} 条。`);
  };

  return (
    <SafeAreaWrapper edges={['bottom']}>
      <View style={styles.container}>
        <View style={styles.scanArea}>
          <ScanCodeCamera style={styles.scanner} torchEnabled={torchEnabled} onScan={handleScan} />
          <Pressable
            style={[styles.torchButton, torchEnabled && styles.torchButtonActive]}
            onPress={() => setTorchEnabled((current) => !current)}
          >
            <Text style={[styles.torchButtonText, torchEnabled && styles.torchButtonTextActive]}>
              {torchEnabled ? '关闭手电筒' : '打开手电筒'}
            </Text>
          </Pressable>
        </View>
        <View style={styles.scanListArea}>
          <View style={styles.scanHeader}>
            <Text style={styles.scanTitle}>扫码记录</Text>
            <Text style={styles.scanSummary}>
              共 {scanRecords.length} 条，去重后 {uniqueCount} 条
            </Text>
          </View>
          <FlatList
            contentContainerStyle={styles.listContent}
            data={scanRecords}
            keyExtractor={(item, index) => `${item.value}-${index}`}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>还没有扫码结果</Text>
                <Text style={styles.emptyTip}>识别到条码或二维码后会自动追加到这里</Text>
              </View>
            }
            renderItem={({ item, index }) => (
              <View style={styles.scanItem}>
                <View style={styles.scanIndex}>
                  <Text style={styles.scanIndexText}>{index + 1}</Text>
                </View>
                <View style={styles.scanContent}>
                  <Text style={styles.scanValue}>{item.value}</Text>
                  <Text style={styles.scanType}>类型：{item.type}</Text>
                </View>
              </View>
            )}
          />
        </View>
        <CustomButton disabled={!scanRecords.length} title='扫码完成入库' onPress={handleFinish} />
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    flexDirection: 'column',
    backgroundColor: colors.pageBackground,
  },
  scanArea: {
    height: 144,
    position: 'relative',
  },
  scanner: {
    flex: 1,
  },
  torchButton: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: torchButtonBackground,
  },
  torchButtonActive: {
    backgroundColor: colors.accentYellow,
  },
  torchButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  torchButtonTextActive: {
    color: colors.textMain,
  },
  scanListArea: {
    flex: 1,
    backgroundColor: colors.white,
    marginVertical: 12,
    borderRadius: 16,
    padding: 12,
  },
  scanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  scanTitle: {
    color: colors.textMain,
    fontSize: 16,
    fontWeight: '600',
  },
  scanSummary: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  listContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    color: colors.textBody,
    fontSize: 15,
    fontWeight: '500',
  },
  emptyTip: {
    marginTop: 8,
    color: colors.textSecondary,
    fontSize: 13,
  },
  scanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderDefault,
  },
  scanIndex: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.tagBlueBg,
    marginRight: 12,
  },
  scanIndexText: {
    color: colors.brandPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  scanContent: {
    flex: 1,
  },
  scanValue: {
    color: colors.textMain,
    fontSize: 14,
    fontWeight: '500',
  },
  scanType: {
    marginTop: 4,
    color: colors.textSecondary,
    fontSize: 12,
  },
});

export default LibraryScan;
