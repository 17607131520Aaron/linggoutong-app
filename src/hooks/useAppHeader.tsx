import { useNavigation, useRoute } from '@react-navigation/native';
import React, { type ReactNode, useLayoutEffect, useMemo, useState } from 'react';

import { AppHeader, type AppHeaderProps } from '../components/AppHeader';

/** 头部组件和页面之间共享的上下文数据与方法 */
export interface AppHeaderContext extends AppHeaderProps {
  setTitle: (value: string) => void;
  setShowBack: (value: boolean) => void;
  setShowSearch: (value: boolean) => void;
}

export interface UseAppHeaderOptions extends Omit<AppHeaderProps, 'title'> {
  /** 初始标题，不传则使用路由名 */
  title?: string;
  /**
   * 自定义渲染 Header 的方法
   * 会拿到完整的 header 上下文（数据 + 操作），页面和组件可以共享同一套数据
   */
  renderHeader?: (ctx: AppHeaderContext) => ReactNode;
}

export interface UseAppHeaderResult {
  /** 当前 Header 的基础配置数据（给默认 AppHeader 用） */
  headerProps: AppHeaderProps;
  /** Header 与页面共享的上下文（数据 + 方法），自定义组件也用这个 */
  headerContext: AppHeaderContext;
  /** React Navigation 可直接使用的 header 组件 */
  header: () => React.ReactElement;
  /** 修改标题 */
  setTitle: (value: string) => void;
  /** 控制是否展示返回按钮 */
  setShowBack: (value: boolean) => void;
  /** 控制是否展示搜索按钮 */
  setShowSearch: (value: boolean) => void;
}

/**
 * 统一管理页面顶部导航的 Hook
 * - 支持在页面内部动态修改标题 / 按钮显示
 * - 自动通过 navigation.setOptions 注册到当前页面
 * - 支持传入 renderHeader 自定义渲染组件
 */
export const useAppHeader = (options: UseAppHeaderOptions = {}): UseAppHeaderResult => {
  const navigation = useNavigation();
  const route = useRoute();

  const [title, setTitle] = useState<string>(options.title ?? (route.name as string));
  const [showBack, setShowBack] = useState<boolean>(options.showBack ?? true);
  const [showSearch, setShowSearch] = useState<boolean>(options.showSearch ?? false);

  const headerProps: AppHeaderProps = useMemo(
    () => ({
      title,
      showBack,
      showSearch,
      onBackPress: options.onBackPress,
      onSearchPress: options.onSearchPress,
    }),
    [options.onBackPress, options.onSearchPress, showBack, showSearch, title],
  );

  const headerContext: AppHeaderContext = useMemo(
    () => ({
      ...headerProps,
      setTitle,
      setShowBack,
      setShowSearch,
    }),
    [headerProps, setShowBack, setShowSearch],
  );

  const header = useMemo(
    () => () =>
      options.renderHeader ? (
        <>{options.renderHeader(headerContext)}</>
      ) : (
        <AppHeader {...headerProps} />
      ),
    [headerContext, headerProps, options],
  );

  useLayoutEffect(() => {
    // 将自定义 Header 挂到当前页面的导航配置上
    navigation.setOptions({
      headerShown: true,
      header,
    });
  }, [header, navigation]);

  return {
    headerProps,
    headerContext,
    header,
    setTitle,
    setShowBack,
    setShowSearch,
  };
};
