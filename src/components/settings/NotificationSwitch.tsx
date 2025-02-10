import React, { useState, useEffect } from 'react';
import { View, Switch, Text, StyleSheet, Alert, Linking, ActivityIndicator } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useNotification } from '../../hooks/useNotification';

export function NotificationSwitch() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateSettings, error, clearError, requestPermissions, getExpoPushToken } =
    useNotification();

  // 初期状態の確認
  useEffect(() => {
    const checkInitialState = async () => {
      try {
        console.log('通知の初期状態を確認中...');
        const { status } = await Notifications.getPermissionsAsync();
        console.log('現在の通知権限状態:', status);
        setIsEnabled(status === 'granted');
      } catch (error) {
        console.error('通知状態の確認に失敗:', error);
      }
    };

    checkInitialState();
  }, []);

  const toggleSwitch = async () => {
    try {
      setIsUpdating(true);
      console.log('通知設定の切り替えを開始...');

      // 通知を有効にする場合は、権限の確認と取得を行う
      if (!isEnabled) {
        console.log('通知を有効にしようとしています...');
        const { status } = await requestPermissions();
        console.log('通知権限の状態:', status);

        if (status === 'granted') {
          console.log('通知権限が許可されました。トークンを取得します...');
          const token = await getExpoPushToken();
          console.log('取得したトークン:', token);
        } else {
          console.log('通知権限が拒否されました');
          throw new Error('通知権限が必要です');
        }
      }

      await updateSettings(!isEnabled);
      console.log('通知設定を更新しました:', !isEnabled);
      setIsEnabled(!isEnabled);
    } catch (error) {
      console.error('通知設定の更新に失敗:', error);
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
