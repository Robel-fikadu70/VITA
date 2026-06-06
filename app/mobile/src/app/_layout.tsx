import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { UserProfileProvider } from '@/context/user-profile-context';
import { ProviderProvider } from '@/context/provider-context';
import { ToastProvider } from '@/components/vita/toast';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <UserProfileProvider>
        <ProviderProvider>
          <ToastProvider>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="login" options={{ animation: 'fade' }} />
              <Stack.Screen name="profile-setup" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="onboarding-consent" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="onboarding-womens" options={{ animation: 'slide_from_right' }} />
              <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
              <Stack.Screen name="activity/[id]" options={{ animation: 'slide_from_bottom' }} />
            </Stack>
          </ToastProvider>
        </ProviderProvider>
      </UserProfileProvider>
    </SafeAreaProvider>
  );
}
