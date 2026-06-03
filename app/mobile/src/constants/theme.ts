/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#6b6375',
    textH: '#08060d',
    background: '#ffffff',
    backgroundElement: '#f4f3ec',
    backgroundSelected: '#e5e4e7',
    textSecondary: '#6b6375',
    border: '#e5e4e7',
    codeBg: '#f4f3ec',
    accent: '#aa3bff',
    accentBg: 'rgba(170, 59, 255, 0.1)',
    accentBorder: 'rgba(170, 59, 255, 0.5)',
    socialBg: 'rgba(244, 243, 236, 0.5)',
    link: '#aa3bff',
  },
  dark: {
    text: '#9ca3af',
    textH: '#f3f4f6',
    background: '#16171d',
    backgroundElement: '#1f2028',
    backgroundSelected: '#2e303a',
    textSecondary: '#9ca3af',
    border: '#2e303a',
    codeBg: '#1f2028',
    accent: '#c084fc',
    accentBg: 'rgba(192, 132, 252, 0.15)',
    accentBorder: 'rgba(192, 132, 252, 0.5)',
    socialBg: 'rgba(47, 48, 58, 0.5)',
    link: '#c084fc',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
