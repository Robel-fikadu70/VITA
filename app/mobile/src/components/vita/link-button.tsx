import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

type LinkButtonProps = {
  href: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  imageSource?: number;
};

export function LinkButton({ href, label, icon, imageSource }: LinkButtonProps) {
  const theme = useTheme();

  const openLink = async () => {
    await openBrowserAsync(href, {
      presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
    });
  };

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={label}
      onPress={openLink}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: theme.socialBg, opacity: pressed ? 0.85 : 1 },
      ]}>
      {imageSource ? (
        <Image source={imageSource} style={styles.imageIcon} contentFit="contain" />
      ) : icon ? (
        <Ionicons name={icon} size={18} color={theme.textH} />
      ) : null}
      <ThemedText type="default" themeColor="textH" style={styles.label}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 140,
    flex: 1,
  },
  imageIcon: {
    width: 18,
    height: 18,
  },
  label: {
    fontSize: 16,
    flexShrink: 1,
  },
});
