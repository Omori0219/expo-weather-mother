import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { AreaSelector } from '../components/AreaSelector';
import { useUserData } from '../hooks/useUserData';
import type { AreaData } from '../types/user';

export function SetupScreen() {
  const [selectedArea, setSelectedArea] = useState<AreaData | null>(null);
  const { userData, loadUserData, saveUserData } = useUserData();

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleAreaSelect = async (area: AreaData) => {
    setSelectedArea(area);
    await saveUserData({ areaCode: area.areaCode });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>お住まいの地域を選択してください</Text>
        <Text style={styles.subtitle}>選択した地域の天気予報をお届けします</Text>
        <AreaSelector
          onSelect={handleAreaSelect}
          selectedAreaCode={selectedArea?.areaCode || userData?.areaCode}
        />
        {(selectedArea || userData?.areaCode) && (
          <TouchableOpacity style={styles.nextButton}>
            <Text style={styles.nextButtonText}>次へ</Text>
          </TouchableOpacity>
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
  nextButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    marginHorizontal: 16,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
