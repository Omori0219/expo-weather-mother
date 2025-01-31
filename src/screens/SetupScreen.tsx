import { useState, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  ViewStyle,
  TextStyle,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { RootStackNavigationProp, MainDrawerNavigationProp } from '../types/navigation';
import { useWeatherManager } from '../hooks/useWeatherManager';
import { PREFECTURE_LIST } from '../constants/prefectures';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

type SetupScreenProps = {
  isInitialSetup?: boolean;
};

type SetupScreenStyles = {
  container: ViewStyle;
  loadingContainer: ViewStyle;
  title: TextStyle;
  scrollView: ViewStyle;
  prefecturesContainer: ViewStyle;
  prefectureButton: ViewStyle;
  selectedButton: ViewStyle;
  prefectureText: TextStyle;
  selectedButtonText: TextStyle;
  error: TextStyle;
  confirmButton: ViewStyle;
  confirmButtonDisabled: ViewStyle;
  confirmButtonText: TextStyle;
  confirmButtonTextDisabled: TextStyle;
  bottomContainer: ViewStyle;
};

export function SetupScreen({ isInitialSetup = false }: SetupScreenProps) {
  const stackNavigation = useNavigation<RootStackNavigationProp>();
  const drawerNavigation = useNavigation<MainDrawerNavigationProp>();
  const insets = useSafeAreaInsets();
  const { updateAreaAndWeather, isWeatherLoading, error } = useWeatherManager();
  const [selectedPrefecture, setSelectedPrefecture] = useState<string | null>(null);

  // 地域選択の処理
  const handlePrefectureSelect = useCallback((areaCode: string) => {
    setSelectedPrefecture(areaCode);
  }, []);

  // 確定ボタンの処理
  const handleConfirm = useCallback(async () => {
    if (!selectedPrefecture) return;

    try {
      const success = await updateAreaAndWeather(selectedPrefecture);
      if (success) {
        if (isInitialSetup) {
          stackNavigation.replace('Main');
        } else {
          drawerNavigation.goBack();
        }
      }
    } catch (error) {
      // エラーは useWeatherManager 内で処理されるため、ここでは何もしない
    }
  }, [selectedPrefecture, isInitialSetup, stackNavigation, drawerNavigation, updateAreaAndWeather]);

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
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.prefecturesContainer}>
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
        </View>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.confirmButton, !selectedPrefecture && styles.confirmButtonDisabled]}
          onPress={handleConfirm}
          disabled={!selectedPrefecture || isWeatherLoading}
        >
          <Text
            style={[
              styles.confirmButtonText,
              !selectedPrefecture && styles.confirmButtonTextDisabled,
            ]}
          >
            {isWeatherLoading ? '更新中...' : '決定'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create<SetupScreenStyles>({
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
  prefecturesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 8,
  },
  prefectureButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
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
    fontSize: 14,
    color: '#333',
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
  bottomContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    ...Platform.select({
      ios: {
        fontWeight: '600',
      },
      android: {
        fontFamily: 'sans-serif-medium',
      },
    }),
  },
  confirmButtonTextDisabled: {
    color: '#999',
  },
});
