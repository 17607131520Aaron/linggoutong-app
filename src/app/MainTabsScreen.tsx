import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { getTabsByRole } from '~/app/tabConfig';
import colors from '~/common/colors';
import HeaderBar from '~/components/header-bar';

const Tab = createBottomTabNavigator();

const MainTabsScreen: React.FC = () => {
  const tabs = getTabsByRole('admin');

  return (
    <Tab.Navigator
      screenOptions={() => ({
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        headerBackVisible: false,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: colors.bg,
          height: 48,
        },
        header: (props) => <HeaderBar {...props} title={props.route.name} />,
        sceneContainerStyle: {
          flex: 1,
          backgroundColor: 'red',
        },
      })}
    >
      {tabs.map((tab) => {
        return (
          <Tab.Screen
            key={tab.name}
            component={tab.component}
            name={tab.name}
            options={{
              tabBarLabel: tab.label,
              title: tab.label,
              tabBarIcon: ({ color }) => (
                <Text style={[styles.tabIcon, { color }]}>{tab.icon}</Text>
              ),
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
