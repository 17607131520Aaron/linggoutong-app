/**
 * 各角色的 Tab 配置
 */

import Home from '~/pages/Home';
import MineHome from '~/pages/Mine';
import colors from '~/common/colors';

import type { ITabConfig, TUserRole } from './typs.ts';

const MINE_TAB: ITabConfig = {
  name: 'MineTab',
  label: '我的',
  icon: '👤',
  component: MineHome,
  moduleKey: 'mine',
  // 示例：我的页显示顶部标题栏，并把主体内容区域背景改成白色
  showHeader: true,
  sceneStyle: {
    backgroundColor: colors.white,
  },
};

// 首页
const HOME_TAB: ITabConfig = {
  name: 'HomeTab',
  label: '首页',
  icon: '🏠',
  component: Home,
  moduleKey: 'home',
  // 示例：首页显示顶部标题栏，并自定义标题文案
  headerTitle: '首页 - KV 存储示例',
  showHeader: true,
};

// ==================== 各角色的 Tab 配置 ====================
const ROLE_TABS: Record<TUserRole, ITabConfig[]> = {
  engineer: [MINE_TAB],
  institution: [MINE_TAB],
  admin: [HOME_TAB, MINE_TAB],
};

// 默认 Tab 配置（未登录或角色未知时）
const DEFAULT_TABS: ITabConfig[] = [HOME_TAB, MINE_TAB];

/**
 * 根据角色获取 Tab 配置
 */
export const getTabsByRole = (role: TUserRole | null): ITabConfig[] => {
  if (!role) return DEFAULT_TABS;
  return ROLE_TABS[role] ?? DEFAULT_TABS;
};
