import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import colors from '~/common/colors';
import CustomButton from '~/components/CustomButton';
import { SafeAreaWrapper } from '~/components/SafeAreaWrapper';

const LibraryScan: React.FC = () => {
  return (
    <SafeAreaWrapper edges={['bottom']}>
      <View style={styles.container}>
        <View style={styles.scanArea}>
          <Text>扫码组件区域</Text>
        </View>
        <View style={styles.scanListArea}>
          <Text>扫码列表区域</Text>
        </View>
        <CustomButton title='扫码完成入库' onPress={() => {}} />
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    flexDirection: 'column',
  },
  scanArea: {
    height: 140,
    backgroundColor: colors.white,
  },
  scanListArea: {
    flex: 1,
    backgroundColor: colors.white,
    marginVertical: 12,
  },
});

export default LibraryScan;
