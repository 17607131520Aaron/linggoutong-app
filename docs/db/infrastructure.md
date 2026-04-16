# DB 基础设施（schema / migration / database）

## 能力说明

DB 基础设施由以下文件组成：

- `src/db/database.ts`: 创建 WatermelonDB 实例与 SQLite 适配器
- `src/db/schema.ts`: 聚合所有模块表结构
- `src/db/migrations.ts`: 聚合所有模块迁移
- `src/db/modules/appMeta/{model,schema,migrations}.ts`: 模块内部定义

## 可以做什么

- 扩展新数据模块（一个模块一个目录）
- 统一维护 schema 与 migration
- 保持业务层只依赖 repository 方法

## 如何使用（新增一个模块）

1. 新建 `src/db/modules/<your-module>/`
2. 添加 `model.ts`、`schema.ts`、`migrations.ts`、`repository.ts`
3. 在 `src/db/schema.ts` 聚合表结构
4. 在 `src/db/migrations.ts` 聚合迁移
5. 在 `src/db/database.ts` 注册 `modelClasses`
6. 在 `src/db/index.ts` 暴露业务方法

## 使用示例（聚合 schema）

```ts
import { appSchema } from '@nozbe/watermelondb';
import { appMetaTableSchema } from '~/db/modules/appMeta/schema';

export default appSchema({
  version: 1,
  tables: [appMetaTableSchema],
});
```
