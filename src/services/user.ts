import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { UserData } from '../types/user';

export async function createUserDocument(userId: string): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const userData: UserData = {
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await setDoc(userRef, userData);
      console.log('User document created successfully');
    } catch (error) {
      console.error('Error creating user document:', error);
      throw error;
    }
  }
}

export async function updateUserPrefecture(userId: string, prefecture: string): Promise<void> {
  const userRef = doc(db, 'users', userId);

  try {
    await setDoc(
      userRef,
      {
        prefecture,
        updatedAt: new Date(),
      },
      { merge: true }
    );
    console.log('Prefecture updated successfully');
  } catch (error) {
    console.error('Error updating prefecture:', error);
    throw error;
  }
}
