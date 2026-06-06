import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BOTTOM_NAV_BAR_HEIGHT } from '@/components/vita/bottom-nav';
import { SCREENINGS, type ScreeningDefinition } from '@/lib/screening-registry';

const TEXT = '#D8F3DC';
const TEXT_MUTED = 'rgba(216,243,220,0.55)';
const GREEN = '#52B788';

/* ──────────── Screening Card ──────────── */

function ScreeningCard({
  screening,
  index,
}: {
  screening: ScreeningDefinition;
  index: number;
}) {
  const handleStart = () => {
    router.push(`/(tabs)/assessment?screeningId=${screening.id}`);
  };

  return (
    <Animated.View entering={FadeInDown.delay(100 + index * 120).springify()}>
      <Pressable
        onPress={handleStart}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
        {/* Colored left accent strip */}
        <View style={[styles.cardAccent, { backgroundColor: screening.color }]} />

        <View style={styles.cardBody}>
          {/* Icon + Title row */}
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: `${screening.color}18`, borderColor: `${screening.color}30` },
              ]}>
              <Ionicons
                name={screening.icon as keyof typeof Ionicons.glyphMap}
                size={22}
                color={screening.color}
              />
            </View>
            <View style={styles.cardTitles}>
              <Text style={[styles.cardTagline, { color: screening.color }]}>
                {screening.tagline}
              </Text>
              <Text style={styles.cardTitle}>{screening.title}</Text>
            </View>
          </View>

          <Text style={styles.cardDescription}>{screening.description}</Text>

          {/* CTA */}
          <View style={styles.cardFooter}>
            <Text style={styles.questionCount}>
              {screening.questions.length} questions
            </Text>
            <Pressable
              onPress={handleStart}
              style={({ pressed }) => [
                styles.startButton,
                { backgroundColor: `${screening.color}18`, borderColor: `${screening.color}40` },
                pressed && styles.startButtonPressed,
              ]}>
              <Text style={[styles.startButtonText, { color: screening.color }]}>
                Start Assessment
              </Text>
              <Ionicons
                name="arrow-forward"
                size={13}
                color={screening.color}
              />
            </Pressable>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

/* ──────────── Main Screen ──────────── */

export function ScreeningsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={['#071A0F', '#1B4332', '#0A200F']}
      locations={[0, 0.6, 1]}
      style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + 28,
            paddingBottom: insets.bottom + BOTTOM_NAV_BAR_HEIGHT + 32,
          },
        ]}
        showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <View style={styles.titleRow}>
            <Ionicons name="clipboard-outline" size={18} color={GREEN} />
            <Text style={styles.eyebrow}>Wellness Screenings</Text>
          </View>
          <Text style={styles.title}>Health Assessments</Text>
          <Text style={styles.subtitle}>
            AI-powered screening tools to understand your wellness patterns.
            Results are educational insights, not diagnoses.
          </Text>
        </Animated.View>

        {/* Info badge */}
        <Animated.View entering={FadeIn.delay(200)} style={styles.infoBadge}>
          <Ionicons name="shield-checkmark-outline" size={14} color={GREEN} />
          <Text style={styles.infoBadgeText}>
            All assessments are confidential and powered by Vita AI
          </Text>
        </Animated.View>

        {/* Screening cards */}
        <View style={styles.cards}>
          {SCREENINGS.map((screening, index) => (
            <ScreeningCard key={screening.id} screening={screening} index={index} />
          ))}
        </View>

        {/* Footer disclaimer */}
        <Animated.View entering={FadeIn.delay(600)} style={styles.disclaimer}>
          <Ionicons name="alert-circle-outline" size={14} color="#F4A261" />
          <Text style={styles.disclaimerText}>
            These screenings are for educational purposes only and are not a substitute for
            professional medical advice, diagnosis, or treatment.
          </Text>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 20 },

  header: { marginBottom: 16 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  eyebrow: {
    color: GREEN,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  title: {
    color: TEXT,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  subtitle: {
    color: TEXT_MUTED,
    fontSize: 13,
    lineHeight: 21,
  },

  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(82,183,136,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(82,183,136,0.2)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginBottom: 22,
  },
  infoBadgeText: {
    color: 'rgba(216,243,220,0.7)',
    fontSize: 12,
    flex: 1,
  },

  cards: { gap: 14, marginBottom: 22 },

  card: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: 24,
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  cardAccent: {
    width: 4,
  },
  cardBody: {
    flex: 1,
    padding: 18,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitles: { flex: 1 },
  cardTagline: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  cardTitle: {
    color: TEXT,
    fontSize: 15,
    fontWeight: '800',
    lineHeight: 20,
  },
  cardDescription: {
    color: TEXT_MUTED,
    fontSize: 12,
    lineHeight: 19,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  questionCount: {
    color: 'rgba(216,243,220,0.35)',
    fontSize: 11,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 12,
    borderWidth: 1,
  },
  startButtonPressed: { opacity: 0.7 },
  startButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },

  disclaimer: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'rgba(244,162,97,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(244,162,97,0.18)',
    borderRadius: 16,
    padding: 14,
    alignItems: 'flex-start',
  },
  disclaimerText: {
    flex: 1,
    color: 'rgba(244,162,97,0.75)',
    fontSize: 11,
    lineHeight: 18,
  },
});
