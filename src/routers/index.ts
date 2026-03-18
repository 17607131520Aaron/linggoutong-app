import MainTabsScreen from '~/app/MainTabsScreen.tsx';

import mineRoutes from './min-router';

import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import type { ComponentType } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface IRouteConfig {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
  options?: NativeStackNavigationOptions;
  /** 自定义顶部导航栏以下的页面内容区域样式 */
  contentStyle?: StyleProp<ViewStyle>;
  /** 是否为 Tab 首页（不注册到 Root Stack） */
  isTabHome?: boolean;
  /** 是否使用安全区域包裹（默认 true） */
  useSafeArea?: boolean;
}

export const allRoutes: IRouteConfig[] = [
  {
    name: 'MainTabs',
    component: MainTabsScreen,
    options: {
      headerShown: false,
    },
  },
  ...mineRoutes,
];
