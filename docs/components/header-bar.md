# HeaderBar 顶部导航栏

## 能力说明

`src/components/header-bar` 是统一顶部栏组件，内置返回按钮和标题展示，自动处理安全区顶部高度。

## 可以做什么

- 统一页面头部视觉
- 提供返回行为（可返回则返回，否则跳首页）
- 与根导航配置联动

## 如何使用

在导航容器里通过 `screenOptions.header` 注入：

## 使用示例

```tsx
import HeaderBar from '~/components/header-bar';

<RootStack.Navigator
  screenOptions={{
    header: (props) => <HeaderBar {...props} title={props.options.title} />,
  }}
/>;
```
