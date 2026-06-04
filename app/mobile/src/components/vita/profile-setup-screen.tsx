import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useUserProfile } from '@/context/user-profile-context';
import type { Gender } from '@/types/user-profile';
import { useToast } from '@/components/vita/toast';
import { apiClient, getActiveUserId } from '@/lib/api-client';
import { setLoggedIn } from '@/lib/auth-storage';

const TEXT = '#D8F3DC';
const TEXT_MUTED = 'rgba(216,243,220,0.55)';
const GREEN = '#52B788';

const GOALS = [
  'Better Sleep',
  'Stress Reduction',
  'Physical Recovery',
  'Weight Management',
  "Women's Wellness",
  'Nutrition',
];

const GOAL_ICONS: Record<string, string> = {
  'Better Sleep': '🌙',
  'Stress Reduction': '🧘',
  'Physical Recovery': '💪',
  'Weight Management': '⚖️',
  "Women's Wellness": '💗',
  Nutrition: '🥗',
};

const ACTIVITIES = ['Low', 'Moderate', 'High'] as const;
const ACTIVITY_COLORS: Record<(typeof ACTIVITIES)[number], string> = {
  Low: '#FF6B6B',
  Moderate: '#F4A261',
  High: '#52B788',
};

const WELLNESS = ['Yoga', 'Gym', 'Meditation', 'Walking', 'None'];
const GENDERS: Gender[] = ['Male', 'Female'];

type ProfileSetupScreenProps = {
  onContinue?: (goal: string) => void;
};

export function ProfileSetupScreen({ onContinue }: ProfileSetupScreenProps) {
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { profile, updateProfile, persistProfile } = useUserProfile();

  const [goal, setGoal] = useState(profile.primaryGoal);
  const [activity, setActivity] = useState(profile.activityLevel);
  const [wellness, setWellness] = useState<string[]>(profile.wellnessActivities);

  const toggleWellness = useCallback((w: string) => {
    if (w === 'None') {
      setWellness(['None']);
      return;
    }
    setWellness((prev) => {
      if (prev.includes('None')) return [w];
      if (prev.includes(w)) return prev.filter((x) => x !== w);
      return [...prev, w];
    });
  }, []);

  const handleContinue = async () => {
    console.log("HANDLE CONTINUE PRESSED");
    if (!profile.fullName.trim()) {
      showToast('Enter your full name', 'info');
      return;
    }
    if (!profile.email.trim() || !profile.email.includes('@')) {
      showToast('Enter a valid email', 'info');
      return;
    }
    if (profile.password.length < 6) {
      showToast('Password must be at least 6 characters', 'info');
      return;
    }
    if (!profile.username.trim()) {
      showToast('Choose a username', 'info');
      return;
    }
    const ageNum = parseInt(profile.age, 10);
    if (!profile.age || Number.isNaN(ageNum) || ageNum < 13 || ageNum > 120) {
      showToast('Enter a valid age (13–120)', 'info');
      return;
    }
    if (!profile.gender) {
      showToast('Select your gender', 'info');
      return;
    }
    if (!goal) {
      showToast('Select your primary wellness goal', 'info');
      return;
    }
    if (!activity) {
      showToast('Select your activity level', 'info');
      return;
    }

    updateProfile({
      primaryGoal: goal,
      activityLevel: activity,
      wellnessActivities: wellness,
    });
    await persistProfile();

    try {
      const userId = profile.email.split("@")[0].trim().toLowerCase();
      await apiClient.post('/wellness/onboarding', {
        userId,
        profile: {
          fullName: profile.fullName,
          email: profile.email,
          username: profile.username,
          age: profile.age,
          gender: profile.gender,
          primaryGoal: goal,
          activityLevel: activity,
          wellnessActivities: wellness,
        },
      });
    } catch (err) {
      console.error('Failed to sync onboarding profile to backend:', err);
    }

    if (onContinue) {
      onContinue(goal);
    } else {
      await setLoggedIn({
        method: "email",
        email: profile.email,
        displayName: profile.fullName,
      });
      router.replace('/onboarding-consent');
    }
  };

  return (
    <LinearGradient colors={['#071A0F', '#1B4332', '#0A200F']} locations={[0, 0.6, 1]} style={styles.root}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 28, paddingBottom: insets.bottom + 32 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
            <View style={styles.stepRow}>
              <Ionicons name="person-outline" size={15} color={GREEN} />
              <Text style={styles.stepLabel}>Step 2 of 5</Text>
            </View>
            <Text style={styles.title}>Tell Us About Yourself</Text>
            <Text style={styles.subtitle}>Personalize your wellness experience</Text>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(100)} style={styles.section}>
            <Text style={styles.sectionTitle}>Your Account</Text>
            <View style={styles.formCard}>
              <FormField
                label="Full name"
                value={profile.fullName}
                onChangeText={(v) => updateProfile({ fullName: v })}
                placeholder="Abel Tesfaye"
                autoCapitalize="words"
              />
              <FormField
                label="Email"
                value={profile.email}
                onChangeText={(v) => updateProfile({ email: v })}
                placeholder="you@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <FormField
                label="Password"
                value={profile.password}
                onChangeText={(v) => updateProfile({ password: v })}
                placeholder="Min. 6 characters"
                secureTextEntry
                autoCapitalize="none"
              />
              <FormField
                label="Username"
                value={profile.username}
                onChangeText={(v) => updateProfile({ username: v.replace(/\s/g, '') })}
                placeholder="abel_tesfaye"
                autoCapitalize="none"
              />
              <View style={styles.rowFields}>
                <View style={styles.halfField}>
                  <FormField
                    label="Age"
                    value={profile.age}
                    onChangeText={(v) => updateProfile({ age: v.replace(/[^0-9]/g, '') })}
                    placeholder="25"
                    keyboardType="number-pad"
                  />
                </View>
                <View style={styles.halfField}>
                  <Text style={styles.fieldLabel}>Gender</Text>
                  <View style={styles.genderWrap}>
                    {GENDERS.map((g) => {
                      const selected = profile.gender === g;
                      return (
                        <Pressable
                          key={g}
                          onPress={() => updateProfile({ gender: g })}
                          style={[styles.genderChip, selected && styles.genderChipSelected]}>
                          <Text style={[styles.genderChipText, selected && styles.genderChipTextSelected]}>
                            {g}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(150)} style={styles.section}>
            <Text style={styles.sectionTitle}>Primary Wellness Goal</Text>
            <View style={styles.goalGrid}>
              {GOALS.map((g) => {
                const isActive = goal === g;
                const isWomens = g === "Women's Wellness";
                return (
                  <Pressable
                    key={g}
                    onPress={() => setGoal(g)}
                    style={[
                      styles.goalCard,
                      isActive && (isWomens ? styles.goalCardWomens : styles.goalCardActive),
                    ]}>
                    <Text style={styles.goalEmoji}>{GOAL_ICONS[g]}</Text>
                    <Text
                      style={[
                        styles.goalLabel,
                        isActive && (isWomens ? styles.goalLabelWomens : styles.goalLabelActive),
                      ]}>
                      {g}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {goal === "Women's Wellness" ? (
              <Animated.View entering={FadeInUp} style={styles.womensHint}>
                <Text style={styles.womensHintText}>💗 Women&apos;s Wellness Assessment will follow</Text>
              </Animated.View>
            ) : null}
          </Animated.View>

          <Animated.View entering={FadeIn.delay(250)} style={styles.section}>
            <Text style={styles.sectionTitle}>How Active Are You?</Text>
            <View style={styles.activityRow}>
              {ACTIVITIES.map((a) => {
                const isActive = activity === a;
                const color = ACTIVITY_COLORS[a];
                return (
                  <Pressable
                    key={a}
                    onPress={() => setActivity(a)}
                    style={[
                      styles.activityButton,
                      isActive && { backgroundColor: `${color}18`, borderColor: `${color}50` },
                    ]}>
                    <Text style={[styles.activityText, isActive && { color, fontWeight: '700' }]}>{a}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(350)} style={styles.section}>
            <Text style={styles.sectionTitle}>Current Wellness Activities</Text>
            <View style={styles.wellnessWrap}>
              {WELLNESS.map((w) => {
                const isSelected = wellness.includes(w);
                return (
                  <Pressable
                    key={w}
                    onPress={() => toggleWellness(w)}
                    style={[styles.wellnessChip, isSelected && styles.wellnessChipSelected]}>
                    <Text style={[styles.wellnessText, isSelected && styles.wellnessTextSelected]}>{w}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(500)}>
            <Pressable onPress={handleContinue} style={({ pressed }) => [pressed && styles.pressed]}>
              <LinearGradient colors={['#1B4332', '#52B788']} style={styles.continueButton}>
                <Text style={styles.continueText}>Continue</Text>
                <Ionicons name="chevron-forward" size={17} color={TEXT} />
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

type FormFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'number-pad';
  autoCapitalize?: 'none' | 'words' | 'sentences';
};

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
}: FormFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(216,243,220,0.35)"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  header: { marginBottom: 22 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  stepLabel: {
    color: GREEN,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  title: { color: TEXT, fontSize: 22, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: TEXT_MUTED, fontSize: 13 },
  section: { marginBottom: 22 },
  sectionTitle: {
    color: 'rgba(216,243,220,0.7)',
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: 12,
  },
  formCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: 24,
    padding: 16,
    gap: 4,
  },
  field: { marginBottom: 12 },
  fieldLabel: { color: 'rgba(216,243,220,0.65)', fontSize: 12, fontWeight: '600', marginBottom: 6 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: TEXT,
    fontSize: 15,
  },
  rowFields: { flexDirection: 'row', gap: 12 },
  halfField: { flex: 1 },
  genderWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  genderChip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
  },
  genderChipSelected: {
    backgroundColor: 'rgba(82,183,136,0.16)',
    borderColor: 'rgba(82,183,136,0.5)',
  },
  genderChipText: { color: 'rgba(216,243,220,0.55)', fontSize: 11, fontWeight: '500' },
  genderChipTextSelected: { color: GREEN, fontWeight: '700' },
  goalGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  goalCard: {
    width: '48%',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.09)',
    alignItems: 'center',
    gap: 8,
  },
  goalCardActive: {
    backgroundColor: 'rgba(82,183,136,0.14)',
    borderColor: GREEN,
  },
  goalCardWomens: {
    backgroundColor: 'rgba(250,210,225,0.14)',
    borderColor: '#FAD2E1',
  },
  goalEmoji: { fontSize: 24 },
  goalLabel: {
    color: 'rgba(216,243,220,0.6)',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  goalLabelActive: { color: TEXT, fontWeight: '700' },
  goalLabelWomens: { color: '#FAD2E1', fontWeight: '700' },
  womensHint: {
    marginTop: 12,
    backgroundColor: 'rgba(250,210,225,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(250,210,225,0.2)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  womensHintText: { color: '#FAD2E1', fontSize: 12, fontWeight: '600' },
  activityRow: { flexDirection: 'row', gap: 9 },
  activityButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.09)',
    alignItems: 'center',
  },
  activityText: { color: 'rgba(216,243,220,0.5)', fontSize: 13 },
  wellnessWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  wellnessChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.09)',
  },
  wellnessChipSelected: {
    backgroundColor: 'rgba(82,183,136,0.16)',
    borderColor: 'rgba(82,183,136,0.5)',
  },
  wellnessText: { color: 'rgba(216,243,220,0.55)', fontSize: 13 },
  wellnessTextSelected: { color: GREEN, fontWeight: '700' },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 17,
    borderRadius: 26,
    marginTop: 6,
  },
  continueText: { color: TEXT, fontSize: 15, fontWeight: '800' },
  pressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
});
