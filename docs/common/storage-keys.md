# 存储 Key 常量

## 能力说明

`src/common/storage-keys.ts` 统一定义了本地存储 key，避免业务层手写字符串。

## 可以做什么

- 约束本地存储 key 命名
- 降低拼写错误风险
- 在业务重构时集中替换 key

## 如何使用

1. 引入 `STORAGE_KEYS`
2. 作为 `storage`（MMKV 封装）调用参数

## 使用示例

```ts
import STORAGE_KEYS from '~/common/storage-keys';
import storage from '~/utils/storage';

storage.setItemSync(STORAGE_KEYS.AUTH_TOKEN, 'token_value');
const token = storage.getItemSync<string>(STORAGE_KEYS.AUTH_TOKEN);
```
