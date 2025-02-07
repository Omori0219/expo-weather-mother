import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';

type AuthState = {
  selectedArea: string | null;
  notificationEnabled: boolean;
  isInitialSetupComplete: boolean;
};

type AuthContextType = AuthState & {
  updateAuth: (newState: Partial<AuthState>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
  initialState?: AuthState;
};

export function AuthProvider({ children, initialState }: AuthProviderProps) {
  const defaultState: AuthState = {
    selectedArea: null,
    notificationEnabled: false,
    isInitialSetupComplete: false,
  };

  const [state, setState] = useState<AuthState>(initialState || defaultState);
  const { saveUserData } = useUser();

  // 初期状態が設定されている場合、useUserの状態も更新
  useEffect(() => {
    if (initialState?.selectedArea && initialState.isInitialSetupComplete) {
      saveUserData(initialState.selectedArea);
    }
  }, [initialState, saveUserData]);

  const updateAuth = (newState: Partial<AuthState>) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  const value: AuthContextType = {
    ...state,
    updateAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
