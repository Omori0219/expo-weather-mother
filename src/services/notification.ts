import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { NotificationSettings } from '../types/notification';

/**
 * Firestoreにプッシュ通知トークンを保存する
 */
export async function saveExpoPushToken(userId: string, token: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      expoPushToken: token,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Failed to save push token:', error);
    throw error;
  }
}

/**
 * 通知設定を更新する
 */
export async function updateNotificationSettings(
  userId: string,
  settings: Partial<NotificationSettings>
): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...settings,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Failed to update notification settings:', error);
    throw error;
  }
}
