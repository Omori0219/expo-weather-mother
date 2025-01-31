import { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RootStackNavigationProp, MainDrawerNavigationProp } from '../types/navigation';
import { useUser } from '../hooks/useUser';
import { PREFECTURE_LIST } from '../constants/prefectures';

type SetupScreenProps = {
  isInitialSetup?: boolean;
};

export function SetupScreen({ isInitialSetup = false }: SetupScreenProps) {
  const stackNavigation = useNavigation<RootStackNavigationProp>();
  const drawerNavigation = useNavigation<MainDrawerNavigationProp>();
  const { saveUserData, isLoading, error } = useUser();
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null);

  // 地域選択後の処理
  const handlePrefectureSelect = useCallback(
    async (areaCode: string) => {
      setSelectedPrefecture(areaCode);
      try {
        const success = await saveUserData(areaCode);
        if (success) {
          if (isInitialSetup) {
            // 初期設定時はメイン画面に遷移
            stackNavigation.replace('Main');
          } else {
            // 地域変更時は前の画面に戻る
            drawerNavigation.navigate('Weather');
          }
        }
      } catch (error) {
        // エラーは useUser 内で処理されるため、ここでは何もしない
      }
    },
    [isInitialSetup, stackNavigation, drawerNavigation, saveUserData]
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isInitialSetup ? 'お住まいの地域を選択してください' : '地域を変更'}
      </Text>
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
