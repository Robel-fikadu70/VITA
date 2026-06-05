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
import Animated, { FadeIn, FadeInDown, FadeInUp, SlideInRight, SlideOutLeft } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LoadingOrb, LoadingSteps } from '@/components/vita/loading-orb';
import { useToast } from '@/components/vita/toast';
import { useUserProfile } from '@/context/user-profile-context';
import { apiClient } from '@/lib/api-client';
import { setLoggedIn } from '@/lib/auth-storage';
import type { Gender } from '@/types/user-profile';

/* ─────────────────── Constants ─────────────────── */

const TEXT = '#D8F3DC';
const TEXT_MUTED = 'rgba(216,243,220,0.55)';
const GREEN = '#52B788';

const TOTAL_STEPS = 4;

const GENDERS: Gender[] = ['Male', 'Female'];

const SLEEP_OPTIONS = ['< 5 hrs', '5-6 hrs', '6-7 hrs', '7-8 hrs', '8+ hrs'];
const SCREEN_TIME_OPTIONS = ['< 2 hrs', '2-4 hrs', '4-6 hrs', '6-8 hrs', '8+ hrs'];
const STRESS_LEVELS = ['Low', 'Moderate', 'High', 'Very High'];
const EXERCISE_DAYS = ['0', '1-2', '3-4', '5-6', '7'];
const CHALLENGE_OPTIONS = ['Consistency', 'Motivation', 'Time', 'Knowledge', 'Support'];
const ACTIVITY_LEVELS = ['Low', 'Moderate', 'High'] as const;
const ACTIVITY_COLORS: Record<(typeof ACTIVITY_LEVELS)[number], string> = {
  Low: '#FF6B6B',
  Moderate: '#F4A261',
  High: '#52B788',
};

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

const WELLNESS_ACTIVITIES = ['Yoga', 'Gym', 'Meditation', 'Walking', 'None'];
const HABITS_OPTIONS = ['Yoga', 'Gym', 'Meditation', 'Walking', 'Journaling', 'Healthy Eating', 'None'];
const WELLNESS_GOALS = ['Better Sleep', 'Reduce Stress', 'Lose Weight', 'Build Muscle', 'Improve Flexibility', 'Mental Clarity', 'More Energy'];

const ONBOARDING_LOADING_STEPS = [
  'Building your wellness profile...',
  'Analyzing your lifestyle patterns...',
  'Understanding your wellness goals...',
  'Generating your initial wellness insights...',
  'Preparing your personalized dashboard...',
];

/* ─────────────────── Types ─────────────────── */

type ProfileSetupScreenProps = {
  onContinue?: (goal: string) => void;
};

/* ─────────── Reusable Sub-Components ─────────── */

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

function SingleSelectChips({
  label,
  options,
  selected,
  onSelect,
  colorMap,
}: {
  label: string;
  options: readonly string[];
  selected: string;
  onSelect: (v: string) => void;
  colorMap?: Record<string, string>;
}) {
  return (
    <View style={styles.chipSection}>
      <Text style={styles.chipSectionLabel}>{label}</Text>
      <View style={styles.chipWrap}>
        {options.map((opt) => {
          const isActive = selected === opt;
          const accent = colorMap?.[opt];
          return (
            <Pressable
              key={opt}
              onPress={() => onSelect(opt)}
              style={[
                styles.chip,
                isActive && (accent
                  ? { backgroundColor: `${accent}18`, borderColor: `${accent}50` }
                  : styles.chipSelected),
              ]}>
              <Text
                style={[
                  styles.chipText,
                  isActive && (accent
                    ? { color: accent, fontWeight: '700' }
                    : styles.chipTextSelected),
                ]}>
                {opt}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function MultiSelectChips({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <View style={styles.chipSection}>
      <Text style={styles.chipSectionLabel}>{label}</Text>
      <View style={styles.chipWrap}>
        {options.map((opt) => {
          const isSelected = selected.includes(opt);
          return (
            <Pressable
              key={opt}
              onPress={() => onToggle(opt)}
              style={[styles.chip, isSelected && styles.chipSelected]}>
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>{opt}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/* ─────────── Progress Bar ─────────── */

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressTrack}>
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressSegment,
              i < current && styles.progressSegmentDone,
              i === current && styles.progressSegmentActive,
            ]}
          />
        ))}
      </View>
      <Text style={styles.progressText}>Step {current + 1} of {total}</Text>
    </View>
  );
}

/* ══════════════ Main Component ══════════════ */

export function ProfileSetupScreen({ onContinue }: ProfileSetupScreenProps) {
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { profile, updateProfile, persistProfile } = useUserProfile();

  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Local state for selections not directly in profile
  const [goal, setGoal] = useState(profile.primaryGoal);
  const [activity, setActivity] = useState(profile.activityLevel);
  const [wellnessActivities, setWellnessActivities] = useState<string[]>(profile.wellnessActivities);
  const [existingHabits, setExistingHabits] = useState<string[]>(profile.existingWellnessHabits);
  const [wellnessGoals, setWellnessGoals] = useState<string[]>(profile.wellnessGoals);

  /* ── Multi-select toggle helpers ── */

  const toggleWellnessActivity = useCallback((w: string) => {
    if (w === 'None') { setWellnessActivities(['None']); return; }
    setWellnessActivities((prev) => {
      if (prev.includes('None')) return [w];
      if (prev.includes(w)) return prev.filter((x) => x !== w);
      return [...prev, w];
    });
  }, []);

  const toggleHabit = useCallback((h: string) => {
    if (h === 'None') { setExistingHabits(['None']); return; }
    setExistingHabits((prev) => {
      if (prev.includes('None')) return [h];
      if (prev.includes(h)) return prev.filter((x) => x !== h);
      return [...prev, h];
    });
  }, []);

  const toggleGoal = useCallback((g: string) => {
    setWellnessGoals((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g],
    );
  }, []);

  /* ── Per-step validation ── */

  const validateStep = (): boolean => {
    switch (step) {
      case 0: // Account info
        if (!profile.fullName.trim()) { showToast('Enter your full name', 'info'); return false; }
        if (!profile.username.trim()) { showToast('Choose a username', 'info'); return false; }
        if (!profile.email.trim() || !profile.email.includes('@')) { showToast('Enter a valid email', 'info'); return false; }
        if (profile.password.length < 6) { showToast('Password must be at least 6 characters', 'info'); return false; }
        return true;
      case 1: { // About You
        const ageNum = parseInt(profile.age, 10);
        if (!profile.age || Number.isNaN(ageNum) || ageNum < 13 || ageNum > 120) { showToast('Enter a valid age (13–120)', 'info'); return false; }
        if (!profile.gender) { showToast('Select your gender', 'info'); return false; }
        return true;
      }
      case 2: // Lifestyle
        if (!activity) { showToast('Select your activity level', 'info'); return false; }
        return true;
      case 3: // Goals
        if (!goal) { showToast('Select your primary wellness goal', 'info'); return false; }
        return true;
      default:
        return true;
    }
  };

  /* ── Navigation ── */

  const handleNext = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  /* ── Final submit ── */

  const handleSubmit = async () => {
    if (!validateStep()) return;

    updateProfile({
      primaryGoal: goal,
      activityLevel: activity,
      wellnessActivities,
      existingWellnessHabits: existingHabits,
      wellnessGoals,
    });
    await persistProfile();

    setIsSubmitting(true);

    try {
      const userId = profile.email.split('@')[0].trim().toLowerCase();
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
          wellnessActivities,
          // New wellness fields
          occupation: profile.occupation,
          averageSleepDuration: profile.averageSleepDuration,
          dailyScreenTime: profile.dailyScreenTime,
          stressLevel: profile.stressLevel,
          daysExercisedPerWeek: profile.daysExercisedPerWeek,
          biggestWellnessChallenge: profile.biggestWellnessChallenge,
          existingWellnessHabits: existingHabits,
          wellnessGoals,
        },
      });

      if (onContinue) {
        onContinue(goal);
      } else {
        await setLoggedIn({
          method: 'email',
          email: profile.email,
          displayName: profile.fullName,
        });
        router.replace('/onboarding-consent');
      }
    } catch (err) {
      console.error('Failed to sync onboarding profile to backend:', err);
      setIsSubmitting(false);
      showToast('Something went wrong. Please try again.', 'info');
    }
  };

  /* ── Step headers ── */

  const STEP_TITLES = [
    'Create Your Account',
    'About You',
    'Your Lifestyle',
    'Wellness Goals',
  ];

  const STEP_SUBTITLES = [
    'Set up your login credentials',
    'Help us personalize your experience',
    'Tell us about your daily habits',
    'What matters most to your wellness',
  ];

  const STEP_ICONS: (keyof typeof Ionicons.glyphMap)[] = [
    'person-add-outline',
    'body-outline',
    'fitness-outline',
    'leaf-outline',
  ];

  /* ── Full-screen loading overlay ── */

  if (isSubmitting) {
    return (
      <LinearGradient colors={['#071A0F', '#1B4332', '#0A200F']} locations={[0, 0.6, 1]} style={styles.root}>
        <View style={[styles.loadingOverlay, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          <Animated.View entering={FadeIn.duration(400)} style={styles.loadingContent}>
            <LoadingOrb size={112} />
            <View style={{ height: 36 }} />
            <LoadingSteps
              steps={ONBOARDING_LOADING_STEPS}
              intervalMs={2200}
              textStyle={styles.loadingStepText}
            />
            <Text style={styles.loadingHint}>This may take a moment</Text>
          </Animated.View>
        </View>
      </LinearGradient>
    );
  }

  /* ── Step content renderers ── */

  const renderStep0 = () => (
    <Animated.View key="step0" entering={SlideInRight.duration(300)} exiting={SlideOutLeft.duration(200)} style={styles.section}>
      <View style={styles.formCard}>
        <FormField
          label="Full name"
          value={profile.fullName}
          onChangeText={(v) => updateProfile({ fullName: v })}
          placeholder="Abel Tesfaye"
          autoCapitalize="words"
        />
        <FormField
          label="Username"
          value={profile.username}
          onChangeText={(v) => updateProfile({ username: v.replace(/\s/g, '') })}
          placeholder="abel_tesfaye"
          autoCapitalize="none"
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
      </View>
    </Animated.View>
  );

  const renderStep1 = () => (
    <Animated.View key="step1" entering={SlideInRight.duration(300)} exiting={SlideOutLeft.duration(200)} style={styles.section}>
      <View style={styles.formCard}>
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
                    <Text style={[styles.genderChipText, selected && styles.genderChipTextSelected]}>{g}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        <FormField
          label="Occupation / Work Type"
          value={profile.occupation}
          onChangeText={(v) => updateProfile({ occupation: v })}
          placeholder="e.g. Software Developer, Student"
          autoCapitalize="words"
        />
      </View>

      <SingleSelectChips
        label="Average Sleep Duration"
        options={SLEEP_OPTIONS}
        selected={profile.averageSleepDuration}
        onSelect={(v) => updateProfile({ averageSleepDuration: v })}
      />
    </Animated.View>
  );

  const renderStep2 = () => (
    <Animated.View key="step2" entering={SlideInRight.duration(300)} exiting={SlideOutLeft.duration(200)} style={styles.section}>
      <SingleSelectChips
        label="Daily Screen Time"
        options={SCREEN_TIME_OPTIONS}
        selected={profile.dailyScreenTime}
        onSelect={(v) => updateProfile({ dailyScreenTime: v })}
      />

      <SingleSelectChips
        label="Current Stress Level"
        options={STRESS_LEVELS}
        selected={profile.stressLevel}
        onSelect={(v) => updateProfile({ stressLevel: v })}
      />

      <SingleSelectChips
        label="Days Exercised Per Week"
        options={EXERCISE_DAYS}
        selected={profile.daysExercisedPerWeek}
        onSelect={(v) => updateProfile({ daysExercisedPerWeek: v })}
      />

      <SingleSelectChips
        label="Activity Level"
        options={ACTIVITY_LEVELS}
        selected={activity}
        onSelect={setActivity}
        colorMap={ACTIVITY_COLORS}
      />
    </Animated.View>
  );

  const renderStep3 = () => (
    <Animated.View key="step3" entering={SlideInRight.duration(300)} exiting={SlideOutLeft.duration(200)} style={styles.section}>
      {/* Primary Wellness Goal — card grid */}
      <View style={styles.chipSection}>
        <Text style={styles.chipSectionLabel}>Primary Wellness Goal</Text>
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
      </View>

      <MultiSelectChips
        label="Current Wellness Activities"
        options={WELLNESS_ACTIVITIES}
        selected={wellnessActivities}
        onToggle={toggleWellnessActivity}
      />

      <SingleSelectChips
        label="Biggest Wellness Challenge"
        options={CHALLENGE_OPTIONS}
        selected={profile.biggestWellnessChallenge}
        onSelect={(v) => updateProfile({ biggestWellnessChallenge: v })}
      />

      <MultiSelectChips
        label="Existing Wellness Habits"
        options={HABITS_OPTIONS}
        selected={existingHabits}
        onToggle={toggleHabit}
      />

      <MultiSelectChips
        label="Wellness Goals"
        options={WELLNESS_GOALS}
        selected={wellnessGoals}
        onToggle={toggleGoal}
      />
    </Animated.View>
  );

  const STEP_RENDERERS = [renderStep0, renderStep1, renderStep2, renderStep3];

  const isLastStep = step === TOTAL_STEPS - 1;

  /* ──────────── Render ──────────── */

  return (
    <LinearGradient colors={['#071A0F', '#1B4332', '#0A200F']} locations={[0, 0.6, 1]} style={styles.root}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* Progress Bar */}
          <ProgressBar current={step} total={TOTAL_STEPS} />

          {/* Header */}
          <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
            <View style={styles.stepRow}>
              <Ionicons name={STEP_ICONS[step]} size={15} color={GREEN} />
              <Text style={styles.stepLabel}>{STEP_TITLES[step]}</Text>
            </View>
            <Text style={styles.title}>{STEP_TITLES[step]}</Text>
            <Text style={styles.subtitle}>{STEP_SUBTITLES[step]}</Text>
          </Animated.View>

          {/* Step Content */}
          {STEP_RENDERERS[step]()}

          {/* Navigation Buttons */}
          <View style={styles.navRow}>
            {step > 0 ? (
              <Pressable onPress={handleBack} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
                <Ionicons name="chevron-back" size={17} color={TEXT} />
                <Text style={styles.backText}>Back</Text>
              </Pressable>
            ) : (
              <View style={styles.navSpacer} />
            )}

            <Pressable
              onPress={isLastStep ? handleSubmit : handleNext}
              style={({ pressed }) => [pressed && styles.pressed, { flex: 1 }]}>
              <LinearGradient
                colors={isLastStep ? ['#2D6A4F', '#52B788'] : ['#1B4332', '#52B788']}
                style={styles.continueButton}>
                <Text style={styles.continueText}>{isLastStep ? 'Complete Setup' : 'Next'}</Text>
                <Ionicons name={isLastStep ? 'checkmark' : 'chevron-forward'} size={17} color={TEXT} />
              </LinearGradient>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

/* ═══════════════════ Styles ═══════════════════ */

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 20 },

  /* Progress Bar */
  progressContainer: {
    marginBottom: 20,
    alignItems: 'center',
    gap: 8,
  },
  progressTrack: {
    flexDirection: 'row',
    gap: 6,
    width: '100%',
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  progressSegmentDone: {
    backgroundColor: GREEN,
  },
  progressSegmentActive: {
    backgroundColor: 'rgba(82,183,136,0.5)',
  },
  progressText: {
    color: TEXT_MUTED,
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '600',
  },

  /* Header */
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

  /* Form */
  section: { marginBottom: 8 },
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

  /* Chips (generic) */
  chipSection: { marginTop: 16, marginBottom: 8 },
  chipSectionLabel: {
    color: 'rgba(216,243,220,0.7)',
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: 12,
  },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.09)',
  },
  chipSelected: {
    backgroundColor: 'rgba(82,183,136,0.16)',
    borderColor: 'rgba(82,183,136,0.5)',
  },
  chipText: { color: 'rgba(216,243,220,0.55)', fontSize: 13 },
  chipTextSelected: { color: GREEN, fontWeight: '700' },

  /* Goal Grid */
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

  /* Navigation */
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 17,
    paddingHorizontal: 20,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  backText: { color: TEXT, fontSize: 14, fontWeight: '600' },
  navSpacer: { width: 80 },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 17,
    borderRadius: 26,
  },
  continueText: { color: TEXT, fontSize: 15, fontWeight: '800' },
  pressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },

  /* Loading Overlay */
  loadingOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    gap: 8,
  },
  loadingStepText: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  loadingHint: {
    color: TEXT_MUTED,
    fontSize: 12,
    marginTop: 24,
  },
});
