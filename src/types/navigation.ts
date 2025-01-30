import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Splash: undefined;
  Setup: undefined;
  Weather: undefined;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
