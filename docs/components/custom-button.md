# CustomButton 按钮

## 能力说明

`src/components/CustomButton` 是统一按钮组件，内置禁用态与基础视觉样式。

## 可以做什么

- 统一按钮交互与默认样式
- 支持禁用态
- 支持外部样式扩展

## 如何使用

1. 引入组件
2. 传入 `title` 与 `onPress`
3. 需要时传 `disabled` / `style`

## 使用示例

```tsx
import CustomButton from '~/components/CustomButton';

<CustomButton
  title='提交'
  disabled={false}
  onPress={() => {
    // do submit
  }}
/>;
```
