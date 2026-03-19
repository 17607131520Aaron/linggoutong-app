// 库管工作台路由管理
import LibraryHome from '~/pages/InventoryWorkbench/LibraryHome';
import LibraryMineHome from '~/pages/InventoryWorkbench/LibraryMineHome';
import LibraryScan from '~/pages/InventoryWorkbench/LibraryScan';
import LibrarySparePartHome from '~/pages/InventoryWorkbench/LibrarySparePartHome';

import type { IRouteConfig } from './index';

const libraryWorkbenchRoutes: IRouteConfig[] = [
  {
    name: 'LibraryHome',
    component: LibraryHome,
    showHeader: true,
    options: {
      title: '首页',
    },
  },
  {
    name: 'LibraryMineHome',
    component: LibraryMineHome,
    showHeader: true,
    options: {
      title: '我的',
    },
  },
  {
    name: 'LibrarySparePartHome',
    component: LibrarySparePartHome,
    showHeader: true,
    options: {
      title: '备件管理',
    },
  },
  {
    name: 'LibraryScan',
    component: LibraryScan,
    showHeader: true,
    options: {
      title: '扫描串码SN',
    },
  },
];

export default libraryWorkbenchRoutes;
