import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NotificationSwitch } from './NotificationSwitch';
import { Ionicons } from '@expo/vector-icons';

export function NotificationSettings() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="notifications-outline" size={32} color="#DE0613" />
        <Text style={styles.headerTitle}>通知設定</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.description}>
          毎朝7時に、お母さんからの天気予報メッセージを受け取ることができます。
        </Text>
        <NotificationSwitch />
      </View>
      <View style={styles.noteSection}>
        <Ionicons name="information-circle-outline" size={20} color="#666" />
        <Text style={styles.note}>
          通知をオフにすると、お母さんからの天気予報メッセージを受け取ることができなくなります。
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  section: {
    marginVertical: 8,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
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
    marginBottom: 16,
  },
  noteSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF5F5',
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  note: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: '#666666',
  },
});
