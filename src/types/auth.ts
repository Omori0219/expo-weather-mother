import { User } from 'firebase/auth';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

export interface UseAuth {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
}
