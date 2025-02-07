import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { WeatherScreen } from '../screens/WeatherScreen';
import { SetupScreen } from '../screens/SetupScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { OthersScreen } from '../screens/OthersScreen';
import { Ionicons } from '@expo/vector-icons';
import type { MainTabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 100,
          backgroundColor: '#fff',
          borderTopWidth: 0,
          // borderTopColor: '#e0e0e0',
          ...Platform.select({
            ios: {
              // shadowColor: '#000',
              // shadowOffset: { width: 0, height: -2 },
              // shadowOpacity: 0.1,
              // shadowRadius: 4,
            },
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
      }}
    >
      <Tab.Screen
        name="Weather"
        component={WeatherScreen}
        options={{
          title: 'メイン',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sunny-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="AreaSelect"
        children={() => <SetupScreen isInitialSetup={false} />}
        options={{
          title: '地域',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="location-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: '通知',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Others"
        component={OthersScreen}
        options={{
          title: 'その他',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="menu-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
