import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { RootStackNavigationProp } from '../types/navigation';
import { useUser } from '../hooks/useUser';
import { PREFECTURE_LIST } from '../constants/prefectures';

export function SetupScreen() {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { saveUserData, isLoading, error } = useUser();
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null);

  // 都道府県選択時の処理
  const handlePrefectureSelect = async (areaCode: string) => {
    setSelectedPrefecture(areaCode);
    try {
      const success = await saveUserData(areaCode);
      if (success) {
        navigation.replace('Weather');
      }
    } catch (error) {
      // エラーは useUser 内で処理されるため、ここでは何もしない
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>お住まいの地域を選択してください</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <ScrollView style={styles.scrollView}>
        {PREFECTURE_LIST.map(prefecture => (
          <TouchableOpacity
            key={prefecture.areaCode}
            style={[
              styles.prefectureButton,
              selectedPrefecture === prefecture.areaCode && styles.selectedButton,
            ]}
            onPress={() => handlePrefectureSelect(prefecture.areaCode)}
          >
            <Text
              style={[
                styles.prefectureText,
                selectedPrefecture === prefecture.areaCode && styles.selectedButtonText,
              ]}
            >
              {prefecture.areaName}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  scrollView: {
    flex: 1,
  },
  prefectureButton: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  selectedButton: {
    backgroundColor: '#007AFF',
  },
  prefectureText: {
    fontSize: 16,
  },
  selectedButtonText: {
    color: '#fff',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});
