import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import { useAuth } from './src/hooks/useAuth';

export default function App() {
  const { user, loading, signInAnonymouslyAsync } = useAuth();

  useEffect(() => {
    // アプリ起動時に匿名サインインを試みる
    if (!loading && !user) {
      signInAnonymouslyAsync().catch(console.error);
    }
  }, [loading, user]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>{user ? `Signed in as: ${user.uid}` : 'Not signed in'}</Text>
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
