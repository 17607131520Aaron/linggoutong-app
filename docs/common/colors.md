# 颜色主题 Tokens

## 能力说明

`src/common/colors.ts` 提供统一颜色常量，避免页面里硬编码色值。

## 可以做什么

- 统一品牌色、文字色、背景色、边框色
- 让组件样式保持一致
- 支持后续主题扩展时集中修改

## 如何使用

1. 在页面或组件中引入 `colors`
2. 在 `StyleSheet.create` 中使用颜色 token

## 使用示例

```ts
import { StyleSheet } from 'react-native';
import colors from '~/common/colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.pageBackground,
  },
  title: {
    color: colors.textMain,
  },
  button: {
    backgroundColor: colors.brandPrimary,
  },
});
```
