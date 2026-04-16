# SafeAreaWrapper 安全区域容器

## 能力说明

`src/components/SafeAreaWrapper` 封装了 `SafeAreaView`，用于统一处理刘海屏、底部手势条等安全区。

## 可以做什么

- 让页面内容避开状态栏和底部指示条
- 按页面需要配置 `edges`
- 与页面根容器组合使用

## 如何使用

1. 用 `SafeAreaWrapper` 包裹页面根节点
2. 传 `style` 和可选 `edges`

## 使用示例

```tsx
import { SafeAreaWrapper } from '~/components/SafeAreaWrapper';

<SafeAreaWrapper edges={['top', 'bottom']} style={{ flex: 1 }}>
  {/* page content */}
</SafeAreaWrapper>;
```
