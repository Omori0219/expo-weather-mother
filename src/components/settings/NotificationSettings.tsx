import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NotificationSwitch } from './NotificationSwitch';

export function NotificationSettings() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>通知設定</Text>
        <Text style={styles.description}>
          毎朝7時に、お母さんからの天気予報メッセージを受け取ることができます。
        </Text>
        <NotificationSwitch />
      </View>
      <View style={styles.section}>
        <Text style={styles.note}>
          ※ 通知をオフにすると、お母さんからの天気予報メッセージを受け取ることができなくなります。
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    marginVertical: 8,
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  note: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
});
