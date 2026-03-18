import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { getTabsByRole } from '~/app/tabConfig';
import colors from '~/common/colors';
import HeaderBar from '~/components/header-bar';

const Tab = createBottomTabNavigator();
const defaultSceneStyle = {
  flex: 1,
  backgroundColor: colors.pageBackground,
} as const;

const MainTabsScreen: React.FC = () => {
  const tabs = getTabsByRole('library');

  return (
    <Tab.Navigator
      screenOptions={() => ({
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        headerBackVisible: false,
        headerShadowVisible: false,

        header: (props) => <HeaderBar {...props} title={props.options.title} />,
        sceneStyle: defaultSceneStyle,
      })}
    >
      {tabs.map((tab) => {
        return (
          <Tab.Screen
            key={tab.name}
            component={tab.component}
            name={tab.name}
            options={{
              headerShown: tab.showHeader ?? true,
              tabBarLabel: tab.label,
              title: tab.headerTitle ?? tab.label,
              sceneStyle: tab.sceneStyle ? [defaultSceneStyle, tab.sceneStyle] : defaultSceneStyle,
              tabBarIcon: ({ color }) => (
                <Text style={[styles.tabIcon, { color }]}>{tab.icon}</Text>
              ),
              ...tab.options,
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
