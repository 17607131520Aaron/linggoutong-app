/**
 * 各角色的 Tab 配置
 */

import Home from '~/pages/Home';
import LibraryHome from '~/pages/InventoryWorkbench/LibraryHome';
import LibraryMineHome from '~/pages/InventoryWorkbench/LibraryMineHome';
import LibrarySparePartHome from '~/pages/InventoryWorkbench/LibrarySparePartHome';
import MineHome from '~/pages/Mine';

import type { ITabConfig, TUserRole } from './typs.ts';

const MINE_TAB: ITabConfig = {
  name: 'MineTab',
  label: '我的',
  icon: '👤',
  component: MineHome,
  moduleKey: 'mine',
  showHeader: false,
};

// 首页
const HOME_TAB: ITabConfig = {
  name: 'HomeTab',
  label: '首页',
  icon: '🏠',
  component: Home,
  moduleKey: 'home',
  headerTitle: '首页',
  showHeader: false,
};

// 默认 Tab 配置（未登录或角色未知时）
const DEFAULT_TABS: ITabConfig[] = [HOME_TAB, MINE_TAB];

// 库管-首页
const LIBRARY_TAB: ITabConfig = {
  name: 'LibraryTab',
  label: '库管',
  icon: '🏠',
  component: LibraryHome,
  moduleKey: 'library',
  showHeader: false,
};

// 库管-备件管理
const LIBRARY_SPARE_PART_TAB: ITabConfig = {
  name: 'LibrarySparePartTab',
  label: '备件管理',
  icon: '🔩',
  component: LibrarySparePartHome,
  moduleKey: 'librarySparePart',
  showHeader: false,
};

// 库管-我的
const LIBRARY_MINE_TAB: ITabConfig = {
  name: 'LibraryMineTab',
  label: '我的',
  icon: '👤',
  component: LibraryMineHome,
  moduleKey: 'libraryMine',
  showHeader: false,
};

// 库管角色的tab配置
const LIBRARY_TABS: ITabConfig[] = [LIBRARY_TAB, LIBRARY_SPARE_PART_TAB, LIBRARY_MINE_TAB];

// ==================== 各角色的 Tab 配置 ====================
const ROLE_TABS: Record<TUserRole, ITabConfig[]> = {
  engineer: [MINE_TAB],
  institution: [MINE_TAB],
  admin: [HOME_TAB, MINE_TAB],
  library: LIBRARY_TABS,
};

/**
 * 根据角色获取 Tab 配置
 */
export const getTabsByRole = (role: TUserRole | null): ITabConfig[] => {
  if (!role) return LIBRARY_TABS;
  return ROLE_TABS[role] ?? DEFAULT_TABS;
};
