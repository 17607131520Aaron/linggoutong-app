import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { RootSiblingParent } from 'react-native-root-siblings';

import StartupErrorScreen from '~/app/StartupErrorScreen';
import StartupScreen from '~/app/StartupScreen';
import colors from '~/common/colors';
import HeaderBar from '~/components/header-bar';
import { allRoutes } from '~/routers';

const RootStack = createNativeStackNavigator();
const STARTUP_MIN_DURATION = 600;
const STARTUP_TIMEOUT = 8000;
const defaultContentStyle = {
  backgroundColor: colors.pageBackground,
  flex: 1,
} as const;

type TStartupStatus = 'bootstrapping' | 'ready' | 'failed';

const getUserInfo = async (): Promise<void> => {
  // const userInfo = await userRealm.getUser();
  // if (!userInfo) {
  //   // 跳转到登录页面
  // }
};

const preloadResources = async (): Promise<void> => {
  // 在这里集中等待首屏必须资源，避免首次冷启动白屏。
  await Promise.all([getUserInfo()]);
};

const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('startup timeout'));
    }, timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error: unknown) => {
        clearTimeout(timer);
        reject(error);
      });
  });
};

const AppContent: React.FC = () => {
  const [startupStatus, setStartupStatus] = useState<TStartupStatus>('bootstrapping');
  const [bootstrapAttempt, setBootstrapAttempt] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const bootstrapApp = async (): Promise<void> => {
      try {
        await withTimeout(
          Promise.all([
            preloadResources(),
            new Promise((resolve) => setTimeout(resolve, STARTUP_MIN_DURATION)),
          ]),
          STARTUP_TIMEOUT,
        );
        if (isMounted) {
          setStartupStatus('ready');
        }
      } catch {
        if (isMounted) {
          setStartupStatus('failed');
        }
      }
    };

    bootstrapApp().catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, [bootstrapAttempt]);

  if (startupStatus === 'bootstrapping') {
    return <StartupScreen />;
  }

  if (startupStatus === 'failed') {
    return (
      <StartupErrorScreen
        onRetry={() => {
          setStartupStatus('bootstrapping');
          setBootstrapAttempt((value) => value + 1);
        }}
      />
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerBackVisible: false,
          headerShadowVisible: false,
          animation: 'slide_from_right',
          contentStyle: defaultContentStyle,
          header: (props) => <HeaderBar {...props} title={props.options.title} />,
        }}
      >
        {allRoutes.map((route) => {
          const routeOptions = {
            headerShown: route.showHeader ?? route.options?.headerShown ?? false,
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
