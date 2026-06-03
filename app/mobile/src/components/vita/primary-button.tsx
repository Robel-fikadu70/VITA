import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
};

export function PrimaryButton({ label, onPress, accessibilityLabel }: PrimaryButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: theme.accent,
          opacity: pressed ? 0.9 : 1,
        },
      ]}>
      <ThemedText style={styles.label}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
