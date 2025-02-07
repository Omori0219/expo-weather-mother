import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OthersScreen } from '../screens/OthersScreen';
import { TermsScreen } from '../screens/TermsScreen';
import { PrivacyPolicyScreen } from '../screens/PrivacyPolicyScreen';
import type { OthersStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<OthersStackParamList>();

export function OthersStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="OthersHome"
        component={OthersScreen}
        options={{
          title: 'その他',
        }}
      />
      <Stack.Screen
        name="Terms"
        component={TermsScreen}
        options={{
          title: '利用規約',
        }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{
          title: 'プライバシーポリシー',
        }}
      />
    </Stack.Navigator>
  );
}
