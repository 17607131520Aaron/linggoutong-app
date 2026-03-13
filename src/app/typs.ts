/**
 * App 导航相关类型定义
 */

import type { ComponentType } from 'react';
// import type { INavigationBarProps } from '~/components/NavigationBar/types.ts';
export type TUserRole = 'engineer' | 'institution' | 'admin';
/** Tab 配置项 */
export interface ITabConfig {
  name: string;
  label: string;
  icon: string;
  component: ComponentType;
  moduleKey: string;
  /** 是否显示顶部标题栏（默认显示） */
  showHeader?: boolean;
  /** 自定义 NavigationBar 配置 */
  // navBarProps?: INavigationBarProps;
}
