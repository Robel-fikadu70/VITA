import { router } from 'expo-router';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { useCallback, useEffect } from 'react';

import { SplashScreen } from '@/components/vita/splash-screen';
import { isLoggedIn } from '@/lib/auth-storage';
import { isOnboardingComplete } from '@/lib/onboarding-storage';

ExpoSplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function SplashRoute() {
  useEffect(() => {
    ExpoSplashScreen.hideAsync().catch(() => undefined);
  }, []);

  const handleGetStarted = useCallback(async () => {
    const loggedIn = await isLoggedIn();
    if (!loggedIn) {
      router.replace('/login');
      return;
    }
    const completed = await isOnboardingComplete();
    if (completed) {
      router.replace('/(tabs)');
    } else {
      router.replace('/profile-setup');
    }
  }, []);

  return <SplashScreen onNext={handleGetStarted} />;
}
