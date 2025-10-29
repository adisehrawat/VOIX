import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function AnimatedLogo() {
  const floatY = useRef(new Animated.Value(0)).current;
  const strokeDashoffset = useRef(new Animated.Value(1000)).current;
  const circleOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Float animation (up and down)
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, {
          toValue: -10,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatY, {
          toValue: 0,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Draw path animation
    Animated.timing(strokeDashoffset, {
      toValue: 0,
      duration: 2000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();

    // Pulse animation for circles
    Animated.loop(
      Animated.sequence([
        Animated.timing(circleOpacity, {
          toValue: 0.7,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(circleOpacity, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatY, strokeDashoffset, circleOpacity]);

  return (
    <Animated.View style={{ transform: [{ translateY: floatY }] }}>
      <Svg width={253} height={211} viewBox="0 0 253 211">
        <G>
          <AnimatedCircle cx="129" cy="196" r="15" fill="#fff" opacity={circleOpacity} />
          <AnimatedCircle cx="65.5" cy="115.5" r="12.5" fill="#fff" opacity={circleOpacity} />
          <AnimatedCircle cx="217" cy="55" r="10" fill="#fff" opacity={circleOpacity} />
          <AnimatedCircle cx="7.5" cy="12.5" r="7.5" fill="#fff" opacity={circleOpacity} />
          <AnimatedCircle cx="85.5" cy="12.5" r="7.5" fill="#fff" opacity={circleOpacity} />
          <AnimatedCircle cx="180.5" cy="12.5" r="7.5" fill="#fff" opacity={circleOpacity} />
          <AnimatedCircle cx="245.5" cy="7.5" r="7.5" fill="#fff" opacity={circleOpacity} />
          <AnimatedCircle cx="33" cy="55" r="10" fill="#fff" opacity={circleOpacity} />
          <AnimatedCircle cx="128.5" cy="135.5" r="12.5" fill="#fff" opacity={circleOpacity} />
          <AnimatedPath
            d="M 9 16.5 C 29.8 48.5 55.333 92.167 65.5 110 M 65.5 110 L 119.349 184.097 C 123.5 189.807 132.101 189.536 135.883 183.575 L 216.5 56.5 L 245 10 M 65.5 110 L 128 135 M 83 10 L 128 135 M 128 135 L 182 10"
            fill="transparent"
            stroke="#fff"
            strokeWidth="3"
            strokeDasharray="1000"
            strokeDashoffset={strokeDashoffset}
          />
        </G>
      </Svg>
    </Animated.View>
  );
}
