import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

import { BottomNav } from '@/components/vita/bottom-nav';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Tabs
        tabBar={(props) => <BottomNav {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
        }}>
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="discover" options={{ title: 'Discover' }} />
        <Tabs.Screen name="womens-wellness" options={{ title: "Women's Wellness" }} />
        <Tabs.Screen name="ai" options={{ title: 'Vita AI' }} />
        <Tabs.Screen name="history" options={{ title: 'History' }} />
        <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
        <Tabs.Screen name="consent" options={{ href: null }} />
        <Tabs.Screen name="notifications" options={{ href: null }} />
        <Tabs.Screen name="provider" options={{ href: null }} />
        <Tabs.Screen name="booking" options={{ href: null }} />
        <Tabs.Screen name="rx-details" options={{ href: null }} />
        <Tabs.Screen name="daily-report" options={{ href: null }} />
      </Tabs>
    </ThemeProvider>
  );
}
