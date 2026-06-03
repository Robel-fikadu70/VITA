import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export function SectionDivider() {
  const theme = useTheme();

  return (
    <View style={styles.wrapper}>
      <View style={[styles.line, { backgroundColor: theme.border }]} />
      <View style={[styles.tickLeft, { borderLeftColor: theme.border }]} />
      <View style={[styles.tickRight, { borderRightColor: theme.border }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: 1,
    position: 'relative',
    marginVertical: 0,
  },
  line: {
    height: 1,
    width: '100%',
  },
  tickLeft: {
    position: 'absolute',
    left: 0,
    top: -4,
    width: 0,
    height: 0,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderLeftWidth: 5,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  tickRight: {
    position: 'absolute',
    right: 0,
    top: -4,
    width: 0,
    height: 0,
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
});
