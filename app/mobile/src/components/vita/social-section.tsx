import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { LinkButton } from '@/components/vita/link-button';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const SOCIAL_LINKS = [
  {
    href: 'https://github.com/vitejs/vite',
    label: 'GitHub',
    icon: 'logo-github' as const,
  },
  {
    href: 'https://chat.vite.dev/',
    label: 'Discord',
    icon: 'logo-discord' as const,
  },
  {
    href: 'https://x.com/vite_js',
    label: 'X.com',
    icon: 'logo-twitter' as const,
  },
  {
    href: 'https://bsky.app/profile/vite.dev',
    label: 'Bluesky',
    icon: 'cloud-outline' as const,
  },
] as const;

export function SocialSection() {
  const theme = useTheme();

  return (
    <View style={styles.section}>
      <Ionicons name="people-outline" size={22} color={theme.textH} style={styles.icon} />
      <ThemedText type="heading">Connect with us</ThemedText>
      <ThemedText type="small" style={styles.subtitle}>
        Community links and resources for VITA
      </ThemedText>
      <View style={styles.links}>
        {SOCIAL_LINKS.map((link) => (
          <LinkButton key={link.href} href={link.href} label={link.label} icon={link.icon} />
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
  },
  icon: {
    marginBottom: Spacing.two,
  },
  subtitle: {
    marginBottom: Spacing.three,
  },
  links: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.two,
    width: '100%',
  },
});
