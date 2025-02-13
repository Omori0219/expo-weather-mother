import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// Stack Navigation
export type OthersStackParamList = {
  OthersHome: undefined;
  Terms: undefined;
  PrivacyPolicy: undefined;
};

export type RootStackParamList = {
  Setup: undefined;
  Main: undefined;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Bottom Tab Navigation
export type MainTabParamList = {
  Weather: undefined;
  AreaSelect: undefined;
  Settings: undefined;
  Others: undefined;
};

export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;
export type OthersStackNavigationProp = NativeStackNavigationProp<OthersStackParamList>;
