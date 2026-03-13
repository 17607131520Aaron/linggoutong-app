import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  edges?: ('top' | 'right' | 'bottom' | 'left')[];
}

/**
 * 安全区域包裹组件
 * 用于确保内容在安全区域内显示，避免被刘海屏、底部指示器等遮挡
 */
export const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({
  children,
  edges = ['top', 'bottom'],
}) => {
  return (
    <SafeAreaView edges={edges} style={styles.container}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
