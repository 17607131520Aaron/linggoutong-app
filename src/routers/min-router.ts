import AboutPage from '~/pages/About';
import HomePage from '~/pages/Home';
import LoginPage from '~/pages/Login';
import MineHomePage from '~/pages/Mine';
import RegisterPage from '~/pages/Register';

import type { IRouteConfig } from './index';

const mineRoutes: IRouteConfig[] = [
  {
    name: 'Login',
    component: LoginPage,
    showHeader: true,
    options: {
      title: '登录',
    },
  },
  {
    name: 'Register',
    component: RegisterPage,
    showHeader: true,
    options: {
      title: '注册',
    },
  },
  {
    name: 'Home',
    component: HomePage,
    showHeader: true,
    options: {
      title: '首页 - KV 存储示例',
    },
  },
  {
    name: 'MineHome',
    component: MineHomePage,
    showHeader: true,
    options: {
      title: '我的',
    },
  },
  {
    name: 'About',
    component: AboutPage,
    showHeader: true,
    options: {
      title: '关于',
    },
  },
];

export default mineRoutes;
