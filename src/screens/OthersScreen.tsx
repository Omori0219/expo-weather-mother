import React from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import type { OthersStackNavigationProp } from '../types/navigation';

export function OthersScreen() {
  const navigation = useNavigation<OthersStackNavigationProp>();

  const menuItems = [
    {
      title: '利用規約',
      screen: 'Terms',
      icon: 'document-text-outline',
      description: 'アプリケーションの利用規約をご確認いただけます。',
    },
    {
      title: 'プライバシーポリシー',
      screen: 'PrivacyPolicy',
      icon: 'shield-checkmark-outline',
      description: '個人情報の取り扱いについてご確認いただけます。',
    },
  ] as const;

  const handlePress = (screen: (typeof menuItems)[number]['screen']) => {
    navigation.navigate(screen);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="settings-outline" size={32} color="#DE0613" />
          <Text style={styles.headerTitle}>その他の設定</Text>
        </View>
        {menuItems.map(item => (
          <Pressable
            key={item.screen}
            style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
            onPress={() => handlePress(item.screen)}
          >
            <View style={styles.menuItemContent}>
              <View style={styles.menuItemIconContainer}>
                <Ionicons name={item.icon as any} size={24} color="#DE0613" />
              </View>
              <View style={styles.menuItemTextContainer}>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
                <Text style={styles.menuItemDescription}>{item.description}</Text>
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
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  menuItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItemPressed: {
    opacity: 0.7,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuItemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
  },
});
