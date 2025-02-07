import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function PrivacyPolicyScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="shield-checkmark-outline" size={32} color="#DE0613" />
          <Text style={styles.headerTitle}>プライバシーポリシー</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.description}>
            当アプリケーションは、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。
          </Text>
          {/* TODO: 実際のプライバシーポリシーのコンテンツを追加 */}
        </View>
      </View>
    </ScrollView>
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
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#4A4A4A',
  },
});
