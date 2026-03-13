import mineRoutes from './min-router';

import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import type { ComponentType } from 'react';

export interface IRouteConfig {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
  options?: NativeStackNavigationOptions;
  /** 自定义 NavigationBar 配置 */
  // navBarProps?: INavigationBarProps;
  /** 是否为 Tab 首页（不注册到 Root Stack） */
  isTabHome?: boolean;
  /** 是否使用安全区域包裹（默认 true） */
  useSafeArea?: boolean;
}

export const allRoutes: IRouteConfig[] = [...mineRoutes];
