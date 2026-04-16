# SvgIcons 图标库

## 能力说明

`src/components/SvgIcons` 提供统一 SVG 图标组件集合，每个图标支持 `color` 和 `size`。

## 可以做什么

- 直接复用常见 UI 图标（返回、搜索、关闭、加减号等）
- 统一图标 API，避免散落 SVG path
- 支持按页面主题覆盖颜色和尺寸

## 如何使用

1. 按需引入图标组件
2. 通过 `color` 和 `size` 调整样式

## 使用示例

```tsx
import { BackArrowIcon, SearchIcon } from '~/components/SvgIcons';

<BackArrowIcon color='#222' size={20} />;
<SearchIcon color='#888' size={18} />;
```
