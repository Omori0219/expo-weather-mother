import { Image } from 'expo-image';

export async function preloadWeatherAssets() {
  try {
    await Promise.all([
      Image.prefetch(require('../../assets/app/img-japan-map.webp'), {
        cachePolicy: 'memory-disk',
      }),
      Image.prefetch(require('../../assets/app/img-home-screen-mother.webp'), {
        cachePolicy: 'memory-disk',
      }),
      Image.prefetch(require('../../assets/app/img-speech-bubble.webp'), {
        cachePolicy: 'memory-disk',
      }),
    ]);
    return true;
  } catch (error) {
    console.error('Failed to preload weather assets:', error);
    return false;
  }
}
