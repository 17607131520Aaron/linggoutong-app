# 权限申请工具

## 能力说明

`src/common/permissions.ts` 封装了跨平台权限检查与申请流程，统一返回状态并提供常用权限快捷方法。

## 可以做什么

- 检查任意权限：`checkPermission`
- 申请任意权限：`requestAnyPermission`
- 快速申请常见权限：相机、相册、定位、麦克风、通讯录、日历、通知、蓝牙、运动权限
- 判断是否可用：`isGranted`
- 跳转系统设置：`goToAppSettings`

## 如何使用

1. 先调用某个 `requestXxxPermission`
2. 用 `isGranted(status)` 判断是否授权
3. 被永久拒绝时，引导用户去设置页

## 使用示例

```ts
import { Alert } from 'react-native';
import {
  goToAppSettings,
  isGranted,
  requestCameraPermission,
} from '~/common/permissions';

const ensureCamera = async (): Promise<boolean> => {
  const status = await requestCameraPermission();
  if (isGranted(status)) return true;

  Alert.alert('需要相机权限', '请在系统设置中开启后再使用扫码功能', [
    { text: '取消', style: 'cancel' },
    { text: '去设置', onPress: () => goToAppSettings().catch(() => undefined) },
  ]);
  return false;
};
```
