import { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { RootStackNavigationProp, MainDrawerNavigationProp } from '../types/navigation';
import { useWeatherManager } from '../hooks/useWeatherManager';
import { PREFECTURE_LIST } from '../constants/prefectures';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type SetupScreenProps = {
  isInitialSetup?: boolean;
};

export function SetupScreen({ isInitialSetup = false }: SetupScreenProps) {
  const stackNavigation = useNavigation<RootStackNavigationProp>();
  const drawerNavigation = useNavigation<MainDrawerNavigationProp>();
  const insets = useSafeAreaInsets();
  const { updateAreaAndWeather, isWeatherLoading, error } = useWeatherManager();
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null);

  // 地域選択後の処理
  const handlePrefectureSelect = useCallback(
    async (areaCode: string) => {
      setSelectedPrefecture(areaCode);
      try {
        const success = await updateAreaAndWeather(areaCode);
        if (success) {
          if (isInitialSetup) {
            // 初期設定時はメイン画面に遷移
            stackNavigation.replace('Main');
          } else {
            // 地域変更時は前の画面に戻る
            drawerNavigation.goBack();
          }
        }
      } catch (error) {
        // エラーは useWeatherManager 内で処理されるため、ここでは何もしない
      }
    },
    [isInitialSetup, stackNavigation, drawerNavigation, updateAreaAndWeather]
  );

  const containerStyle = {
    ...styles.container,
    paddingTop: Platform.OS === 'android' ? insets.top : 0,
  };

  if (isWeatherLoading) {
    return (
      <SafeAreaView style={containerStyle}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={containerStyle}>
      <Text style={styles.title}>
        {isInitialSetup ? 'お住まいの地域を選択してください' : '地域を変更'}
      </Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 20,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        fontWeight: '600',
      },
      android: {
        fontFamily: 'sans-serif-medium',
      },
    }),
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingBottom: insets => insets.bottom + 16,
  },
  prefectureButton: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  selectedButton: {
    backgroundColor: '#007AFF',
  },
  prefectureText: {
    fontSize: 16,
    ...Platform.select({
      ios: {
        fontWeight: '400',
      },
      android: {
        fontFamily: 'sans-serif',
      },
    }),
  },
  selectedButtonText: {
    color: '#fff',
    ...Platform.select({
      ios: {
        fontWeight: '600',
      },
      android: {
        fontFamily: 'sans-serif-medium',
      },
    }),
  },
  error: {
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        fontWeight: '400',
      },
      android: {
        fontFamily: 'sans-serif',
      },
    }),
  },
});
