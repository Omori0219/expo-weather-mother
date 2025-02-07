import React from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import type { OthersStackNavigationProp } from '../types/navigation';

export function OthersScreen() {
  const navigation = useNavigation<OthersStackNavigationProp>();

  const menuItems = [
    { title: '利用規約', screen: 'Terms', icon: 'document-text-outline' },
    { title: 'プライバシーポリシー', screen: 'PrivacyPolicy', icon: 'shield-checkmark-outline' },
  ] as const;

  const handlePress = (screen: (typeof menuItems)[number]['screen']) => {
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        {menuItems.map((item, index) => (
          <Pressable
            key={item.screen}
            style={({ pressed }) => [
              styles.menuItem,
              index === menuItems.length - 1 && styles.lastMenuItem,
              pressed && styles.menuItemPressed,
            ]}
            onPress={() => handlePress(item.screen)}
            android_ripple={{ color: 'rgba(0, 0, 0, 0.1)' }}
          >
            <View style={styles.menuItemContent}>
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon as any} size={24} color="#666" style={styles.menuIcon} />
                <Text style={styles.menuText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#999" />
            </View>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    paddingVertical: 16,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  content: {
    flex: 1,
    marginTop: 20,
  },
  menuItem: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 12,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemPressed: {
    backgroundColor: Platform.select({
      ios: '#f0f0f0',
      android: '#fff',
    }),
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    ...Platform.select({
      ios: {
        fontWeight: '400',
      },
      android: {
        fontFamily: 'sans-serif',
      },
    }),
  },
});
