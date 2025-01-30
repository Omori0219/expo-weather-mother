import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { useAuth } from './src/hooks/useAuth';

export default function App() {
  const { user, loading, error, signInAnonymously } = useAuth();

  useEffect(() => {
    // アプリ起動時に匿名認証を実行
    if (!user && !loading && !error) {
      console.log('Attempting anonymous sign in...');
      signInAnonymously().catch(e => {
        console.error('Sign in error:', e);
      });
    }
  }, [user, loading, error, signInAnonymously]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    console.error('Auth error:', error);
    return (
      <View style={styles.container}>
        <Text>エラーが発生しました: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>ユーザーID: {user?.uid}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
