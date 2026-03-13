import AboutPage from '~/pages/About';
import HomePage from '~/pages/Home';
import LoginPage from '~/pages/Login';
import MineHomePage from '~/pages/Mine';
import RegisterPage from '~/pages/Register';

const mineRoutes = [
  {
    name: 'Login',
    component: LoginPage,
    options: {
      title: '登录',
      headerShown: true,
    },
  },
  {
    name: 'Register',
    component: RegisterPage,
    options: {
      title: '注册',
      headerShown: true,
    },
  },
  {
    name: 'Home',
    component: HomePage,
    options: {
      title: '首页 - KV 存储示例',
      headerShown: true,
    },
  },
  {
    name: 'MineHome',
    component: MineHomePage,
    options: {
      title: '我的',
      headerShown: true,
    },
  },
  {
    name: 'About',
    component: AboutPage,
    options: {
      title: '关于',
      headerShown: true,
    },
  },
];

export default mineRoutes;
