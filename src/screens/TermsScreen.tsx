import { StyleSheet, View, Text, ScrollView } from 'react-native';

export function TermsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>利用規約</Text>
        <Text style={styles.text}>
          この利用規約（以下、「本規約」といいます。）は、本アプリケーションの利用条件を定めるものです。
        </Text>
        {/* TODO: 実際の利用規約のコンテンツを追加 */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
});
