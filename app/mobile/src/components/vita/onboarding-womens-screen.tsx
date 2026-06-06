import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PINK = '#FAD2E1';
const PINK_MUTED = 'rgba(250,210,225,0.58)';
const GREEN = '#52B788';
const TEXT = '#D8F3DC';

export function OnboardingWomensScreen() {
  const insets = useSafeAreaInsets();

  const handleStart = () => {
    router.replace('/(tabs)/assessment?screeningId=pcos-risk');
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <LinearGradient
      colors={['#1A0A12', '#2D1520', '#1A0A12']}
      locations={[0, 0.5, 1]}
      style={styles.root}>
      <View style={[styles.container, { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 32 }]}>

        {/* Animated icon */}
        <Animated.View entering={FadeIn.duration(600)} style={styles.iconWrap}>
          <View style={styles.iconOuter}>
            <View style={styles.iconInner}>
              <Ionicons name="rose" size={40} color={PINK} />
            </View>
          </View>
        </Animated.View>

        {/* Heading */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.textBlock}>
          <Text style={styles.eyebrow}>Optional · Women's Wellness</Text>
          <Text style={styles.title}>One More Step{'\n'}For You</Text>
          <Text style={styles.subtitle}>
            Based on your profile, a short Women's Wellness screening is available for you.
            It takes under 2 minutes and helps Vita provide more tailored health insights.
          </Text>
        </Animated.View>

        {/* Feature list */}
        <Animated.View entering={FadeIn.delay(350)} style={styles.features}>
          {[
            { icon: 'time-outline', text: '5 questions · About 2 minutes' },
            { icon: 'shield-checkmark-outline', text: 'Private & confidential' },
            { icon: 'sparkles-outline', text: 'AI-powered wellness insights' },
            { icon: 'close-circle-outline', text: 'Does not block account access' },
          ].map((item) => (
            <View key={item.text} style={styles.featureRow}>
              <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={15} color={PINK} />
              <Text style={styles.featureText}>{item.text}</Text>
            </View>
          ))}
        </Animated.View>

        <View style={styles.spacer} />

        {/* Buttons */}
        <Animated.View entering={FadeInUp.delay(500)} style={styles.buttons}>
          <Pressable
            onPress={handleStart}
            style={({ pressed }) => [pressed && styles.pressed]}>
            <LinearGradient
              colors={['#4A1530', '#C9607A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryButton}>
              <Ionicons name="rose-outline" size={17} color={PINK} />
              <Text style={styles.primaryButtonText}>Complete Assessment</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={handleSkip}
            style={({ pressed }) => [styles.skipButton, pressed && styles.pressed]}>
            <Text style={styles.skipText}>Skip For Now</Text>
            <Ionicons name="chevron-forward" size={14} color="rgba(250,210,225,0.4)" />
          </Pressable>
        </Animated.View>

        {/* Fine print */}
        <Animated.View entering={FadeIn.delay(700)} style={styles.finePrint}>
          <Ionicons name="alert-circle-outline" size={12} color="rgba(244,162,97,0.6)" />
          <Text style={styles.finePrintText}>
            This is not a medical diagnosis. Educational insights only.
          </Text>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    alignItems: 'center',
  },

  iconWrap: { marginBottom: 28 },
  iconOuter: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(250,210,225,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(250,210,225,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(250,210,225,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(250,210,225,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textBlock: { alignItems: 'center', marginBottom: 24 },
  eyebrow: {
    color: PINK,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  title: {
    color: PINK,
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 14,
  },
  subtitle: {
    color: PINK_MUTED,
    fontSize: 13,
    lineHeight: 22,
    textAlign: 'center',
  },

  features: {
    width: '100%',
    gap: 11,
    backgroundColor: 'rgba(250,210,225,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(250,210,225,0.1)',
    borderRadius: 20,
    padding: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    color: PINK_MUTED,
    fontSize: 13,
  },

  spacer: { flex: 1 },

  buttons: { width: '100%', gap: 10, marginBottom: 14 },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 17,
    borderRadius: 26,
    shadowColor: '#4A1530',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 18,
    elevation: 8,
  },
  primaryButtonText: { color: PINK, fontSize: 15, fontWeight: '800' },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
  },
  skipText: { color: 'rgba(250,210,225,0.35)', fontSize: 13 },
  pressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },

  finePrint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  finePrintText: { color: 'rgba(244,162,97,0.5)', fontSize: 10 },
});
