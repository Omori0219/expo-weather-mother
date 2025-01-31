import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserData } from '../types/user';

export async function createUserDocument(userId: string): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const userData: UserData = {
      userId,
      areaCode: '',
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

export async function updateUserArea(userId: string, areaCode: string): Promise<void> {
  const userRef = doc(db, 'users', userId);

  try {
    await setDoc(
      userRef,
      {
        areaCode,
        updatedAt: new Date(),
      },
      { merge: true }
    );
    console.log('Area code updated successfully');
  } catch (error) {
    console.error('Error updating area code:', error);
    throw error;
  }
}
