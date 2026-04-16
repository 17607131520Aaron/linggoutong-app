# DB 总入口与预热

## 能力说明

`src/db/index.ts` 是 DB 访问统一入口，对外只暴露方法，不暴露底层 `database` 对象。  
`src/db/warmup.ts` 提供启动阶段数据库预热能力。

## 可以做什么

- 统一从 `~/db` 访问业务方法
- 启动时提前触发轻量读，尽早发现 DB 初始化问题

## 如何使用

1. 在业务中从 `~/db` 引入方法
2. 在应用启动流程里调用 `warmUpDb`

## 使用示例

```ts
import { warmUpDb } from '~/db';

await warmUpDb();
```
