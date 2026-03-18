/**
 * App 导航相关类型定义
 */

import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import type { ComponentType, ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
// import type { INavigationBarProps } from '~/components/NavigationBar/types.ts';

export type TUserRole = 'engineer' | 'institution' | 'admin' | 'library';

/** Tab 配置项 */
export interface ITabConfig {
  name: string;
  label: string;
  icon: string;
  component: ComponentType;
  moduleKey: string;
  /** 是否显示顶部标题栏（默认显示） */
  showHeader?: boolean;
  /** 自定义标题文本（不传则使用 label） */
  headerTitle?: string;
  /**
   * 自定义顶部标题组件
   * 如果提供，则优先使用该组件作为 header
   */
  header?: () => ReactNode;
  /** 自定义顶部导航栏以下的页面内容区域样式 */
  sceneStyle?: StyleProp<ViewStyle>;
  /** 原生 Tab 配置透传 */
  options?: BottomTabNavigationOptions;
  /** 自定义 NavigationBar 配置 */
  // navBarProps?: INavigationBarProps;
}
