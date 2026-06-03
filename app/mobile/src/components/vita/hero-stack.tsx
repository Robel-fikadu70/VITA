import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

export function HeroStack() {
  return (
    <View style={styles.hero}>
      <Image
        source={require('@/assets/images/hero.png')}
        style={styles.base}
        contentFit="contain"
        accessibilityLabel="VITA hero"
      />
      <Image
        source={require('@/assets/images/react-logo.png')}
        style={styles.framework}
        contentFit="contain"
        accessibilityLabel="React"
      />
      <Image
        source={require('@/assets/images/expo-logo.png')}
        style={styles.vite}
        contentFit="contain"
        accessibilityLabel="Expo"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  base: {
    width: 170,
    height: 179,
    position: 'absolute',
    zIndex: 0,
  },
  framework: {
    width: 56,
    height: 56,
    position: 'absolute',
    top: 34,
    zIndex: 1,
  },
  vite: {
    width: 48,
    height: 48,
    position: 'absolute',
    top: 100,
    zIndex: 0,
  },
});
