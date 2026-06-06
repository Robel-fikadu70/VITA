import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BOTTOM_NAV_BAR_HEIGHT } from '@/components/vita/bottom-nav';
import {
  PROVIDER_REVIEWS,
  PROVIDER_SERVICES,
  PROVIDER_TIMES,
  type Provider,
} from '@/constants/providers';

const TEXT = '#D8F3DC';
const GREEN = '#52B788';

type ProviderDetailScreenProps = {
  provider: Provider;
};

export function ProviderDetailScreen({ provider }: ProviderDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const bottomPad = insets.bottom + BOTTOM_NAV_BAR_HEIGHT + 24;
  const [selectedTime, setSelectedTime] = useState('5:00 PM');
  const [liked, setLiked] = useState(false);

  const handleBook = () => {
    router.push({
      pathname: '/(tabs)/booking',
      params: {
        id: provider.id,
        time: selectedTime,
        service: PROVIDER_SERVICES[0].name,
      },
    });
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: bottomPad }}
        showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[provider.gradientStart, provider.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + 16 }]}>
          <Text style={styles.heroEmoji}>{provider.emoji}</Text>
          <Pressable onPress={() => router.back()} style={styles.heroButton} hitSlop={8}>
            <Ionicons name="arrow-back" size={18} color="#ffffff" />
          </Pressable>
          <Pressable onPress={() => setLiked((v) => !v)} style={[styles.heroButton, styles.heroButtonRight]} hitSlop={8}>
            <Ionicons name={liked ? 'heart' : 'heart-outline'} size={18} color={liked ? '#FF6B6B' : '#ffffff'} />
          </Pressable>
          <View style={styles.aiBadge}>
            <Text style={styles.aiBadgeText}>🧠 AI-Recommended for You</Text>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          <Animated.View entering={FadeInDown.duration(400)} style={styles.infoBlock}>
            <View style={styles.titleRow}>
              <View style={styles.titleCopy}>
                <Text style={styles.name}>{provider.name}</Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Ionicons key={i} name="star" size={13} color="#D4AF37" />
                  ))}
                  <Text style={styles.rating}>{provider.rating}</Text>
                  <Text style={styles.reviewCount}>({provider.reviews} reviews)</Text>
                </View>
              </View>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{provider.discountLabel}</Text>
              </View>
            </View>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={13} color="rgba(216,243,220,0.45)" />
              <Text style={styles.locationText}>
                {provider.location}, Addis Ababa · {provider.distance}
              </Text>
            </View>
            <Text style={styles.description}>{provider.description}</Text>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(180)} style={styles.section}>
            <Text style={styles.sectionTitle}>Available Services</Text>
            {PROVIDER_SERVICES.map((service, index) => (
              <View
                key={service.name}
                style={[styles.serviceRow, index === 0 && styles.serviceRowHighlight]}>
                <View style={styles.serviceCopy}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <View style={styles.durationRow}>
                    <Ionicons name="time-outline" size={11} color="rgba(216,243,220,0.4)" />
                    <Text style={styles.durationText}>{service.duration}</Text>
                  </View>
                </View>
                <View style={styles.servicePrice}>
                  <Text style={styles.discountPrice}>{service.discount}</Text>
                  <Text style={styles.originalPrice}>{service.price}</Text>
                </View>
                {index === 0 ? <Text style={styles.featuredMark}>✦</Text> : null}
              </View>
            ))}
          </Animated.View>

          <Animated.View entering={FadeIn.delay(280)} style={styles.section}>
            <Text style={styles.sectionTitle}>Available Times — Today</Text>
            <View style={styles.timesWrap}>
              {PROVIDER_TIMES.map((time) => {
                const isSelected = selectedTime === time;
                return (
                  <Pressable
                    key={time}
                    onPress={() => setSelectedTime(time)}
                    style={[styles.timeChip, isSelected && styles.timeChipSelected]}>
                    <Text style={[styles.timeText, isSelected && styles.timeTextSelected]}>{time}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(380)} style={styles.section}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            {PROVIDER_REVIEWS.map((review) => (
              <View key={review.name} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewerRow}>
                    <LinearGradient colors={['#1B4332', '#52B788']} style={styles.reviewerAvatar}>
                      <Text style={styles.reviewerInitial}>{review.name[0]}</Text>
                    </LinearGradient>
                    <Text style={styles.reviewerName}>{review.name}</Text>
                  </View>
                  <View style={styles.reviewStars}>
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Ionicons key={i} name="star" size={11} color="#D4AF37" />
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewText}>{review.text}</Text>
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
            ))}
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(500)}>
            <Pressable onPress={handleBook} style={({ pressed }) => [pressed && styles.pressed]}>
              <LinearGradient colors={['#1B4332', '#52B788']} style={styles.bookButton}>
                <Text style={styles.bookText}>
                  Book Appointment · {selectedTime}
                </Text>
                <Ionicons name="chevron-forward" size={17} color={TEXT} />
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#071A0F' },
  hero: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  heroEmoji: { fontSize: 64 },
  heroButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroButtonRight: { left: undefined, right: 16 },
  aiBadge: {
    position: 'absolute',
    bottom: 14,
    left: 16,
    backgroundColor: 'rgba(27,67,50,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(82,183,136,0.4)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  aiBadgeText: { color: GREEN, fontSize: 11, fontWeight: '700' },
  body: { paddingHorizontal: 20, paddingTop: 20 },
  infoBlock: { marginBottom: 18 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 12,
  },
  titleCopy: { flex: 1 },
  name: { color: TEXT, fontSize: 22, fontWeight: '900', marginBottom: 4 },
  starsRow: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' },
  rating: { color: '#D4AF37', fontSize: 13, fontWeight: '700' },
  reviewCount: { color: 'rgba(216,243,220,0.4)', fontSize: 12 },
  discountBadge: {
    backgroundColor: 'rgba(82,183,136,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(82,183,136,0.3)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  discountText: { color: GREEN, fontSize: 11, fontWeight: '700' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 12 },
  locationText: { color: 'rgba(216,243,220,0.55)', fontSize: 12, flex: 1 },
  description: { color: 'rgba(216,243,220,0.65)', fontSize: 13, lineHeight: 22 },
  section: { marginBottom: 20 },
  sectionTitle: {
    color: 'rgba(216,243,220,0.6)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: 20,
    padding: 14,
    marginBottom: 8,
  },
  serviceRowHighlight: {
    backgroundColor: 'rgba(82,183,136,0.08)',
    borderColor: 'rgba(82,183,136,0.25)',
  },
  serviceCopy: { flex: 1 },
  serviceName: { color: TEXT, fontSize: 14, fontWeight: '700', marginBottom: 3 },
  durationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  durationText: { color: 'rgba(216,243,220,0.45)', fontSize: 11 },
  servicePrice: { alignItems: 'flex-end' },
  discountPrice: { color: TEXT, fontSize: 14, fontWeight: '800' },
  originalPrice: {
    color: 'rgba(216,243,220,0.35)',
    fontSize: 11,
    textDecorationLine: 'line-through',
  },
  featuredMark: { fontSize: 14, color: GREEN },
  timesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.09)',
  },
  timeChipSelected: {
    backgroundColor: 'rgba(82,183,136,0.2)',
    borderColor: 'rgba(82,183,136,0.5)',
  },
  timeText: { color: 'rgba(216,243,220,0.55)', fontSize: 13 },
  timeTextSelected: { color: GREEN, fontWeight: '700' },
  reviewCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reviewerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewerInitial: { color: TEXT, fontSize: 13, fontWeight: '800' },
  reviewerName: { color: TEXT, fontSize: 13, fontWeight: '600' },
  reviewStars: { flexDirection: 'row', gap: 2 },
  reviewText: { color: 'rgba(216,243,220,0.65)', fontSize: 12, lineHeight: 19, marginBottom: 6 },
  reviewDate: { color: 'rgba(216,243,220,0.3)', fontSize: 11 },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
    borderRadius: 26,
  },
  bookText: { color: TEXT, fontSize: 15, fontWeight: '800', flexShrink: 1 },
  pressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
});
