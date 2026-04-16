# AppMeta 数据能力

## 能力说明

`src/db/modules/appMeta/repository.ts` 提供 `app_meta` 表的业务方法，避免页面直接写 WatermelonDB 查询。

## 可以做什么

- 读取全部元数据：`getAllAppMeta`
- 按 key 读取：`getAppMetaByKey`
- 新增或更新：`setAppMeta`
- 按 key 删除：`deleteAppMetaByKey`

## 如何使用

统一从 `~/db` 引入方法进行调用。

## 使用示例

```ts
import {
  deleteAppMetaByKey,
  getAllAppMeta,
  getAppMetaByKey,
  setAppMeta,
} from '~/db';

await setAppMeta('debug_key', 'debug_value');
const value = await getAppMetaByKey('debug_key');
const all = await getAllAppMeta();
await deleteAppMetaByKey('debug_key');

console.log(value, all.length);
```
