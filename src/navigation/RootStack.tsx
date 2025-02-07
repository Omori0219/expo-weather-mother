import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SetupScreen } from '../screens/SetupScreen';
import { MainTabs } from './MainTabs';
import { TermsScreen } from '../screens/TermsScreen';
import { PrivacyPolicyScreen } from '../screens/PrivacyPolicyScreen';
import type { RootStackParamList } from '../types/navigation';
import { useAuth } from '../contexts/AuthContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootStack() {
  const { isInitialSetupComplete } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={isInitialSetupComplete ? 'Main' : 'Setup'}
    >
      <Stack.Screen name="Setup" children={() => <SetupScreen isInitialSetup={true} />} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen
        name="Terms"
        component={TermsScreen}
        options={{
          headerShown: true,
          title: '利用規約',
        }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{
          headerShown: true,
          title: 'プライバシーポリシー',
        }}
      />
    </Stack.Navigator>
  );
}
