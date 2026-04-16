# ListItem 列表项

## 能力说明

`src/components/ListItem` 是调试页风格的可点击行组件，支持主标题、右侧文案、分隔线和点击事件。

## 可以做什么

- 快速搭建“设置/调试菜单”样式列表
- 展示 `label + value + arrow`
- 支持行内 `onPress` 和外部 `onPress` 回调

## 如何使用

1. 构造 `item`（`key`、`label`、可选 `value`、可选 `onPress`）
2. 传入 `showSeparator` 决定是否显示底部分隔线

## 使用示例

```tsx
import ListItem from '~/components/ListItem';

<ListItem
  item={{
    key: 'db-demo',
    label: 'DB 示例页',
    value: 'app_meta',
    onPress: () => console.log('open db demo'),
  }}
  showSeparator
/>;
```
