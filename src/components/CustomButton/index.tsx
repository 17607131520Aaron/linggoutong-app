import React from 'react';
import {
  type GestureResponderEvent,
  type StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  type ViewStyle,
} from 'react-native';

import colors from '~/common/colors';

interface CustomButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  disabled = false,
  style,
}): React.JSX.Element => {
  return (
    <TouchableOpacity
      activeOpacity={0.7} // 点击时的透明度（默认0.2）
      disabled={disabled}
      style={[styles.buttonContainer, disabled && styles.disabledButton, style]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, disabled && styles.disabledText]}>{title}</Text>
    </TouchableOpacity>
  );
};

// 完整样式配置
const styles = StyleSheet.create({
  // 按钮容器样式
  buttonContainer: {
    backgroundColor: colors.primary, // 背景色
    borderRadius: 8, // 圆角
    paddingVertical: 12, // 上下内边距
    paddingHorizontal: 24, // 左右内边距
    alignItems: 'center', // 文字水平居中
    justifyContent: 'center', // 文字垂直居中
    shadowColor: colors.black, // 阴影颜色（iOS）
    shadowOffset: { width: 0, height: 2 }, // 阴影偏移
    shadowOpacity: 0.1, // 阴影透明度
    shadowRadius: 4, // 阴影圆角
    elevation: 3, // 安卓阴影层级
  },
  // 禁用状态容器样式
  disabledButton: {
    backgroundColor: colors.border, // 禁用时背景色
    elevation: 0, // 禁用时去掉阴影
  },
  // 按钮文字样式
  buttonText: {
    color: colors.white, // 文字颜色
    fontSize: 16, // 字体大小
    fontWeight: '600', // 字体粗细
  },
  // 禁用状态文字样式
  disabledText: {
    color: colors.textSecondary, // 禁用时文字色
  },
});

export default CustomButton;
