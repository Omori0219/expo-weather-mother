import { createDrawerNavigator } from '@react-navigation/drawer';
import { WeatherScreen } from '../screens/WeatherScreen';
import { SetupScreen } from '../screens/SetupScreen';
import { TermsScreen } from '../screens/TermsScreen';
import { PrivacyPolicyScreen } from '../screens/PrivacyPolicyScreen';
import type { MainDrawerParamList } from '../types/navigation';

const Drawer = createDrawerNavigator<MainDrawerParamList>();

export function MainDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#000',
        drawerStyle: {
          backgroundColor: '#fff',
          width: 280,
        },
      }}
    >
      <Drawer.Screen
        name="Weather"
        component={WeatherScreen}
        options={{
          title: '天気予報',
          drawerLabel: 'ホーム',
        }}
      />
      <Drawer.Screen
        name="AreaSelect"
        component={SetupScreen}
        options={{
          title: '地域設定',
          drawerLabel: '地域変更',
        }}
      />
      <Drawer.Screen
        name="Terms"
        component={TermsScreen}
        options={{
          title: '利用規約',
          drawerLabel: '利用規約',
        }}
      />
      <Drawer.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{
          title: 'プライバシーポリシー',
          drawerLabel: 'プライバシーポリシー',
        }}
      />
    </Drawer.Navigator>
  );
}
