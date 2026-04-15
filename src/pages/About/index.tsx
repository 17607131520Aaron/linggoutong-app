import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import colors from '~/common/colors';
import { SafeAreaWrapper } from '~/components/SafeAreaWrapper';

import type { NavigationProp, ParamListBase } from '@react-navigation/native';

const TAP_TARGET_COUNT = 3;
const TAP_WINDOW_MS = 1200;

const About: React.FC = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [tapCount, setTapCount] = useState(0);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const handlePressIcon = (): void => {
    const nextCount = tapCount + 1;
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
    }

    if (nextCount >= TAP_TARGET_COUNT) {
      setTapCount(0);
      navigation.navigate('Debug');
      return;
    }

    setTapCount(nextCount);
    resetTimerRef.current = setTimeout(() => {
      setTapCount(0);
    }, TAP_WINDOW_MS);
  };

  return (
    <SafeAreaWrapper edges={['top', 'bottom']} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topBlock}>
          <Pressable style={styles.iconBox} onPress={handlePressIcon}>
            <Text style={styles.iconText}>灵购</Text>
          </Pressable>
          <Text style={styles.appName}>灵购</Text>
          <Text style={styles.version}>v1.1.01</Text>
        </View>

        <View style={styles.listBlock}>
          <View style={styles.row}>
            <Text style={styles.rowTitle}>版本更新</Text>
            <Text style={styles.rowArrow}>›</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.row}>
            <Text style={styles.rowTitle}>组件样例</Text>
            <Text style={styles.rowArrow}>›</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>用户使用协议 | 个人信息使用收集说明</Text>
          <Text style={styles.icpText}>ICP 备案号：京ICP备13009289号-16A</Text>
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.pageBackground,
  },
  container: {
    flex: 1,
    backgroundColor: colors.pageBackground,
  },
  topBlock: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 40,
    // padding: 16,
  },
  iconBox: {
    width: 108,
    height: 108,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.brandPrimary,
    padding: 16,
  },
  iconText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '700',
  },
  appName: {
    marginTop: 14,
    color: colors.textMain,
    fontSize: 32,
    fontWeight: '600',
  },
  version: {
    marginTop: 8,
    color: colors.textSecondary,
    fontSize: 14,
  },
  listBlock: {
    marginTop: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderDefault,
    borderBottomColor: colors.borderDefault,
    backgroundColor: colors.white,
  },
  row: {
    height: 54,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowTitle: {
    color: colors.textMain,
    fontSize: 16,
  },
  rowArrow: {
    color: colors.textSecondary,
    fontSize: 22,
    marginTop: -2,
  },
  separator: {
    marginLeft: 16,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.borderDefault,
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  footerText: {
    color: colors.brandPrimary,
    fontSize: 13,
    textAlign: 'center',
  },
  icpText: {
    marginTop: 12,
    color: colors.textSecondary,
    fontSize: 12,
  },
});

export default About;
