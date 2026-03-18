// 库管工作台路由管理
import LibraryHome from '~/pages/InventoryWorkbench/LibraryHome';
import {
  default as LibraryMineHome,
  default as LibrarySparePartHome,
} from '~/pages/InventoryWorkbench/LibrarySparePartHome';

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
];

export default libraryWorkbenchRoutes;
