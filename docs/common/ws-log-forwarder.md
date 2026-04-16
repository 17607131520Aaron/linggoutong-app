# WS 日志转发能力

## 能力说明

`src/common/ws-log-forwarder` 提供开发环境日志转发器，支持通过 WebSocket 把 JS console 日志与网络请求日志发送到本地日志服务。

## 可以做什么

- 安装/卸载日志转发：`installWSLogger` / `uninstallWSLogger`
- 查看状态：`getWSLoggerStatus`
- 发送测试日志：`sendTestLog`
- 自动重连 WebSocket、缓存待发送日志
- 拦截 `fetch` 和 `XMLHttpRequest` 请求与响应

## 如何使用

1. 仅在开发环境启用（建议由调试开关控制）
2. 调用 `installWSLogger()` 安装
3. 在调试页可通过 `getWSLoggerStatus()` 查看连接状态
4. 页面卸载或关闭调试功能时调用 `uninstallWSLogger()`

## 使用示例

```ts
import {
  getWSLoggerStatus,
  installWSLogger,
  sendTestLog,
  uninstallWSLogger,
} from '~/common/ws-log-forwarder';

installWSLogger();
sendTestLog();
console.log(getWSLoggerStatus());

// 需要关闭时
uninstallWSLogger();
```
