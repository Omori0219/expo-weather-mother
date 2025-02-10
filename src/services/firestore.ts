import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { WeatherDocument } from '../types/weather';
import { WeatherDataError } from './weather';

export async function fetchWeatherDocument(areaCode: string): Promise<WeatherDocument> {
  const today = new Date();
  const docId = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${areaCode}`;

  try {
    const docRef = doc(db, 'weather_data', docId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new WeatherDataError(`天気情報が見つかりません: ${docId}`);
    }

    return docSnap.data() as WeatherDocument;
  } catch (error) {
    if (error instanceof WeatherDataError) {
      throw error;
    }
    throw new WeatherDataError('天気情報の取得に失敗しました', error);
  }
}
