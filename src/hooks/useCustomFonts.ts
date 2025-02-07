import { useFonts, YujiSyuku_400Regular } from '@expo-google-fonts/yuji-syuku';

export function useCustomFonts() {
  const [fontsLoaded] = useFonts({
    YujiSyuku_400Regular,
  });

  return {
    fontsLoaded,
    fonts: {
      yujiSyuku: 'YujiSyuku_400Regular',
    },
  };
}
