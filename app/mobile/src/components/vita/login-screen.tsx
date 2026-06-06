import { Ionicons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useToast } from '@/components/vita/toast';
import { navigateAfterLogin } from '@/lib/auth-navigation';
import { setLoggedIn } from '@/lib/auth-storage';
import { isOnboardingComplete } from '@/lib/onboarding-storage';

WebBrowser.maybeCompleteAuthSession();

const TEXT = '#D8F3DC';
const GREEN = '#52B788';

const GOOGLE_IOS_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
const GOOGLE_ANDROID_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
const GOOGLE_WEB_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const GOOGLE_CONFIGURED = Boolean(GOOGLE_IOS_ID || GOOGLE_ANDROID_ID || GOOGLE_WEB_ID);

export function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: GOOGLE_IOS_ID || '123456789-abcdef.apps.googleusercontent.com',
    androidClientId: GOOGLE_ANDROID_ID || '123456789-abcdef.apps.googleusercontent.com',
    webClientId: GOOGLE_WEB_ID || '123456789-abcdef.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type !== 'success') return;

    const finishGoogle = async () => {
      setGoogleLoading(true);
      try {
        await setLoggedIn({
          method: 'google',
          email: 'google.user@gmail.com',
          displayName: 'Google User',
        });
        showToast('Signed in with Google', 'success');
        await navigateAfterLogin();
      } finally {
        setGoogleLoading(false);
      }
    };

    finishGoogle();
  }, [response, showToast]);

  const handleEmailSignIn = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail.includes('@')) {
      showToast('Enter a valid email address', 'info');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'info');
      return;
    }

    setSubmitting(true);
    try {
      await setLoggedIn({ method: 'email', email: trimmedEmail });
      showToast('Welcome back!', 'success');
      await navigateAfterLogin();
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (googleLoading || submitting) return;

    if (GOOGLE_CONFIGURED && request) {
      setGoogleLoading(true);
      try {
        await promptAsync();
      } catch {
        showToast('Google sign-in was cancelled', 'info');
      } finally {
        setGoogleLoading(false);
      }
      return;
    }

    setGoogleLoading(true);
    try {
      const completed = await isOnboardingComplete();
      await setLoggedIn({
        method: 'google',
        email: 'demo.google@gmail.com',
        displayName: 'Google User',
      });
      showToast(
        completed ? 'Signed in with Google' : 'Google account linked — complete your profile',
        'success',
      );
      await navigateAfterLogin();
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSignUp = () => {
    router.replace('/profile-setup');
  };

  const busy = submitting || googleLoading;

  return (
    <LinearGradient colors={['#071A0F', '#1B4332', '#0A200F']} locations={[0, 0.55, 1]} style={styles.root}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 32 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeInDown.duration(450)} style={styles.brandBlock}>
            <LinearGradient colors={['#1B4332', '#52B788']} style={styles.logo}>
              <Text style={styles.logoText}>V</Text>
            </LinearGradient>
            <Text style={styles.brand}>VITA</Text>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to continue your wellness journey</Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(120).duration(400)} style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="rgba(216,243,220,0.35)"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
              editable={!busy}
            />

            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordWrap}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="rgba(216,243,220,0.35)"
                secureTextEntry={!showPassword}
                style={[styles.input, styles.passwordInput]}
                editable={!busy}
              />
              <Pressable
                onPress={() => setShowPassword((v) => !v)}
                style={styles.eyeButton}
                hitSlop={8}
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="rgba(216,243,220,0.45)"
                />
              </Pressable>
            </View>

            <Pressable
              onPress={handleEmailSignIn}
              disabled={busy}
              style={({ pressed }) => [pressed && !busy && styles.pressed]}>
              <LinearGradient colors={['#1B4332', '#52B788']} style={styles.primaryButton}>
                {submitting ? (
                  <ActivityIndicator color={TEXT} />
                ) : (
                  <Text style={styles.primaryButtonText}>Sign In</Text>
                )}
              </LinearGradient>
            </Pressable>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(280)} style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(350)}>
            <Pressable
              onPress={handleGoogleSignIn}
              disabled={busy}
              style={({ pressed }) => [styles.googleButton, pressed && !busy && styles.pressed, busy && styles.disabled]}>
              {googleLoading ? (
                <ActivityIndicator color="#111111" />
              ) : (
                <>
                  <Ionicons name="logo-google" size={20} color="#4285F4" />
                  <Text style={styles.googleButtonText}>Sign in with Google</Text>
                </>
              )}
            </Pressable>
            {!GOOGLE_CONFIGURED ? (
              <Text style={styles.googleHint}>
                Demo mode — add Google OAuth client IDs in `.env` for production sign-in.
              </Text>
            ) : null}
          </Animated.View>

          <Animated.View entering={FadeIn.delay(450)} style={styles.signUpRow}>
            <Text style={styles.signUpMuted}>Don&apos;t have an account? </Text>
            <Pressable onPress={handleSignUp} disabled={busy} hitSlop={8}>
              <Text style={styles.signUpLink}>Sign up</Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 24, flexGrow: 1 },
  brandBlock: { alignItems: 'center', marginBottom: 36 },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 8,
  },
  logoText: { color: TEXT, fontSize: 36, fontWeight: '900' },
  brand: {
    color: 'rgba(216,243,220,0.5)',
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: '700',
    marginBottom: 8,
  },
  title: { color: TEXT, fontSize: 28, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: 'rgba(216,243,220,0.55)', fontSize: 14, textAlign: 'center', lineHeight: 21 },
  form: { gap: 8, marginBottom: 8 },
  label: {
    color: 'rgba(216,243,220,0.55)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
    marginLeft: 4,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.11)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: TEXT,
    fontSize: 15,
  },
  passwordWrap: { position: 'relative' },
  passwordInput: { paddingRight: 48 },
  eyeButton: {
    position: 'absolute',
    right: 14,
    top: 14,
  },
  primaryButton: {
    marginTop: 16,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  primaryButtonText: { color: TEXT, fontSize: 16, fontWeight: '800' },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 24,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  dividerText: { color: 'rgba(216,243,220,0.35)', fontSize: 12, fontWeight: '600' },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  googleButtonText: { color: '#111111', fontSize: 15, fontWeight: '700' },
  googleHint: {
    color: 'rgba(216,243,220,0.35)',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 16,
  },
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 28,
  },
  signUpMuted: { color: 'rgba(216,243,220,0.5)', fontSize: 14 },
  signUpLink: { color: GREEN, fontSize: 14, fontWeight: '700' },
  pressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.6 },
});
