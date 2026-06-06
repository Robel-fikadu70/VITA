import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

type MeshGradientBackgroundProps = {
  variant?: 'ai' | 'default';
};

export function MeshGradientBackground({ variant = 'default' }: MeshGradientBackgroundProps) {
  if (variant === 'ai') {
    return (
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <LinearGradient
          colors={['#F0FFF8', '#E8FFF0', '#D4F5E4']}
          style={StyleSheet.absoluteFill}
        />
        <LinearGradient
          colors={['rgba(168,230,207,0.55)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.6 }}
          style={[styles.blob, styles.blobTopLeft]}
        />
        <LinearGradient
          colors={['rgba(123,241,168,0.45)', 'transparent']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0.5 }}
          style={[styles.blob, styles.blobTopRight]}
        />
        <LinearGradient
          colors={['rgba(168,230,207,0.35)', 'transparent']}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          style={[styles.blob, styles.blobBottom]}
        />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#071A0F', '#1B4332', '#0A200F']}
      locations={[0, 0.6, 1]}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    />
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  blobTopLeft: {
    width: '85%',
    height: '45%',
    top: -40,
    left: -30,
  },
  blobTopRight: {
    width: '70%',
    height: '40%',
    top: 80,
    right: -50,
  },
  blobBottom: {
    width: '100%',
    height: '35%',
    bottom: 0,
    left: 0,
  },
});
