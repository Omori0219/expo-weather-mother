import { createDrawerNavigator } from '@react-navigation/drawer';
import { WeatherScreen } from '../screens/WeatherScreen';
import { SetupScreen } from '../screens/SetupScreen';
import { TermsScreen } from '../screens/TermsScreen';
import { PrivacyPolicyScreen } from '../screens/PrivacyPolicyScreen';
import type { MainDrawerParamList } from '../types/navigation';
import { Platform } from 'react-native';

const Drawer = createDrawerNavigator<MainDrawerParamList>();

export function MainDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
            },
            android: {
              elevation: 4,
            },
          }),
        },
        headerTintColor: '#007AFF',
        headerTitleStyle: {
          ...Platform.select({
            ios: {
              fontWeight: '600',
            },
            android: {
              fontFamily: 'sans-serif-medium',
            },
          }),
        },
        drawerStyle: {
          backgroundColor: '#fff',
          width: 280,
        },
        drawerLabelStyle: {
          ...Platform.select({
            ios: {
              fontWeight: '400',
            },
            android: {
              fontFamily: 'sans-serif',
            },
          }),
        },
        drawerActiveTintColor: '#007AFF',
      }}
    >
      <Drawer.Screen
        name="Weather"
        component={WeatherScreen}
        options={{
          title: '天気',
          headerTitle: '天気予報',
        }}
      />
      <Drawer.Screen
        name="AreaSelect"
        children={() => <SetupScreen isInitialSetup={false} />}
        options={{
          title: '地域変更',
          headerTitle: '地域変更',
        }}
      />
      <Drawer.Screen
        name="Terms"
        component={TermsScreen}
        options={{
          title: '利用規約',
          headerTitle: '利用規約',
        }}
      />
      <Drawer.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{
          title: 'プライバシーポリシー',
          headerTitle: 'プライバシーポリシー',
        }}
      />
    </Drawer.Navigator>
  );
}
