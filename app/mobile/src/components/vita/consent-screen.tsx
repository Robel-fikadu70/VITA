import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInLeft,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BOTTOM_NAV_BAR_HEIGHT } from '@/components/vita/bottom-nav';
import { useToast } from '@/components/vita/toast';
import { setLoggedIn } from '@/lib/auth-storage';
import { completeOnboarding, getUserProfile } from '@/lib/onboarding-storage';

const TEXT = '#D8F3DC';
const TEXT_MUTED = 'rgba(216,243,220,0.58)';
const GREEN = '#52B788';

const PERMISSIONS = [
  {
    key: 'activity',
    icon: 'fitness-outline' as const,
    label: 'Activity Data',
    color: '#52B788',
    why: 'To understand your movement and fitness habits.',
  },
  {
    key: 'sleep',
    icon: 'moon-outline' as const,
    label: 'Sleep Data',
    color: '#ADB5BD',
    why: 'To measure recovery and energy levels.',
  },
  {
    key: 'screen',
    icon: 'phone-portrait-outline' as const,
    label: 'Screen Time',
    color: '#FAD2E1',
    why: 'To identify digital fatigue and sleep disruptions.',
  },
  {
    key: 'health',
    icon: 'heart-outline' as const,
    label: 'Health Data',
    color: '#F4A261',
    why: 'To provide better wellness recommendations.',
  },
];

type PermissionSwitchProps = {
  enabled: boolean;
  color: string;
  onToggle: () => void;
};

function PermissionSwitch({ enabled, color, onToggle }: PermissionSwitchProps) {
  const knobX = useSharedValue(enabled ? 25 : 2);

  useEffect(() => {
    knobX.value = withSpring(enabled ? 25 : 2, { stiffness: 450, damping: 28 });
  }, [enabled, knobX]);

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: knobX.value }],
  }));

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: enabled }}
      onPress={onToggle}
      style={[
        styles.switchTrack,
        { backgroundColor: enabled ? color : 'rgba(255,255,255,0.1)' },
      ]}>
      <Animated.View style={[styles.switchKnob, knobStyle]} />
    </Pressable>
  );
}

type ConsentScreenProps = {
  variant?: 'onboarding' | 'settings';
};

export function ConsentScreen({ variant = 'settings' }: ConsentScreenProps) {
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const isOnboarding = variant === 'onboarding';
  const bottomPad = isOnboarding
    ? insets.bottom + 24
    : insets.bottom + BOTTOM_NAV_BAR_HEIGHT + 24;
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    activity: true,
    sleep: true,
    screen: false,
    health: true,
  });

  const toggle = useCallback((key: string) => {
    setEnabled((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const goBack = () => router.back();

  const finishOnboarding = async () => {
    const profile = await getUserProfile();
    if (profile?.email) {
      await setLoggedIn({
        method: 'email',
        email: profile.email,
        displayName: profile.fullName || profile.username,
      });
    }
    await completeOnboarding();
    if (profile?.primaryGoal === "Women's Wellness") {
      router.replace('/(tabs)/womens-wellness');
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleAllow = () => {
    showToast('Access permissions saved!', 'success');
    if (isOnboarding) {
      setTimeout(() => {
        finishOnboarding();
      }, 600);
    } else {
      setTimeout(goBack, 600);
    }
  };

  const handleSkip = () => {
    if (isOnboarding) {
      finishOnboarding();
    } else {
      goBack();
    }
  };

  return (
    <LinearGradient
      colors={['#071A0F', '#1B4332', '#0A200F']}
      locations={[0, 0.6, 1]}
      style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 28, paddingBottom: bottomPad },
        ]}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <View style={styles.stepRow}>
            <Ionicons name="shield-checkmark" size={15} color={GREEN} />
            <Text style={styles.stepLabel}>{isOnboarding ? 'Step 3 of 5' : 'Step 1 of 5'}</Text>
          </View>
          <Text style={styles.title}>Build Your Wellness{'\n'}Profile</Text>
          <Text style={styles.subtitle}>
            To provide personalized wellness recommendations, VITA requires access to
            selected health and lifestyle information.
          </Text>
        </Animated.View>

        <View style={styles.permissions}>
          {PERMISSIONS.map((permission, index) => {
            const isEnabled = !!enabled[permission.key];
            return (
              <Animated.View
                key={permission.key}
                entering={FadeInLeft.delay(200 + index * 80).springify()}
                style={[
                  styles.permissionCard,
                  {
                    backgroundColor: isEnabled ? `${permission.color}0D` : 'rgba(255,255,255,0.04)',
                    borderColor: isEnabled ? `${permission.color}30` : 'rgba(255,255,255,0.09)',
                  },
                ]}>
                <View
                  style={[
                    styles.permissionIcon,
                    {
                      backgroundColor: `${permission.color}18`,
                      borderColor: `${permission.color}30`,
                    },
                  ]}>
                  <Ionicons name={permission.icon} size={21} color={permission.color} />
                </View>
                <View style={styles.permissionCopy}>
                  <View style={styles.permissionTitleRow}>
                    <Text style={styles.permissionLabel}>{permission.label}</Text>
                    {isEnabled ? (
                      <View
                        style={[
                          styles.enabledBadge,
                          { backgroundColor: `${permission.color}20` },
                        ]}>
                        <Ionicons name="checkmark" size={10} color={permission.color} />
                        <Text style={[styles.enabledText, { color: permission.color }]}>
                          Enabled
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.permissionWhy}>
                    <Text style={{ color: permission.color, fontWeight: '600' }}>Why? </Text>
                    {permission.why}
                  </Text>
                </View>
                <PermissionSwitch
                  enabled={isEnabled}
                  color={permission.color}
                  onToggle={() => toggle(permission.key)}
                />
              </Animated.View>
            );
          })}
        </View>

        <Animated.View entering={FadeInUp.delay(650)}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Allow Access"
            onPress={handleAllow}
            style={({ pressed }) => [pressed && styles.pressed]}>
            <LinearGradient
              colors={['#1B4332', '#52B788']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.allowButton}>
              <Text style={styles.allowText}>Allow Access</Text>
              <Ionicons name="chevron-forward" size={17} color={TEXT} />
            </LinearGradient>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Skip For Now"
            onPress={handleSkip}
            style={({ pressed }) => [styles.skipButton, pressed && styles.pressed]}>
            <Text style={styles.skipText}>Skip For Now</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  header: { marginBottom: 24 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  stepLabel: {
    color: GREEN,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  title: { color: TEXT, fontSize: 22, fontWeight: '800', marginBottom: 8, lineHeight: 28 },
  subtitle: { color: TEXT_MUTED, fontSize: 13, lineHeight: 22 },
  permissions: { gap: 11, marginBottom: 24 },
  permissionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderWidth: 1,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  permissionIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionCopy: { flex: 1, minWidth: 0 },
  permissionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3,
    flexWrap: 'wrap',
  },
  permissionLabel: { color: TEXT, fontSize: 14, fontWeight: '700' },
  enabledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  enabledText: { fontSize: 10, fontWeight: '700' },
  permissionWhy: { color: 'rgba(216,243,220,0.48)', fontSize: 11, lineHeight: 16 },
  switchTrack: {
    width: 52,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
  },
  switchKnob: {
    position: 'absolute',
    top: 3,
    left: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  allowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 17,
    borderRadius: 26,
    marginBottom: 12,
    shadowColor: '#1B4332',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 18,
    elevation: 8,
  },
  allowText: { color: TEXT, fontSize: 15, fontWeight: '800', letterSpacing: 0.5 },
  skipButton: { paddingVertical: 8, alignItems: 'center' },
  skipText: { color: 'rgba(216,243,220,0.4)', fontSize: 13 },
  pressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
});
