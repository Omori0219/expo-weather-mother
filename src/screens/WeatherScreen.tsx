import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { ErrorMessage } from '../components/ErrorMessage';
import { useUserData } from '../hooks/useUserData';
import { useState, useEffect } from 'react';

export function WeatherScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userData, loadUserData } = useUserData();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await loadUserData();
    } catch (err) {
      setError('データの読み込みに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LoadingOverlay visible={isLoading} message="読み込み中..." />
      <View style={styles.content}>
        {error ? (
          <ErrorMessage message={error} onRetry={loadInitialData} />
        ) : (
          <Text style={styles.placeholder}>
            {userData?.areaCode ? `${userData.areaCode}の天気情報` : '地域が設定されていません'}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
});
