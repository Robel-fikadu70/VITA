import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInLeft, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LoadingOrb, LoadingSteps } from '@/components/vita/loading-orb';
import { useToast } from '@/components/vita/toast';
import { apiClient, getActiveUserId } from '@/lib/api-client';
import { getScreeningById } from '@/lib/screening-registry';

const TEXT = '#D8F3DC';
const TEXT_MUTED = 'rgba(216,243,220,0.55)';

const SCREENING_LOADING_STEPS = [
  'Reviewing your responses...',
  'Analyzing wellness indicators...',
  'Identifying relevant patterns...',
  'Generating personalized insights...',
  'Preparing recommendations...',
];

export function AssessmentScreen() {
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { screeningId } = useLocalSearchParams<{ screeningId: string }>();

  const screening = getScreeningById(screeningId ?? '');

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state each time the screen gains focus.
  // This hidden tab is kept mounted between navigations, so without this
  // isSubmitting stays true from the previous submission and the loader
  // appears immediately on the next assessment.
  useFocusEffect(
    useCallback(() => {
      setIsSubmitting(false);
      setAnswers({});
    }, []),
  );

  const setAnswer = useCallback((key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }, []);

  /* ── Not found guard ── */
  if (!screening) {
    return (
      <LinearGradient colors={['#071A0F', '#1B4332', '#0A200F']} locations={[0, 0.6, 1]} style={styles.root}>
        <View style={[styles.center, { paddingTop: insets.top + 48 }]}>
          <Ionicons name="alert-circle-outline" size={48} color="rgba(216,243,220,0.3)" />
          <Text style={styles.notFoundText}>Assessment not found</Text>
          <Pressable onPress={() => router.back()} style={styles.backLink}>
            <Text style={styles.backLinkText}>← Go back</Text>
          </Pressable>
        </View>
      </LinearGradient>
    );
  }

  /* ── Full-screen loading overlay ── */
  if (isSubmitting) {
    return (
      <LinearGradient
        colors={screening.gradientColors as [string, string, string]}
        locations={[0, 0.5, 1]}
        style={styles.root}>
        <View style={[styles.loadingOverlay, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          <Animated.View entering={FadeIn.duration(400)} style={styles.loadingContent}>
            <LoadingOrb size={112} />
            <View style={{ height: 36 }} />
            <LoadingSteps
              steps={SCREENING_LOADING_STEPS}
              intervalMs={2000}
              textStyle={{ color: screening.color, fontSize: 15, fontWeight: '600', textAlign: 'center', paddingHorizontal: 32 }}
            />
            <Text style={[styles.loadingHint, { color: `${screening.color}70` }]}>
              Analyzing with Vita AI…
            </Text>
          </Animated.View>
        </View>
      </LinearGradient>
    );
  }

  /* ── Submit ── */
  const handleSubmit = async () => {
    const answered = Object.keys(answers).length;
    if (answered < screening.questions.length) {
      showToast(`Please answer all ${screening.questions.length} questions`, 'info');
      return;
    }

    setIsSubmitting(true);

    try {
      const userId = await getActiveUserId();
      const message = screening.promptTemplate(answers);
      const res = await apiClient.post<{ response: string }>('/wellness/chat', {
        userId,
        message,
      });

      const aiResponse = res.response || 'Unable to generate insights at this time.';

      // Navigate to results, passing data via params
      router.replace({
        pathname: '/(tabs)/screening-results',
        params: {
          screeningId: screening.id,
          aiResponse,
        },
      });
    } catch (err) {
      console.error('Screening analysis failed:', err);
      setIsSubmitting(false);
      showToast('Analysis failed. Please try again.', 'info');
    }
  };

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === screening.questions.length;

  return (
    <LinearGradient
      colors={screening.gradientColors as [string, string, string]}
      locations={[0, 0.5, 1]}
      style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}>

        {/* Back button */}
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={20} color={screening.color} />
          <Text style={[styles.backButtonText, { color: screening.color }]}>Screenings</Text>
        </Pressable>

        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <View style={styles.iconRow}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: `${screening.color}18`, borderColor: `${screening.color}30` },
              ]}>
              <Ionicons
                name={screening.icon as keyof typeof Ionicons.glyphMap}
                size={24}
                color={screening.color}
              />
            </View>
            <View>
              <Text style={[styles.eyebrow, { color: screening.color }]}>
                {screening.tagline}
              </Text>
              <Text style={styles.title}>{screening.title}</Text>
            </View>
          </View>
          <Text style={[styles.subtitle, { color: `${screening.color}99` }]}>
            Answer all questions to receive your personalized AI wellness insight.
          </Text>

          {/* Progress chips */}
          <View style={styles.progressRow}>
            {screening.questions.map((q, i) => (
              <View
                key={q.key}
                style={[
                  styles.progressDot,
                  {
                    backgroundColor: answers[q.key]
                      ? screening.color
                      : `${screening.color}25`,
                  },
                ]}
              />
            ))}
            <Text style={[styles.progressLabel, { color: `${screening.color}80` }]}>
              {answeredCount}/{screening.questions.length} answered
            </Text>
          </View>
        </Animated.View>

        {/* Questions */}
        <View style={styles.questions}>
          {screening.questions.map((q, index) => {
            const selected = answers[q.key];
            return (
              <Animated.View
                key={q.key}
                entering={FadeInLeft.delay(150 + index * 100).springify()}
                style={[
                  styles.questionCard,
                  {
                    borderColor: selected
                      ? `${screening.color}35`
                      : 'rgba(255,255,255,0.08)',
                    backgroundColor: selected
                      ? `${screening.color}07`
                      : 'rgba(255,255,255,0.04)',
                  },
                ]}>
                <View style={styles.questionMeta}>
                  <Text style={[styles.questionNumber, { color: `${screening.color}80` }]}>
                    Q{index + 1}
                  </Text>
                  {selected && (
                    <Ionicons name="checkmark-circle" size={14} color={screening.color} />
                  )}
                </View>
                <Text style={styles.questionText}>{q.question}</Text>
                <View style={styles.optionsWrap}>
                  {q.options.map((opt) => {
                    const isSelected = selected === opt;
                    return (
                      <Pressable
                        key={opt}
                        accessibilityRole="button"
                        accessibilityState={{ selected: isSelected }}
                        onPress={() => setAnswer(q.key, opt)}
                        style={[
                          styles.optionButton,
                          isSelected
                            ? {
                                backgroundColor: `${screening.color}20`,
                                borderColor: `${screening.color}60`,
                              }
                            : styles.optionDefault,
                        ]}>
                        <Text
                          style={[
                            styles.optionText,
                            { color: isSelected ? screening.color : `${screening.color}60` },
                            isSelected && styles.optionTextSelected,
                          ]}>
                          {opt}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </Animated.View>
            );
          })}
        </View>

        {/* Disclaimer */}
        <Animated.View entering={FadeIn.delay(600)} style={styles.disclaimer}>
          <Ionicons name="alert-circle-outline" size={15} color="#F4A261" style={{ marginTop: 1 }} />
          <Text style={styles.disclaimerText}>
            VITA never diagnoses conditions. If responses indicate patterns of concern, we will
            recommend consulting a qualified healthcare professional.
          </Text>
        </Animated.View>

        {/* Submit button */}
        <Animated.View entering={FadeInUp.delay(700)}>
          <Pressable
            onPress={handleSubmit}
            disabled={!allAnswered}
            style={({ pressed }) => [pressed && styles.pressed]}>
            <LinearGradient
              colors={
                allAnswered
                  ? [screening.gradientColors[1], screening.color]
                  : ['rgba(255,255,255,0.04)', 'rgba(255,255,255,0.06)']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.submitButton}>
              <Text style={[styles.submitText, !allAnswered && styles.submitTextDisabled]}>
                {allAnswered ? 'Submit Assessment' : `Answer ${screening.questions.length - answeredCount} more`}
              </Text>
              {allAnswered && (
                <Ionicons name="sparkles" size={16} color={TEXT} />
              )}
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 20 },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  notFoundText: { color: 'rgba(216,243,220,0.5)', fontSize: 16 },
  backLink: { padding: 8 },
  backLinkText: { color: '#52B788', fontSize: 14 },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  backButtonText: { fontSize: 13, fontWeight: '600' },

  header: { marginBottom: 22 },
  iconRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12 },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  title: { color: TEXT, fontSize: 20, fontWeight: '800' },
  subtitle: { fontSize: 13, lineHeight: 21, marginBottom: 14 },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressLabel: { fontSize: 11, marginLeft: 4 },

  questions: { gap: 12, marginBottom: 18 },
  questionCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
  },
  questionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  questionNumber: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  questionText: {
    color: TEXT,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 14,
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 13,
    borderWidth: 1.5,
  },
  optionDefault: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.08)',
  },
  optionText: { fontSize: 12 },
  optionTextSelected: { fontWeight: '700' },

  disclaimer: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: 'rgba(244,162,97,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(244,162,97,0.22)',
    borderRadius: 18,
    padding: 14,
    marginBottom: 18,
    alignItems: 'flex-start',
  },
  disclaimerText: {
    flex: 1,
    color: 'rgba(244,162,97,0.8)',
    fontSize: 11,
    lineHeight: 19,
  },

  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 17,
    borderRadius: 26,
  },
  submitText: { color: TEXT, fontSize: 15, fontWeight: '800' },
  submitTextDisabled: { color: 'rgba(216,243,220,0.3)', fontWeight: '600' },
  pressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },

  loadingOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingContent: { alignItems: 'center', gap: 8 },
  loadingHint: { fontSize: 12, marginTop: 24 },
});
