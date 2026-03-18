import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { RootSiblingParent } from 'react-native-root-siblings';

import colors from '~/common/colors';
import HeaderBar from '~/components/header-bar';
import { allRoutes } from '~/routers';

const RootStack = createNativeStackNavigator();
const defaultContentStyle = {
  backgroundColor: colors.bg,
  flex: 1,
} as const;

const AppContent: React.FC = () => {
  // 获取本地的用户信息
  const getUserInfo = async (): Promise<void> => {
    // const userInfo = await userRealm.getUser();
    // if (!userInfo) {
    //   // 跳转到登录页面
    // }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerBackVisible: false,
          headerShadowVisible: false,
          animation: 'slide_from_right',
          contentStyle: defaultContentStyle,
          header: (props) => <HeaderBar {...props} title={props.route.name} />,
        }}
      >
        {allRoutes.map((route) => {
          const routeOptions = {
            headerShown: route.options?.headerShown ?? false,
            contentStyle: route.contentStyle
              ? [defaultContentStyle, route.contentStyle]
              : defaultContentStyle,
            ...route.options,
          };

          return (
            <RootStack.Screen
              key={route.name}
              component={route.component}
              name={route.name}
              options={routeOptions}
            />
          );
        })}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

const App: React.FC = () => {
  return (
    <RootSiblingParent>
      <AppContent />
    </RootSiblingParent>
  );
};

export default App;
