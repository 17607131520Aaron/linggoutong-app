import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { getTabsByRole } from '~/app/tabConfig';
import { AppHeader } from '~/components/AppHeader';

const Tab = createBottomTabNavigator();

const MainTabsScreen: React.FC = () => {
  const tabs = getTabsByRole('admin');

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}
    >
      {tabs.map((tab) => {
        const title = tab.headerTitle ?? tab.label;

        return (
          <Tab.Screen
            key={tab.name}
            component={tab.component}
            name={tab.name}
            options={{
              tabBarLabel: tab.label,
              tabBarIcon: ({ color }) => (
                <Text style={[styles.tabIcon, { color }]}>{tab.icon}</Text>
              ),
              headerShown: tab.showHeader ?? true,
              ...(tab.header
                ? {
                    // 如果配置了自定义 header 组件，则交给 React Navigation 渲染
                    header: tab.header,
                  }
                : {
                    // 默认使用统一风格的 AppHeader
                    header: () => <AppHeader showBack title={title} />,
                  }),
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 20,
  },
});

export default MainTabsScreen;
