import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInUp,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const ACCENT = '#7BF1A8';

/* ───────────────── Animated Orb ───────────────── */

export function LoadingOrb({ size = 96 }: { size?: number }) {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
    rotation.value = withRepeat(
      withTiming(360, { duration: 2000, easing: Easing.linear }),
      -1,
      false,
    );
  }, [rotation, scale]);

  const orbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
  }));

  const half = size / 2;

  return (
    <Animated.View
      style={[
        styles.loadingOrb,
        { width: size, height: size, borderRadius: half },
        orbStyle,
      ]}>
      <View
        style={[
          styles.loadingOrbInner,
          { width: size, height: size, borderRadius: half },
        ]}
      />
    </Animated.View>
  );
}

/* ───────────── Cycling Loading Steps ───────────── */

type LoadingStepsProps = {
  steps: string[];
  intervalMs?: number;
  textStyle?: object;
};

export function LoadingSteps({
  steps,
  intervalMs = 700,
  textStyle,
}: LoadingStepsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let step = 0;
    intervalRef.current = setInterval(() => {
      step += 1;
      if (step < steps.length) {
        setCurrentStep(step);
      }
    }, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [intervalMs, steps.length]);

  return (
    <Animated.View
      key={currentStep}
      entering={FadeInUp.duration(250)}
      exiting={FadeOut.duration(200)}>
      <Text style={[styles.loadingStep, textStyle]}>
        {steps[currentStep] ?? steps[steps.length - 1]}
      </Text>
    </Animated.View>
  );
}

/* ─────────────────── Styles ─────────────────── */

const styles = StyleSheet.create({
  loadingOrb: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingOrbInner: {
    backgroundColor: ACCENT,
    opacity: 0.85,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 12,
  },
  loadingStep: {
    color: 'rgba(17,17,17,0.7)',
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});
