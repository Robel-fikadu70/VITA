import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { LinkButton } from '@/components/vita/link-button';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const DOC_LINKS = [
  {
    href: 'https://vite.dev/',
    label: 'Explore Vite',
    imageSource: require('@/assets/images/expo-logo.png'),
  },
  {
    href: 'https://react.dev/',
    label: 'Learn more',
    imageSource: require('@/assets/images/react-logo.png'),
  },
];

export function DocsSection() {
  const theme = useTheme();

  return (
    <View style={styles.section}>
      <Ionicons name="book-outline" size={22} color={theme.textH} style={styles.icon} />
      <ThemedText type="heading">Documentation</ThemedText>
      <ThemedText type="small" style={styles.subtitle}>
        Your questions, answered
      </ThemedText>
      <View style={styles.links}>
        {DOC_LINKS.map((link) => (
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
