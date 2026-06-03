import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInLeft, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BOTTOM_NAV_BAR_HEIGHT } from '@/components/vita/bottom-nav';
import { useToast } from '@/components/vita/toast';

const PINK = '#FAD2E1';
const PINK_MUTED = 'rgba(250,210,225,0.58)';
const PINK_INACTIVE = 'rgba(250,210,225,0.45)';

const QUESTIONS = [
  { key: 'cycle', question: 'How regular is your cycle?', options: ['Regular', 'Irregular', 'Not Sure'] },
  { key: 'fatigue', question: 'Have you experienced unusual fatigue recently?', options: ['Yes', 'No'] },
  { key: 'acne', question: 'Have you experienced severe acne?', options: ['Yes', 'No'] },
  { key: 'hair', question: 'Have you experienced unusual hair growth?', options: ['Yes', 'No'] },
  { key: 'weight', question: 'Do you struggle with unexpected weight gain?', options: ['Yes', 'No'] },
] as const;

export function WomensWellnessScreen() {
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const bottomPad = insets.bottom + BOTTOM_NAV_BAR_HEIGHT + 28;

  const setAnswer = useCallback((key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleContinue = () => {
    const answered = Object.keys(answers).length;
    if (answered < QUESTIONS.length) {
      showToast(`Please answer all ${QUESTIONS.length} questions`, 'info');
      return;
    }
    showToast('Assessment saved successfully', 'success');
    router.push('/(tabs)');
  };

  return (
    <LinearGradient
      colors={['#1A0A12', '#2D1520', '#1A0A12']}
      locations={[0, 0.5, 1]}
      style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 28, paddingBottom: bottomPad },
        ]}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <View style={styles.stepRow}>
            <Ionicons name="heart" size={15} color={PINK} />
            <Text style={styles.stepLabel}>Step 3 of 5 · Women&apos;s Health</Text>
          </View>
          <Text style={styles.title}>Women&apos;s Wellness Assessment</Text>
          <Text style={styles.subtitle}>
            Help us understand your hormonal wellness patterns to provide better support.
          </Text>
        </Animated.View>

        <View style={styles.questions}>
          {QUESTIONS.map((q, index) => {
            const selected = answers[q.key];
            return (
              <Animated.View
                key={q.key}
                entering={FadeInLeft.delay(200 + index * 100).springify()}
                style={[
                  styles.questionCard,
                  {
                    borderColor: selected ? 'rgba(250,210,225,0.25)' : 'rgba(250,210,225,0.1)',
                  },
                ]}>
                <Text style={styles.questionText}>{q.question}</Text>
                <View style={styles.optionsRow}>
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
                          isSelected ? styles.optionSelected : styles.optionDefault,
                        ]}>
                        <Text
                          style={[
                            styles.optionText,
                            isSelected ? styles.optionTextSelected : styles.optionTextDefault,
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

        <Animated.View entering={FadeIn.delay(750)} style={styles.disclaimer}>
          <Ionicons name="alert-circle-outline" size={16} color="#F4A261" style={styles.disclaimerIcon} />
          <Text style={styles.disclaimerText}>
            VITAL-ETHIO never diagnoses conditions. If your responses indicate patterns commonly
            associated with hormonal imbalance, we will suggest consulting a healthcare professional.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(850)}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Continue assessment"
            onPress={handleContinue}
            style={({ pressed }) => [pressed && styles.pressed]}>
            <LinearGradient
              colors={['#4A1530', '#C9607A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.continueButton}>
              <Text style={styles.continueText}>Continue</Text>
              <Ionicons name="chevron-forward" size={17} color={PINK} />
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
  header: { marginBottom: 24 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  stepLabel: {
    color: PINK,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  title: { color: PINK, fontSize: 22, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: PINK_MUTED, fontSize: 13, lineHeight: 22 },
  questions: { gap: 14, marginBottom: 22 },
  questionCard: {
    backgroundColor: 'rgba(250,210,225,0.05)',
    borderWidth: 1,
    borderRadius: 24,
    padding: 18,
  },
  questionText: {
    color: PINK,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 14,
    lineHeight: 20,
  },
  optionsRow: { flexDirection: 'row', gap: 8 },
  optionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  optionDefault: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: 'rgba(255,255,255,0.08)',
  },
  optionSelected: {
    backgroundColor: 'rgba(250,210,225,0.18)',
    borderColor: 'rgba(250,210,225,0.5)',
  },
  optionText: { fontSize: 13 },
  optionTextDefault: { color: PINK_INACTIVE, fontWeight: '400' },
  optionTextSelected: { color: PINK, fontWeight: '700' },
  disclaimer: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: 'rgba(244,162,97,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(244,162,97,0.22)',
    borderRadius: 20,
    padding: 14,
    marginBottom: 22,
  },
  disclaimerIcon: { marginTop: 1 },
  disclaimerText: {
    flex: 1,
    color: 'rgba(244,162,97,0.85)',
    fontSize: 12,
    lineHeight: 20,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 17,
    borderRadius: 26,
    shadowColor: '#4A1530',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 18,
    elevation: 8,
  },
  continueText: { color: PINK, fontSize: 15, fontWeight: '800' },
  pressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
});
