import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { type GestureResponderEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import colors from '~/common/colors';
import { BackArrowIcon, SearchIcon } from '~/components/SvgIcons';

export interface AppHeaderProps {
  title: string;
  /** 是否展示返回按钮（默认不展示） */
  showBack?: boolean;
  /** 是否展示右侧搜索按钮（默认不展示） */
  showSearch?: boolean;
  onBackPress?: (event: GestureResponderEvent) => void;
  onSearchPress?: (event: GestureResponderEvent) => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBack = false,
  showSearch = false,
  onBackPress,
  onSearchPress,
}) => {
  const navigation = useNavigation();

  const handleBackPress = useCallback(
    (event: GestureResponderEvent) => {
      if (onBackPress) {
        onBackPress(event);
        return;
      }

      const nav = navigation;
      if (nav?.canGoBack?.()) {
        nav.goBack();
      }
    },
    [navigation, onBackPress],
  );

  const handleSearchPress = useCallback(
    (event: GestureResponderEvent) => {
      if (onSearchPress) {
        onSearchPress(event);
      }
    },
    [onSearchPress],
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.leftGroup}>
          {showBack ? (
            <TouchableOpacity
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              onPress={handleBackPress}
            >
              <BackArrowIcon color={colors.textPrimary} size={16} />
            </TouchableOpacity>
          ) : null}

          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
        </View>

        <View style={styles.rightSide}>
          {showSearch ? (
            <TouchableOpacity
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              onPress={handleSearchPress}
            >
              <SearchIcon />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.white,
  },
  container: {
    height: 36,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    backgroundColor: colors.white,
  },
  leftGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rightSide: {
    width: 48,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
