declare module '../lib/firebase' {
  import type { Firestore } from 'firebase/firestore';
  import type { Auth } from 'firebase/auth';

  export const db: Firestore;
  export const auth: Auth;
}
