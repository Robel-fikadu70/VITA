import { Platform } from 'react-native';

const DEFAULT_PORT = 3000;
const backend_URL = process.env.EXPO_PUBLIC_API_URL;

/**
 * Resolves the backend base URL.
 * Automatically handles Android emulator loopback (10.0.2.2) vs. iOS/Web localhost,
 * and allows overriding via environment variables.
 */
const getLocalBaseUrl = (): any => {
  if (Platform.OS === 'android') {
    return backend_URL;
  }
  return `http://localhost:${DEFAULT_PORT}`;
};

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || getLocalBaseUrl();
