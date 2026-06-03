import AsyncStorage from '@react-native-async-storage/async-storage';

import type { UserProfile } from '@/types/user-profile';
import { EMPTY_PROFILE } from '@/types/user-profile';

const ONBOARDING_KEY = '@vita/onboarding_complete';
const PROFILE_KEY = '@vita/user_profile';

export async function isOnboardingComplete(): Promise<boolean> {
  const value = await AsyncStorage.getItem(ONBOARDING_KEY);
  return value === 'true';
}

export async function completeOnboarding(): Promise<void> {
  await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(PROFILE_KEY);
  if (!raw) return null;
  try {
    return { ...EMPTY_PROFILE, ...JSON.parse(raw) } as UserProfile;
  } catch {
    return null;
  }
}

/** Dev helper — reset to see onboarding again */
export async function resetOnboarding(): Promise<void> {
  const { logout } = await import('@/lib/auth-storage');
  await logout();
  await AsyncStorage.multiRemove([ONBOARDING_KEY, PROFILE_KEY]);
}
