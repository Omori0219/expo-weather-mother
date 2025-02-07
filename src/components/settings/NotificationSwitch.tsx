import React, { useState } from 'react';
import { View, Switch, Text, StyleSheet, Alert, Linking, ActivityIndicator } from 'react-native';
import { useNotification } from '../../hooks/useNotification';

export function NotificationSwitch() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateSettings, error, clearError } = useNotification();

  const toggleSwitch = async () => {
    try {
      setIsUpdating(true);
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
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.switchContainer}>
        <Text style={styles.label}>プッシュ通知</Text>
        {isUpdating ? (
          <ActivityIndicator size="small" color="#DE0613" style={styles.loader} />
        ) : (
          <Switch
            trackColor={{ false: '#E0E0E0', true: '#FFC6C9' }}
            thumbColor={isEnabled ? '#DE0613' : '#FFFFFF'}
            ios_backgroundColor="#E0E0E0"
            onValueChange={toggleSwitch}
            value={isEnabled}
            style={styles.switch}
          />
        )}
      </View>
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
    backgroundColor: 'transparent',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  switch: {
    transform: [{ scale: 0.9 }],
  },
  loader: {
    marginRight: 6,
  },
  errorText: {
    color: '#DE0613',
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
});
