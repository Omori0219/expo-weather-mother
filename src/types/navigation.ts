import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { DrawerNavigationProp } from '@react-navigation/drawer';

// Stack Navigation
export type RootStackParamList = {
  Setup: undefined;
  Main: undefined;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Drawer Navigation
export type MainDrawerParamList = {
  Weather: undefined;
  AreaSelect: undefined;
  Terms: undefined;
  PrivacyPolicy: undefined;
};

export type MainDrawerNavigationProp = DrawerNavigationProp<MainDrawerParamList>;
