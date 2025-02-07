import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SetupScreen } from '../screens/SetupScreen';
import { MainDrawer } from './MainDrawer';
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
      <Stack.Screen name="Main" component={MainDrawer} />
    </Stack.Navigator>
  );
}
