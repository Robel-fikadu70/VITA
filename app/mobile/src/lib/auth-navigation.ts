import { router } from 'expo-router';

import { isOnboardingComplete } from '@/lib/onboarding-storage';

/** Route after successful sign-in (email or Google). */
export async function navigateAfterLogin(): Promise<void> {
  const completed = await isOnboardingComplete();
  if (completed) {
    router.replace('/(tabs)');
  } else {
    router.replace('/profile-setup');
  }
}
