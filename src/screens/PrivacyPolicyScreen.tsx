import { StyleSheet, View, Text, ScrollView } from 'react-native';

export function PrivacyPolicyScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>プライバシーポリシー</Text>
        <Text style={styles.text}>
          当アプリケーションは、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。
        </Text>
        {/* TODO: 実際のプライバシーポリシーのコンテンツを追加 */}
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
