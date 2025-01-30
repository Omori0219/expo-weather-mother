import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';

declare module '../lib/firebase' {
  const db: Firestore;
  const auth: Auth;
  export { db, auth };
}
