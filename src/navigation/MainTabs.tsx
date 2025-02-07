import React from 'react';
import { Platform } from 'react-native';
import {
  createBottomTabNavigator,
  BottomTabNavigationOptions,
} from '@react-navigation/bottom-tabs';
import { WeatherScreen } from '../screens/WeatherScreen';
import { SetupScreen } from '../screens/SetupScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { OthersScreen } from '../screens/OthersScreen';
import { Ionicons } from '@expo/vector-icons';
import type { MainTabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<MainTabParamList>();

// タブナビゲーターの共通設定
const TAB_NAVIGATOR_SCREEN_OPTIONS: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarStyle: {
    height: 100,
    backgroundColor: '#fff',
    borderTopWidth: 0,
    ...Platform.select({
      ios: {},
      android: {
        elevation: 8,
      },
    }),
  },
  tabBarItemStyle: {
    paddingBottom: 8,
    paddingTop: 12,
  },
  tabBarActiveTintColor: '#DE0613',
  tabBarInactiveTintColor: '#999',
};

// 各画面の設定
const TAB_SCREENS = [
  {
    name: 'Weather' as const,
    component: WeatherScreen,
    options: {
      title: 'メイン',
      tabBarIcon: ({ color, size }: { color: string; size: number }) => (
        <Ionicons name="sunny-outline" size={size} color={color} />
      ),
    },
  },
  {
    name: 'AreaSelect' as const,
    component: () => <SetupScreen isInitialSetup={false} />,
    options: {
      title: '地域',
      tabBarIcon: ({ color, size }: { color: string; size: number }) => (
        <Ionicons name="location-outline" size={size} color={color} />
      ),
    },
  },
  {
    name: 'Settings' as const,
    component: SettingsScreen,
    options: {
      title: '通知',
      tabBarIcon: ({ color, size }: { color: string; size: number }) => (
        <Ionicons name="notifications-outline" size={size} color={color} />
      ),
    },
  },
  {
    name: 'Others' as const,
    component: OthersScreen,
    options: {
      title: 'その他',
      tabBarIcon: ({ color, size }: { color: string; size: number }) => (
        <Ionicons name="menu-outline" size={size} color={color} />
      ),
    },
  },
];

export function MainTabs() {
  return (
    <Tab.Navigator screenOptions={TAB_NAVIGATOR_SCREEN_OPTIONS}>
      {TAB_SCREENS.map(screen => (
        <Tab.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={screen.options}
        />
      ))}
    </Tab.Navigator>
  );
}
