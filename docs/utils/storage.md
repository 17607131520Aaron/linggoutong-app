# MMKV 存储封装

## 能力说明

`src/utils/storage.ts` 封装了 `react-native-mmkv`，提供同步与异步风格读写接口，并支持 JSON、基础类型、`ArrayBuffer`。

## 可以做什么

- 同步读写：`setItemSync` / `getItemSync`
- 异步包装：`setItem` / `getItem`
- 删除、清空、判断、获取所有 key：`removeItem` / `clear` / `has` / `keys`
- 处理对象自动序列化与反序列化

## 如何使用

1. 引入默认实例 `storage`
2. 用统一 key（建议配合 `STORAGE_KEYS`）
3. 按场景选择同步或异步方法

## 使用示例

```ts
import STORAGE_KEYS from '~/common/storage-keys';
import storage from '~/utils/storage';

storage.setItemSync(STORAGE_KEYS.USER_INFO, {
  id: 'u_1001',
  name: 'Tom',
});

const user = storage.getItemSync<{ id: string; name: string }>(STORAGE_KEYS.USER_INFO);
console.log(user?.name);
```
