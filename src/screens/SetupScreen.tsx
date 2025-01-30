import { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { AreaSelector } from '../components/AreaSelector';
import type { AreaData } from '../types/user';

export function SetupScreen() {
  const [selectedArea, setSelectedArea] = useState<AreaData | null>(null);

  const handleAreaSelect = (area: AreaData) => {
    setSelectedArea(area);
    // TODO: 選択された地域を保存する処理を実装
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>お住まいの地域を選択してください</Text>
        <Text style={styles.subtitle}>選択した地域の天気予報をお届けします</Text>
        <AreaSelector onSelect={handleAreaSelect} selectedAreaCode={selectedArea?.areaCode} />
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
});
