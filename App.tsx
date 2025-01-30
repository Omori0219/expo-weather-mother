import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { RootStackParamList } from './src/types/navigation';
import { SplashScreen } from './src/screens/SplashScreen';
import { SetupScreen } from './src/screens/SetupScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Setup" component={SetupScreen} />
        {/* 他の画面は後で実装 */}
        {/* <Stack.Screen name="Main" component={MainScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
