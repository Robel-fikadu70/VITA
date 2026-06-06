import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEY = '@vita/auth_session';

export type AuthMethod = 'email' | 'google';

export type AuthSession = {
  method: AuthMethod;
  email: string;
  displayName?: string;
};

export async function isLoggedIn(): Promise<boolean> {
  const value = await AsyncStorage.getItem(AUTH_KEY);
  return value !== null;
}

export async function getAuthSession(): Promise<AuthSession | null> {
  const raw = await AsyncStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export async function setLoggedIn(session: AuthSession): Promise<void> {
  await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(session));
}

export async function logout(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_KEY);
}
