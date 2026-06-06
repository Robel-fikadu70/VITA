import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const PARTICLE_COUNT = 12;
const RING_COUNT = 4;

const COLORS = {
  text: '#D8F3DC',
  textMuted: 'rgba(216,243,220,0.65)',
  textFaint: 'rgba(216,243,220,0.25)',
  glow: 'rgba(82,183,136,0.25)',
  ring: 'rgba(82,183,136,0.4)',
  particleLight: 'rgba(216,243,220,0.7)',
  particleGreen: 'rgba(82,183,136,0.5)',
};

type SplashScreenProps = {
  onNext: () => void;
};

function Particle({ index }: { index: number }) {
  const opacity = useSharedValue(0.2);

  useEffect(() => {
    opacity.value = withDelay(
      (index * 400) % 2500,
      withRepeat(
        withSequence(
          withTiming(0.9, { duration: 1000 + (index % 3) * 500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.2, { duration: 1000 + (index % 3) * 500, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
      ),
    );
  }, [index, opacity]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const size = (index % 2) + 2;
  const left = `${((index * 13 + 7) % 90) + 5}%`;
  const top = `${((index * 19 + 5) % 85) + 5}%`;

  return (
    <Animated.View
      style={[
        styles.particle,
        style,
        {
          width: size,
          height: size,
          left,
          top,
          backgroundColor: index % 3 === 0 ? COLORS.particleLight : COLORS.particleGreen,
        },
      ]}
    />
  );
}

function PulseRing({ index }: { index: number }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    const delay = index * 750;
    scale.value = withDelay(
      delay,
      withRepeat(
        withTiming(2.8, { duration: 3200, easing: Easing.out(Easing.ease) }),
        -1,
        false,
      ),
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(0, { duration: 3200, easing: Easing.out(Easing.ease) }),
        -1,
        false,
      ),
    );
  }, [index, opacity, scale]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.pulseRing, ringStyle]} />;
}

function LogoOrb() {
  const breathe = useSharedValue(1);

  useEffect(() => {
    breathe.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    );
  }, [breathe]);

  const breatheStyle = useAnimatedStyle(() => ({
    transform: [{ scale: breathe.value }],
  }));

  return (
    <Animated.View entering={ZoomIn.delay(100).springify().damping(22).stiffness(240)}>
      <Animated.View style={[styles.logoOrbOuter, breatheStyle]}>
        <LinearGradient
          colors={[
            'rgba(255,255,255,0.9)',
            'rgba(216,243,220,0.7)',
            'rgba(27,67,50,0.5)',
          ]}
          locations={[0, 0.45, 1]}
          start={{ x: 0.35, y: 0.35 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoOrb}>
          <Text style={styles.logoEmoji}>🌿</Text>
        </LinearGradient>
      </Animated.View>
    </Animated.View>
  );
}

function BackgroundGlow() {
  const opacity = useSharedValue(0.15);
  const scale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.35, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.15, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    );
    scale.value = withRepeat(
      withSequence(
        withTiming(1.3, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
    );
  }, [opacity, scale]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={[styles.backgroundGlow, glowStyle]} />;
}

export function SplashScreen({ onNext }: SplashScreenProps) {
  const { width, height } = useWindowDimensions();

  return (
    <View style={[styles.root, { width, height }]}>
      <LinearGradient
        colors={['#040E07', '#0D2B1C', '#1B4332', '#0A200F']}
        locations={[0, 0.4, 0.75, 1]}
        style={StyleSheet.absoluteFill}
      />

      <BackgroundGlow />

      {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
        <Particle key={i} index={i} />
      ))}

      <View style={styles.ringsContainer} pointerEvents="none">
        {Array.from({ length: RING_COUNT }, (_, i) => (
          <PulseRing key={i} index={i} />
        ))}
      </View>

      <SafeAreaView style={styles.content} edges={['top', 'bottom']}>
        <View style={styles.centerBlock}>
          <LogoOrb />

          <Animated.View
            entering={FadeInDown.delay(400).springify().damping(26).stiffness(260)}
            style={styles.textBlock}>
            <Text style={styles.title}>VITA</Text>
            <Animated.Text entering={FadeIn.delay(800)} style={styles.tagline}>
              The Bridge From Data{'\n'}To Discovery
            </Animated.Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(1100).duration(400)}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Get Started"
              onPress={onNext}
              style={({ pressed }) => [pressed && styles.buttonPressed]}>
              <LinearGradient
                colors={['#1B4332', '#2D6A4F', '#52B788']}
                locations={[0, 0.6, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.button}>
                <Text style={styles.buttonText}>Get Started</Text>
                <Ionicons name="arrow-forward" size={18} color={COLORS.text} />
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </View>

        <Animated.Text entering={FadeIn.delay(1500)} style={styles.version}>
          AI-Powered Wellness Concierge · Ethiopia 2026
        </Animated.Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
  },
  backgroundGlow: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: COLORS.glow,
    alignSelf: 'center',
    top: '22%',
  },
  particle: {
    position: 'absolute',
    borderRadius: 10,
  },
  ringsContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1,
    borderColor: COLORS.ring,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoOrbOuter: {
    marginBottom: 40,
    shadowColor: '#52B788',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 40,
    elevation: 12,
  },
  logoOrb: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: {
    fontSize: 46,
  },
  textBlock: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: 6,
    marginBottom: 14,
    textShadowColor: 'rgba(216,243,220,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 25,
  },
  tagline: {
    color: COLORS.textMuted,
    fontSize: 14,
    letterSpacing: 1.5,
    lineHeight: 24,
    fontWeight: '300',
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 32,
    shadowColor: '#52B788',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
  },
  buttonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.96 }],
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  version: {
    position: 'absolute',
    bottom: 28,
    color: COLORS.textFaint,
    fontSize: 11,
    letterSpacing: 1,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});
