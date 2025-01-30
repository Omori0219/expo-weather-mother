import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { AreaSelector } from '../components/AreaSelector';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { ErrorMessage } from '../components/ErrorMessage';
import { useUserData } from '../hooks/useUserData';
import type { AreaData } from '../types/user';

export function SetupScreen() {
  const [selectedArea, setSelectedArea] = useState<AreaData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userData, loadUserData, saveUserData } = useUserData();

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

  const handleAreaSelect = async (area: AreaData) => {
    try {
      setIsLoading(true);
      setError(null);
      setSelectedArea(area);
      await saveUserData({ areaCode: area.areaCode });
    } catch (err) {
      setError('地域の保存に失敗しました');
      setSelectedArea(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LoadingOverlay visible={isLoading} message="読み込み中..." />
      <View style={styles.content}>
        <Text style={styles.title}>お住まいの地域を選択してください</Text>
        <Text style={styles.subtitle}>選択した地域の天気予報をお届けします</Text>
        {error ? (
          <ErrorMessage message={error} onRetry={loadInitialData} />
        ) : (
          <>
            <AreaSelector
              onSelect={handleAreaSelect}
              selectedAreaCode={selectedArea?.areaCode || userData?.areaCode}
            />
            {(selectedArea || userData?.areaCode) && (
              <TouchableOpacity style={styles.nextButton}>
                <Text style={styles.nextButtonText}>次へ</Text>
              </TouchableOpacity>
            )}
          </>
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
