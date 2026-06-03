import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type ScoreRingProps = {
  score?: number;
  size?: number;
};

function getScoreColor(score: number) {
  if (score >= 75) return '#52B788';
  if (score >= 50) return '#F4A261';
  return '#FF6B6B';
}

export function ScoreRing({ score = 72, size = 152 }: ScoreRingProps) {
  const strokeWidth = 11;
  const radius = (size - strokeWidth) / 2 - 8;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const color = getScoreColor(score);

  const progress = useSharedValue(0);
  const labelScale = useSharedValue(0.7);
  const labelOpacity = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(300, withTiming(score / 100, { duration: 1800 }));
    labelOpacity.value = withDelay(600, withTiming(1, { duration: 400 }));
    labelScale.value = withDelay(600, withSpring(1, { damping: 14, stiffness: 200 }));
  }, [labelOpacity, labelScale, progress, score]);

  const animatedCircleProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  const labelAnimStyle = useAnimatedStyle(() => ({
    opacity: labelOpacity.value,
    transform: [{ scale: labelScale.value }],
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth={strokeWidth}
        />
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedCircleProps}
          rotation={-90}
          origin={`${center}, ${center}`}
        />
      </Svg>
      <Animated.View style={[styles.labelWrap, labelAnimStyle]}>
        <Text style={[styles.score, { color }]}>{score}</Text>
        <Text style={styles.denom}>/100</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    transform: [{ rotate: '-90deg' }],
  },
  labelWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    fontSize: 36,
    fontWeight: '900',
    lineHeight: 40,
  },
  denom: {
    fontSize: 12,
    color: 'rgba(216,243,220,0.45)',
    marginTop: 2,
  },
});
