import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { app } from './src/config/firebase';

export default function App() {
  useEffect(() => {
    // Firebaseの初期化を確認
    if (app) {
      console.log('Firebase initialized successfully');
    }
  }, []);

  return (
    <View style={styles.container}>
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
