import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BOTTOM_NAV_BAR_HEIGHT } from '@/components/vita/bottom-nav';
import { LoadingOrb, LoadingSteps } from '@/components/vita/loading-orb';
import { MeshGradientBackground } from '@/components/vita/mesh-gradient-background';
import { apiClient, getActiveUserId } from '@/lib/api-client';

const TEXT = '#111111';
const TEXT_MUTED = 'rgba(17,17,17,0.6)';
const TEXT_SOFT = 'rgba(17,17,17,0.7)';
const ACCENT = '#7BF1A8';
const ACCENT_DARK = '#6BE098';

const EXAMPLE_QUERIES = [
  'Why am I tired?',
  'How can I sleep better?',
  'Give me a recovery plan.',
  'Suggest wellness activities near me.',
];

const LOADING_STEPS = [
  'Reading sleep trends...',
  'Reviewing recovery score...',
  'Checking activity patterns...',
  'Generating recommendations...',
];

export function VitaAiScreen() {
  const insets = useSafeAreaInsets();
  const bottomPad = insets.bottom + BOTTOM_NAV_BAR_HEIGHT + 16;

  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setResponse(null);

    try {
      const userId = await getActiveUserId();
      const res = await apiClient.post<{ response: string }>('/wellness/chat', {
        userId,
        message: query.trim(),
      });
      setIsLoading(false);
      setResponse(res.response || 'Sorry, I couldn\'t process that question.');
    } catch (err) {
      console.error('AI chat failed:', err);
      setIsLoading(false);
      setResponse('Failed to connect to VITA server. Please check your backend connection.');
    }
  }, [isLoading, query]);

  const showExamples = !isLoading && !response;

  return (
    <View style={styles.root}>
      <MeshGradientBackground variant="ai" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + 48, paddingBottom: bottomPad + 88 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Animated.Text entering={FadeInDown.duration(400)} style={styles.title}>
            Ask Vita Anything
          </Animated.Text>

          <View style={styles.center}>
            {showExamples ? (
              <Animated.View entering={FadeIn.duration(300)} style={styles.examples}>
                <Text style={styles.examplesHint}>Try asking:</Text>
                {EXAMPLE_QUERIES.map((example, index) => (
                  <Animated.View key={example} entering={FadeInDown.delay(100 + index * 100)}>
                    <Pressable
                      onPress={() => setQuery(example)}
                      style={({ pressed }) => [styles.exampleChip, pressed && styles.examplePressed]}>
                      <Text style={styles.exampleText}>{example}</Text>
                    </Pressable>
                  </Animated.View>
                ))}
              </Animated.View>
            ) : null}

            {isLoading ? (
              <Animated.View entering={FadeIn.duration(300)} style={styles.loadingBlock}>
                <LoadingOrb />
                <LoadingSteps steps={LOADING_STEPS} intervalMs={700} />
              </Animated.View>
            ) : null}

            {response ? (
              <Animated.View entering={FadeInUp.duration(400)} style={styles.responseCard}>
                <Text style={styles.responseHeading}>Response</Text>
                <Text style={styles.responseBody}>{response}</Text>
                <View style={styles.responseDivider} />
                <Text style={styles.responseFootnote}>
                  Based on your health data and activity patterns
                </Text>
              </Animated.View>
            ) : null}
          </View>
        </ScrollView>

        <View style={[styles.inputBar, { paddingBottom: bottomPad }]}>
          <View style={styles.inputWrap}>
            <TextInput
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSubmit}
              placeholder="Ask Vita anything..."
              placeholderTextColor="rgba(17,17,17,0.4)"
              returnKeyType="send"
              style={styles.input}
              editable={!isLoading}
            />
            <Pressable
              onPress={handleSubmit}
              disabled={isLoading || !query.trim()}
              style={({ pressed }) => [
                styles.sendButton,
                (isLoading || !query.trim()) && styles.sendButtonDisabled,
                pressed && styles.sendPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Send message">
              <Ionicons name="send" size={20} color={TEXT} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F0FFF8' },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  title: {
    color: TEXT,
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: -0.5,
  },
  center: {
    flex: 1,
    minHeight: 280,
    justifyContent: 'center',
  },
  examples: { gap: 12 },
  examplesHint: {
    color: TEXT_MUTED,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  exampleChip: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  examplePressed: { backgroundColor: 'rgba(255,255,255,0.75)' },
  exampleText: { color: TEXT_SOFT, fontSize: 15 },
  loadingBlock: {
    alignItems: 'center',
    gap: 32,
    paddingVertical: 24,
  },
  responseCard: {
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.85)',
    padding: 24,
    shadowColor: '#111',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  responseHeading: {
    color: TEXT,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  responseBody: {
    color: 'rgba(17,17,17,0.8)',
    fontSize: 15,
    lineHeight: 24,
  },
  responseDivider: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(17,17,17,0.1)',
    marginTop: 16,
    paddingTop: 16,
  },
  responseFootnote: {
    color: 'rgba(17,17,17,0.4)',
    fontSize: 12,
  },
  inputBar: {
    paddingHorizontal: 24,
    paddingTop: 8,
    backgroundColor: 'transparent',
  },
  inputWrap: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    paddingVertical: 16,
    paddingLeft: 24,
    paddingRight: 56,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    color: TEXT,
    fontSize: 16,
  },
  sendButton: {
    position: 'absolute',
    right: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ACCENT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: { opacity: 0.45 },
  sendPressed: { backgroundColor: ACCENT_DARK },
});
