import { Platform } from 'react-native';
import {
  check,
  checkNotifications,
  openSettings,
  PERMISSIONS,
  request,
  requestNotifications,
  RESULTS,
} from 'react-native-permissions';

import type { Permission } from 'react-native-permissions';

export type PermissionStatus =
  | typeof RESULTS.UNAVAILABLE
  | typeof RESULTS.DENIED
  | typeof RESULTS.LIMITED
  | typeof RESULTS.GRANTED
  | typeof RESULTS.BLOCKED;

/**
 * 统一处理「检查 + 请求」的通用逻辑
 * 返回最终状态（可能仍然是 denied / blocked）
 */
const checkAndRequest = async (permission: Permission): Promise<PermissionStatus> => {
  const current = (await check(permission)) as PermissionStatus;

  if (current === RESULTS.DENIED) {
    const next = (await request(permission)) as PermissionStatus;
    return next;
  }

  return current;
};

/** 通用：检查权限但不请求 */
export const checkPermission = async (permission: Permission): Promise<PermissionStatus> => {
  const status = await check(permission);
  return status as PermissionStatus;
};

/** 通用：先检查，如有需要再请求（支持所有 Permission 常量） */
export const requestAnyPermission = async (permission: Permission): Promise<PermissionStatus> => {
  return checkAndRequest(permission);
};

/** 相机权限 */
export const requestCameraPermission = async (): Promise<PermissionStatus> => {
  const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

  return checkAndRequest(permission);
};

/** 相册 / 媒体库权限 */
export const requestPhotoPermission = async (): Promise<PermissionStatus> => {
  let permission: Permission;

  if (Platform.OS === 'ios') {
    permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
  } else {
    // Android 13+ 推荐 READ_MEDIA_IMAGES，旧版本使用 READ_EXTERNAL_STORAGE
    permission =
      PERMISSIONS.ANDROID.READ_MEDIA_IMAGES in PERMISSIONS.ANDROID
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
  }

  return checkAndRequest(permission);
};

/** 位置（定位）权限：默认使用「使用期间」定位 */
export const requestLocationPermission = async (): Promise<PermissionStatus> => {
  const permission =
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

  return checkAndRequest(permission);
};

/** 位置（始终允许）权限 */
export const requestLocationAlwaysPermission = async (): Promise<PermissionStatus> => {
  if (Platform.OS === 'ios') {
    return checkAndRequest(PERMISSIONS.IOS.LOCATION_ALWAYS);
  }

  if (Platform.OS === 'android') {
    return checkAndRequest(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION);
  }

  return RESULTS.UNAVAILABLE;
};

/** 麦克风权限 */
export const requestMicrophonePermission = async (): Promise<PermissionStatus> => {
  const permission =
    Platform.OS === 'ios' ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO;

  return checkAndRequest(permission);
};

/** 通讯录权限 */
export const requestContactsPermission = async (): Promise<PermissionStatus> => {
  const permission =
    Platform.OS === 'ios' ? PERMISSIONS.IOS.CONTACTS : PERMISSIONS.ANDROID.READ_CONTACTS;

  return checkAndRequest(permission);
};

/** 日历权限 */
export const requestCalendarPermission = async (): Promise<PermissionStatus> => {
  const permission =
    Platform.OS === 'ios' ? PERMISSIONS.IOS.CALENDARS : PERMISSIONS.ANDROID.READ_CALENDAR;

  return checkAndRequest(permission);
};

/** 运动 / 步数 等（移动与体能活动） */
export const requestActivityPermission = async (): Promise<PermissionStatus> => {
  if (Platform.OS === 'ios') {
    return checkAndRequest(PERMISSIONS.IOS.MOTION);
  }

  if (Platform.OS === 'android') {
    return checkAndRequest(PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION);
  }

  return RESULTS.UNAVAILABLE;
};

/** 蓝牙相关权限 */
export const requestBluetoothPermission = async (): Promise<PermissionStatus> => {
  if (Platform.OS === 'android') {
    // Android 12+ 使用新的蓝牙权限
    const androidPermissions = PERMISSIONS.ANDROID as Record<string, Permission>;
    if ('BLUETOOTH_CONNECT' in androidPermissions && 'BLUETOOTH_SCAN' in androidPermissions) {
      // 这里只申请 CONNECT，SCAN 在使用扫描功能前可以单独再申请
      return checkAndRequest(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT);
    }

    return checkAndRequest(PERMISSIONS.ANDROID.BLUETOOTH_SCAN);
  }

  return RESULTS.UNAVAILABLE;
};

/** 通知权限（iOS 需要显式申请，Android 13+ 也需要） */
export const requestNotificationPermission = async (): Promise<PermissionStatus> => {
  const { status: current } = await checkNotifications();

  if (current === RESULTS.DENIED) {
    const { status: next } = await requestNotifications(['alert', 'sound', 'badge']);
    return next as PermissionStatus;
  }

  return current as PermissionStatus;
};

/** 是否已经授权（工具函数） */
export const isGranted = (status: PermissionStatus): boolean => {
  return status === RESULTS.GRANTED || status === RESULTS.LIMITED;
};

/** 引导用户去系统设置页修改权限 */
export const goToAppSettings = async (): Promise<void> => {
  await openSettings();
};
