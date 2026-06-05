import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ACTIVE = '#52B788';
const INACTIVE = 'rgba(216,243,220,0.3)';
const BAR_BG = 'rgba(7,26,15,0.97)';
const BORDER = 'rgba(255,255,255,0.07)';
const PILL_BG = 'rgba(82,183,136,0.2)';

export const BOTTOM_NAV_BAR_HEIGHT = 76;

type TabConfig = {
  routeName: string;
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconFocused: keyof typeof Ionicons.glyphMap;
  activeColor?: string;
  pillBg?: string;
};

const TABS: TabConfig[] = [
  { routeName: 'index', id: 'Home', label: 'Home', icon: 'home-outline', iconFocused: 'home' },
  {
    routeName: 'discover',
    id: 'Discover',
    label: 'Discover',
    icon: 'compass-outline',
    iconFocused: 'compass',
  },
  {
    routeName: 'screenings',
    id: 'Screenings',
    label: 'Screenings',
    icon: 'clipboard-outline',
    iconFocused: 'clipboard',
    activeColor: '#4ECDC4',
    pillBg: 'rgba(78,205,196,0.2)',
  },
  {
    routeName: 'ai',
    id: 'AI',
    label: 'Vita AI',
    icon: 'sparkles-outline',
    iconFocused: 'sparkles',
  },
  {
    routeName: 'history',
    id: 'History',
    label: 'History',
    icon: 'time-outline',
    iconFocused: 'time',
  },
  {
    routeName: 'settings',
    id: 'Settings',
    label: 'Settings',
    icon: 'settings-outline',
    iconFocused: 'settings',
  },
];

/** Routes opened from tabs — not shown in the tab bar */
const HIDDEN_TAB_ROUTES = new Set([
  'notifications',
  'provider',
  'booking',
  'rx-details',
  'consent',
  'daily-report',
  'assessment',
  'screening-results',
]);

const HIDDEN_TAB_PARENT: Record<string, string> = {
  consent: 'Settings',
  'daily-report': 'History',
  provider: 'Discover',
  booking: 'Home',
  notifications: 'Home',
  'rx-details': 'History',
  assessment: 'Screenings',
  'screening-results': 'Screenings',
};

type TabButtonProps = {
  tab: TabConfig;
  isActive: boolean;
  onPress: () => void;
};

function TabButton({ tab, isActive, onPress }: TabButtonProps) {
  const activeColor = tab.activeColor ?? ACTIVE;
  const pillBg = tab.pillBg ?? PILL_BG;
  const scale = useSharedValue(isActive ? 1 : 0.95);
  const dotScale = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    scale.value = withTiming(isActive ? 1 : 0.95, { duration: 250 });
    dotScale.value = withSpring(isActive ? 1 : 0, { stiffness: 500, damping: 35 });
  }, [isActive, dotScale, scale]);

  const iconWrapStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
    opacity: dotScale.value,
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={tab.label}
      onPress={onPress}
      style={styles.tabButton}>
      <Animated.View
        style={[
          styles.iconPill,
          iconWrapStyle,
          { backgroundColor: isActive ? pillBg : 'transparent' },
        ]}>
        <Ionicons
          name={isActive ? tab.iconFocused : tab.icon}
          size={tab.id === 'AI' ? 18 : 20}
          color={isActive ? activeColor : INACTIVE}
        />
      </Animated.View>
      <Text
        style={[
          styles.label,
          isActive && [styles.labelActive, { color: activeColor }],
        ]}
        numberOfLines={1}>
        {tab.label}
      </Text>
      <Animated.View style={[styles.dot, { backgroundColor: activeColor }, dotStyle]} />
    </Pressable>
  );
}

function getActiveTabId(routeName: string): string {
  if (HIDDEN_TAB_ROUTES.has(routeName)) {
    return HIDDEN_TAB_PARENT[routeName] ?? 'Home';
  }
  const tab = TABS.find((t) => t.routeName === routeName);
  return tab?.id ?? 'Home';
}

export function BottomNav({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const activeRouteName = state.routes[state.index]?.name ?? 'index';
  const activeId = getActiveTabId(activeRouteName);

  return (
    <View
      style={[
        styles.wrapper,
        {
          paddingBottom: insets.bottom,
          borderTopColor: BORDER,
          backgroundColor: BAR_BG,
        },
      ]}>
      <View style={styles.bar}>
        {TABS.map((tab) => {
          const isActive = activeId === tab.id;
          return (
            <TabButton
              key={tab.id}
              tab={tab}
              isActive={isActive}
              onPress={() => {
                if (!isActive) {
                  navigation.navigate(tab.routeName);
                }
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: 1,
  },
  bar: {
    height: BOTTOM_NAV_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: 6,
    minWidth: 0,
  },
  iconPill: {
    width: 38,
    height: 26,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 8,
    fontWeight: '400',
    color: INACTIVE,
    letterSpacing: 0.1,
  },
  labelActive: {
    fontWeight: '700',
    color: ACTIVE,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: ACTIVE,
    marginTop: -2,
  },
});
