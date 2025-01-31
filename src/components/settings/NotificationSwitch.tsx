import React, { useState } from 'react';
import { View, Switch, Text, StyleSheet, Alert, Linking } from 'react-native';
import { useNotification } from '../../hooks/useNotification';

export function NotificationSwitch() {
  const [isEnabled, setIsEnabled] = useState(true);
  const { updateSettings, error, clearError } = useNotification();

  const toggleSwitch = async () => {
    try {
      await updateSettings(!isEnabled);
      setIsEnabled(!isEnabled);
    } catch (error) {
      Alert.alert(
        'エラー',
        '通知設定の更新に失敗しました。\n設定アプリから通知を許可してください。',
        [
          {
            text: '設定を開く',
            onPress: () => Linking.openSettings(),
          },
          {
            text: 'キャンセル',
            style: 'cancel',
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>プッシュ通知</Text>
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
      {error && (
        <Text style={styles.errorText} onPress={clearError}>
          {error.message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    flex: 1,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});
