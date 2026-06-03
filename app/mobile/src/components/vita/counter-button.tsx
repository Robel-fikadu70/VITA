import { useCallback, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type CounterButtonProps = {
  initialCount?: number;
  actionLabel?: string;
};

export function CounterButton({ initialCount = 0, actionLabel = 'Tap to log activity' }: CounterButtonProps) {
  const theme = useTheme();
  const [count, setCount] = useState(initialCount);

  const increment = useCallback(() => {
    setCount((value) => value + 1);
  }, []);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${actionLabel}, count ${count}`}
      onPress={increment}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: theme.accentBg,
          borderColor: pressed ? theme.accentBorder : 'transparent',
        },
      ]}>
      <ThemedText style={[styles.label, { color: theme.accent }]} themeColor="accent">
        {actionLabel}: {count}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 24,
  },
  label: {
    fontFamily: Fonts.mono,
    fontSize: 16,
  },
});
