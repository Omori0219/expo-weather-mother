import { StyleSheet, View, Text } from 'react-native';

export function SetupScreen() {
  return (
    <View style={styles.container}>
      <Text>初期設定画面</Text>
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
