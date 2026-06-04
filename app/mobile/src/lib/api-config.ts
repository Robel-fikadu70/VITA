import { Platform } from 'react-native';

const DEFAULT_PORT = 3000;

/**
 * Resolves the backend base URL.
 * Automatically handles Android emulator loopback (10.0.2.2) vs. iOS/Web localhost,
 * and allows overriding via environment variables.
 */
const getLocalBaseUrl = (): string => {
  if (Platform.OS === 'android') {
    return `http://192.168.1.4:${DEFAULT_PORT}`;
  }
  return `http://localhost:${DEFAULT_PORT}`;
};

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || getLocalBaseUrl();
