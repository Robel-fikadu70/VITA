import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BOTTOM_NAV_BAR_HEIGHT } from '@/components/vita/bottom-nav';
import { DISCOVER_CATEGORIES, filterProviders, type Provider } from '@/constants/providers';

const TEXT = '#D8F3DC';

type ProviderCardProps = {
  provider: Provider;
  index: number;
};

function ProviderCard({ provider, index }: ProviderCardProps) {
  return (
    <Animated.View entering={FadeInUp.delay(200 + index * 80).springify()}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${provider.name}, ${provider.type}`}
        onPress={() =>
          router.push({
            pathname: '/(tabs)/provider',
            params: { id: provider.id },
          })
        }
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
        <LinearGradient
          colors={[provider.gradientStart, provider.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardImage}>
          <Text style={styles.cardEmoji}>{provider.emoji}</Text>
          <View style={[styles.cardTag, { backgroundColor: `${provider.tagColor}25`, borderColor: `${provider.tagColor}50` }]}>
            <Text style={[styles.cardTagText, { color: provider.tagColor }]}>{provider.tag}</Text>
          </View>
        </LinearGradient>
        <View style={styles.cardBody}>
          <Text style={styles.cardName} numberOfLines={1}>
            {provider.name}
          </Text>
          <Text style={styles.cardType} numberOfLines={1}>
            {provider.type}
          </Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={10} color="#D4AF37" />
            <Text style={styles.ratingText}>{provider.rating}</Text>
            <Text style={styles.reviewsText}>({provider.reviews})</Text>
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.priceText}>{provider.price}</Text>
            <Ionicons name="chevron-forward" size={12} color="rgba(216,243,220,0.35)" />
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export function DiscoverScreen() {
  const insets = useSafeAreaInsets();
  const bottomPad = insets.bottom + BOTTOM_NAV_BAR_HEIGHT + 20;
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(
    () => filterProviders(activeCategory, query),
    [activeCategory, query],
  );

  return (
    <LinearGradient colors={['#071A0F', '#1B4332', '#0A200F']} locations={[0, 0.6, 1]} style={styles.root}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}>
        <View style={[styles.headerSticky, { paddingTop: insets.top + 22 }]}>
          <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
            <Text style={styles.title}>Wellness Discovery</Text>
            <Text style={styles.subtitle}>Find your perfect wellness experience</Text>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(100)} style={styles.searchWrap}>
            <Ionicons name="search" size={16} color="rgba(216,243,220,0.4)" style={styles.searchIcon} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search yoga, spa, nutrition…"
              placeholderTextColor="rgba(216,243,220,0.35)"
              style={styles.searchInput}
            />
          </Animated.View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categories}>
            {DISCOVER_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <Pressable key={cat} onPress={() => setActiveCategory(cat)}>
                  {isActive ? (
                    <LinearGradient
                      colors={['#1B4332', '#2D6A4F']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.categoryChipActive}>
                      <Text style={styles.categoryTextActive}>{cat}</Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.categoryChip}>
                      <Text style={styles.categoryText}>{cat}</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.grid}>
          {filtered.length === 0 ? (
            <Text style={styles.empty}>No providers match your search.</Text>
          ) : (
            filtered.map((provider, index) => (
              <View key={provider.id} style={styles.gridItem}>
                <ProviderCard provider={provider} index={index} />
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flexGrow: 1 },
  headerSticky: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: 'transparent',
  },
  header: { marginBottom: 18 },
  title: { color: TEXT, fontSize: 22, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: 'rgba(216,243,220,0.5)', fontSize: 13 },
  searchWrap: {
    position: 'relative',
    marginBottom: 18,
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    top: 15,
    zIndex: 1,
  },
  searchInput: {
    paddingVertical: 14,
    paddingLeft: 46,
    paddingRight: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.11)',
    borderRadius: 20,
    color: TEXT,
    fontSize: 14,
  },
  categories: {
    gap: 8,
    paddingBottom: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
  },
  categoryChipActive: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(82,183,136,0.4)',
  },
  categoryText: {
    color: 'rgba(216,243,220,0.45)',
    fontSize: 12,
    fontWeight: '400',
  },
  categoryTextActive: {
    color: TEXT,
    fontSize: 12,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  gridItem: {
    width: '47%',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: 24,
    overflow: 'hidden',
  },
  cardImage: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardEmoji: { fontSize: 36 },
  cardTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  cardTagText: { fontSize: 9, fontWeight: '700' },
  cardBody: { padding: 12 },
  cardName: { color: TEXT, fontSize: 12, fontWeight: '800', marginBottom: 2 },
  cardType: { color: 'rgba(216,243,220,0.45)', fontSize: 10, marginBottom: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  ratingText: { color: '#D4AF37', fontSize: 10, fontWeight: '700' },
  reviewsText: { color: 'rgba(216,243,220,0.35)', fontSize: 10 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  priceText: { color: '#52B788', fontSize: 11, fontWeight: '700' },
  empty: {
    width: '100%',
    textAlign: 'center',
    color: 'rgba(216,243,220,0.5)',
    paddingVertical: 40,
    fontSize: 14,
  },
  pressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
});
