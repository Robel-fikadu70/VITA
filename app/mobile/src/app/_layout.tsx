import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { UserProfileProvider } from '@/context/user-profile-context';
import { ToastProvider } from '@/components/vita/toast';

export default function RootLayout() {
  return (
    <UserProfileProvider>
      <ToastProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" options={{ animation: 'fade' }} />
          <Stack.Screen name="profile-setup" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="onboarding-consent" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        </Stack>
      </ToastProvider>
    </UserProfileProvider>
  );
}
