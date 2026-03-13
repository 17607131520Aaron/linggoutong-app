import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { getTabsByRole } from '~/app/tabConfig';

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
        return (
          <Tab.Screen
            key={tab.name}
            component={tab.component}
            name={tab.name}
            options={{
              title: tab.label, // 使用 label 作为标题
              tabBarLabel: tab.label,
              tabBarIcon: ({ color }) => (
                <Text style={[styles.tabIcon, { color }]}>{tab.icon}</Text>
              ),
              headerShown: false,
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
