import {
  useNavigation,
  type NavigationProp,
  type ParamListBase,
} from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import colors from '~/common/colors';
import { BackArrowIcon } from '~/components/SvgIcons';

interface HeaderBarProps {
  title: string;
  rightContent?: React.ReactNode;
  leftContent?: React.ReactNode;
}

const HeaderBar: React.FC<HeaderBarProps> = (props) => {
  const { title } = props;
  const navigation = useNavigation<NavigationProp<ParamListBase>>();

  const handleBackPress = (): void => {
    // 首先判断是否有上一页。没有就返回首页或登录页
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        onPress={handleBackPress}
      >
        <BackArrowIcon color={colors.textPrimary} size={20} />
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text ellipsizeMode='tail' numberOfLines={1} style={styles.titleText}>
          {title}
        </Text>
      </View>

      <View style={styles.rightContainer}>{/* 这里一般是搜索或者其他的图标 */}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  titleContainer: {
    paddingHorizontal: 8,
    flex: 1,
    minWidth: 200,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  rightContainer: {
    width: 'auto',
  },
});

export default HeaderBar;
