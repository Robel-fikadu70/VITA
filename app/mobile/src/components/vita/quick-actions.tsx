import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { LinkButton } from '@/components/vita/link-button';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const RESOURCE_LINKS = [
  {
    href: 'https://docs.expo.dev/',
    label: 'Expo docs',
    imageSource: require('@/assets/images/expo-logo.png'),
  },
  {
    href: 'https://reactnative.dev/docs/getting-started',
    label: 'React Native',
    imageSource: require('@/assets/images/react-logo.png'),
  },
];

export function QuickActions() {
  const theme = useTheme();

  return (
    <View style={styles.section}>
      <Ionicons name="flash-outline" size={22} color={theme.textH} style={styles.icon} />
      <ThemedText type="heading">Quick actions</ThemedText>
      <ThemedText type="small" style={styles.subtitle}>
        Jump into the app or open helpful resources
      </ThemedText>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open Discover tab"
        onPress={() => router.push('/(tabs)/discover')}
        style={({ pressed }) => [
          styles.navCard,
          { backgroundColor: theme.socialBg, opacity: pressed ? 0.85 : 1 },
        ]}>
        <Ionicons name="compass-outline" size={20} color={theme.accent} />
        <ThemedText type="default" themeColor="textH" style={styles.navLabel}>
          Open Discover
        </ThemedText>
        <Ionicons name="chevron-forward" size={18} color={theme.text} />
      </Pressable>

      <View style={styles.links}>
        {RESOURCE_LINKS.map((link) => (
          <LinkButton
            key={link.href}
            href={link.href}
            label={link.label}
            imageSource={link.imageSource}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: Spacing.four,
    alignItems: 'center',
    gap: Spacing.two,
    width: '100%',
  },
  icon: {
    marginBottom: Spacing.two,
  },
  subtitle: {
    marginBottom: Spacing.three,
    textAlign: 'center',
  },
  navCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderRadius: 8,
    width: '100%',
    maxWidth: 360,
    marginBottom: Spacing.two,
  },
  navLabel: {
    flex: 1,
    fontSize: 16,
  },
  links: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.two,
    width: '100%',
  },
});
