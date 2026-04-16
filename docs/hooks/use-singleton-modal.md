# 单例弹窗 Hook 工厂

## 能力说明

`src/hooks/useSingletonModal.tsx` 提供 `createSingletonModalHook`，用于生成“可在任意位置打开/关闭”的单例弹窗 hook。

## 可以做什么

- 在业务层通过 `open` 打开弹窗
- 支持 `close(id)`、`closeAll()`、`destroy(id)`
- 自动处理关闭延时，兼容动画
- 兼容历史拼写：`opne`

## 如何使用

1. 定义 Modal 组件，接收 `isVisible` 和 `onClose`
2. 通过 `createSingletonModalHook` 生成 hook
3. 在页面中调用 hook 后用 `open(props)` 打开

## 使用示例

```tsx
import createSingletonModalHook from '~/hooks/useSingletonModal';

const useExampleModal = createSingletonModalHook(ExampleModal, { closeDelayMs: 260 });

const DemoPage = () => {
  const { open, closeAll } = useExampleModal();

  return (
    <>
      <Button title='打开弹窗' onPress={() => open({ title: 'hello' })} />
      <Button title='关闭全部' onPress={closeAll} />
    </>
  );
};
```
